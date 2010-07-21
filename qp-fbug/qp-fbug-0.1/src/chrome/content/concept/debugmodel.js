var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){
var owner = QPFBUG.Classes;

//--------------------------------- DebugModel --------------------------------
owner.DebugModel =
        function(){
            var constructor = function(){
                 this.tracePoints = {};
                 this.tracePointId = 0;
            };

            constructor.prototype = {
                 QUERY_TYPES :
                 {
                     BREAKPOINT : 0,
                     LASTCHANGE : 1,
                     LASTCONDITION : 2
                 },
                addTracePoint_Breakpoint : function(url, lineNumber, hitCount){
                    var tracePoint = new TracePoint(++this.tracePointId, DebugModel.QUERY_TYPES.BREAKPOINT,
                                                    null, null,
                                                    url, lineNumber, hitCount);

                    this.tracePoints[this.tracePointId] = tracePoint;
                    return tracePoint;
                },

                addTracePoint_LastChange : function(refPointId, valueFrame, valueRef){

                    var refPoint = this.tracePoints[refPointId];

                    var refObj = new TraceObject(valueFrame, valueRef);
                    refPoint.addTraceObject(refObj);

                    var tracePoint = new TracePoint(++this.tracePointId, DebugModel.QUERY_TYPES.LASTCHANGE,
                                                    refPoint, refObj,
                                                    null, null, null);

                    //add traceObject to this point and the related point
                    var localTraceObject = new TraceObject(0, ".owner" );
                    tracePoint.addTraceObject(localTraceObject)
                    this.tracePoints[this.tracePointId] = tracePoint;

                    return tracePoint;
                },

                addTreacePoint_LastCondition : function(refPointId){
                    var tracePoint = new TracePoint(++this.tracePointId, DebugModel.QUERY_TYPES.LASTCONDITION,
                                                    refPointId, null,
                                                    null, null, null);

                    this.tracePoints[this.tracePointId] = tracePoint;
                    return tracePoint;
                }

            };

            return constructor;
        }();


//------------------------------- TracePoint ----------------------------------
// trace point is kept in debug model.
owner.TracePoint =
        function(){
            var constructor = function(id, queryType, refPoint, refObj, url, lineNumber, hitCount){
                this.id = id;
                this.queryType = queryType;

                // lastChange
                // ref point object
                this.refPoint = refPoint;
                // refObj at refPoint
                this.refObj = refObj;

                // breakpoint
                this.url = url;
                this.lineNumber = lineNumber;
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
owner.TraceObject =
        function(){
            var constructor = function(frame, ref ){
                //frame number
                this.frame = frame;
                this.ref = ref;
            };

            constructor.prototype = {
                // no fuctions
            };
            return constructor;
        }();

}}

};