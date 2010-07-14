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
                 this.QUERY_TYPES =
                 {
                     BREAKPOINT : 0,
                     LASTCHANGE : 1,
                     LASTCONDITION : 2
                 };

                 this.tracePoints = {};
                 this.tracePointId = 0;
            };

            constructor.prototype = {

                addTracePoint_Breakpoint : function(url, lineNumber, hitCount){
                    var tracePoint = new TracePoint(tracePointId++, this.QUERYT_TYPES.BREAKPOINT,
                                                    null, null,
                                                    url, lineNumber, hitCount);

                    this.tracePoints[tracePointId] = tracePoint;
                    return tracePoint;
                },

                addTracePoint_LastChange : function(refPoint, refObj){
                    var tracePoint = new TracePoint(tracePointId++, this.QUERYT_TYPES.LASTCHANGE,
                                                    refPoint, refObject,
                                                    null, null, null);

                    //add traceObject to this point and the related point
                    this.tracePoints[tracePointId] = tracePoint;
                    return tracePoint;
                },
                addTreacePoint_LastCondition : function(refPoint){
                    var tracePoint = new TracePoint(tracePointId++, this.QUERYT_TYPES.LASTCONDITION,
                                                    refPoint,
                                                    null, null, null);
                    this.tracePoints[tracePointId] = tracePoint;
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
                this.refPoint = refPoint;
                this.refObj = refObj;

                // breakpoint
                this.url = url;
                this.lineNumber = lineNumber;
                this.hitCount = hitCount;
            };

            constructor.prototype = {
                addTraceObject : function(frame, ref){
                    var traceObject = new TraceObject(frame, ref);
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