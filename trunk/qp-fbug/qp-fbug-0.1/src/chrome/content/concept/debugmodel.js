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
                 this.tracePoints = {};
                 this.nextTracePointId = 0;
            };

            constructor.prototype = {
                addTracePoint_Breakpoint : function(url, lineNumber, hitCount){
                    var tracePoint = new TracePoint(++this.nextTracePointId, DebugModel.QUERY_TYPES.BREAKPOINT,
                                                    null, null,
                                                    url, lineNumber, hitCount);

                    this.tracePoints[this.nextTracePointId] = tracePoint;

                    return tracePoint;
                },

                addTracePoint_LastChange : function(refPoint, valueFrameNo, valueRef){

                    // updates refPoint traceObjects
                    var type = TraceObject.TYPES.PARENT_CREATIONDATA | TraceObject.TYPES.PARENT_VALUE;
                    var traceObject = new TraceObject(type, valueFrameNo, valueRef);
                    refPoint.addTraceObject(traceObject);

                    // makes tracePoint
                    var globalObjectRef = new GlobalObjectRef(refPoint, valueFrameNo, valueRef);
                    var tracePoint = new TracePoint(++this.nextTracePointId, DebugModel.QUERY_TYPES.LASTCHANGE,
                                                    null, globalObjectRef,
                                                    null, null, null);

                    // updates tracePoint traceObjects
                    type = TraceObject.TYPES.PARENT_CREATIONDATA | TraceObject.TYPES.PARENT_VALUE;
                    traceObject = new TraceObject(type, 0, ".owner" );
                    tracePoint.addTraceObject(traceObject)

                    // add trace point to the list
                    this.tracePoints[this.nextTracePointId] = tracePoint;

                    return tracePoint;
                },

                addTracePoint_LastCondition : function(refPoint){
                    var tracePoint = new TracePoint(++this.nextTracePointId, DebugModel.QUERY_TYPES.LASTCONDITION,
                                                    refPoint, null,
                                                    null, null, null);

                    this.tracePoints[this.nextTracePointId] = tracePoint;
                    return tracePoint;
                }

            };

            constructor.QUERY_TYPES =
            {
                 BREAKPOINT : 0,
                 LASTCHANGE : 1,
                 LASTCONDITION : 2
            };

            return constructor;
        }();


    //------------------------------- TracePoint ----------------------------------
    // trace point is kept in debug model.
    owner.TracePoint =
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
                // no fuctions
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
                // no fuctions
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