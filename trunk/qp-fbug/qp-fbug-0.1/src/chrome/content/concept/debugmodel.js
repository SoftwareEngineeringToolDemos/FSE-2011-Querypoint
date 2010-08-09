var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var owner = QPFBUG.Classes;

    //--------------------------------- DebugModel --------------------------------
    owner.DebugModel =
        function(){
            var constructor = function(){
                 this.queryPoints = {};
                 this.nextQueryPointId = 0;
            };

            constructor.prototype = {
                addQueryPoint_Breakpoint : function(url, lineNumber, hitCount){
                    var queryPoint = new QueryPoint(++this.nextQueryPointId, DebugModel.QUERY_TYPES.BREAKPOINT,
                                                    null, null,
                                                    url, lineNumber, hitCount);

                    this.queryPoints[this.nextQueryPointId] = queryPoint;

                    return queryPoint;
                },

                addQueryPoint_LastChange : function(refPoint, valueFrameNo, valueRef){

                    // updates refPoint traceObjects
                    var type = TraceObject.TYPES.PARENT_CREATIONDATA | TraceObject.TYPES.PARENT_VALUE;
                    var traceObject = new TraceObject(type, valueFrameNo, valueRef);
                    refPoint.addTraceObject(traceObject);

                    // makes queryPoint
                    var globalObjectRef = new GlobalObjectRef(refPoint, valueFrameNo, valueRef);
                    var queryPoint = new QueryPoint(++this.nextQueryPointId, DebugModel.QUERY_TYPES.LASTCHANGE,
                                                    null, globalObjectRef,
                                                    null, null, null);

                    // updates queryPoint traceObjects
                    type = TraceObject.TYPES.PARENT_CREATIONDATA | TraceObject.TYPES.PARENT_VALUE;
                    traceObject = new TraceObject(type, 0, ".owner" );
                    queryPoint.addTraceObject(traceObject)

                    // add trace point to the list
                    this.queryPoints[this.nextQueryPointId] = queryPoint;

                    return queryPoint;
                },

                addQueryPoint_LastCondition : function(refPoint){
                    var queryPoint = new QueryPoint(++this.nextQueryPointId, DebugModel.QUERY_TYPES.LASTCONDITION,
                                                    refPoint, null,
                                                    null, null, null);

                    this.queryPoints[this.nextQueryPointId] = queryPoint;
                    return queryPoint;
                },

                getLastQueryPoint: function()
                {
                    return this.queryPoints[this.nextQueryPointId - 1];  // TODO The next is one ahead of the current
                },

                getQueryPoints: function()
                {
                    var list = [];
                    for (var p in this.queryPoints)
                    {
                        if (p !== (this.nextQueryPointId - 1) && this.queryPoints.hasOwnProperty(p))
                            list.push(this.queryPoints[p]);
                    }
                    list.push(this.queryPoints[this.nextQueryPointId - 1]);  // I guess this one has to exist ?
                    return list;
                },
                
                toString: function()
                {
                	return "[DebugModel]";
                },

            };

            constructor.QUERY_TYPES =
            {
                 BREAKPOINT : 0,
                 LASTCHANGE : 1,
                 LASTCONDITION : 2
            };

            return constructor;
        }();


    //------------------------------- QueryPoint ----------------------------------
    // trace point is kept in debug model.
    owner.QueryPoint =
        function(){
            var constructor = function(id, queryType, refPoint, globalObjectRef, url, lineNo, hitCount){
                this.id = id;
                this.queryType = queryType;

                //lastCondition
                // ref point object
                this.refPoint = refPoint;

                // lastChange
                // what we are looking for its last change
                this.globalObjectRef = globalObjectRef;

                // breakpoint
                this.url = url;
                this.lineNo = lineNo;
                this.hitCount = hitCount;

                //obj should be traced at this point
                this.traceObjects = [];
            };

            constructor.prototype = {
                addTraceObject : function(traceObject){
                    this.traceObjects.push(traceObject);
                    return traceObject;
                },
                
                toString: function()
                {
                	return "[LastChange QueryPoint "+this.url+"@"+this.lineNo+"]";
                }
            };
            return constructor;
        }();

    //------------------------------- TraceObject ----------------------------------
    // This object uniquely specifies an object at a point.
    owner.GlobalObjectRef =
        function(){
            var constructor = function(refPoint, frameNo, ref){
                this.refPoint = refPoint;
                //frame number
                this.frameNo = frameNo;
                //reference to object or value (in general it can be any expression that can be evaluated)
                this.ref = ref;

                this.propertyName = ref.substring(ref.lastIndexOf(".")+1, ref.length);
                if (ref.lastIndexOf(".") >= 0)
                    this.parentRef = ref.substring(0, ref.lastIndexOf("."));

            };

            constructor.prototype = {
                toString: function()
                {
            		return "[ObjectAtPoint]";
                }
            };

            return constructor;
        }();

    //------------------------------- TraceObject ----------------------------------
    // This object specifies data should be collect for an object at a point.
    owner.TraceObject =
        function(){
            var constructor = function(type, frameNo, ref){

                this.type = type;
                //frame number
                this.frameNo = frameNo;
                //reference to object or value (in general it can be any expression that can be evaluated)
                this.ref = ref;

                this.propertyName = ref.substring(ref.lastIndexOf(".")+1, ref.length);
                if (ref.lastIndexOf(".") >= 0)
                    this.parentRef = ref.substring(0, ref.lastIndexOf("."));
            };

            constructor.prototype = {
                toString: function()
                {
            		return "[TraceObject "+this.propertyName+"]";
                }
            };

            constructor.TYPES = {
                PARENT_NOTHING: 0,
                PARENT_CREATIONDATA: 1,
                PARENT_VALUE: 2,
                PARENT_CREATIONDATA: 4,
                OBJECT_VALUE: 8,
                ALL:127,
            }

            return constructor;
        }();

}}

};