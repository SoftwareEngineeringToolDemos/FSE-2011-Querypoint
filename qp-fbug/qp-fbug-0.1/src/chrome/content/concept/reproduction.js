// This script should be loaded into QPFBUG.Classes object
with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- ReproductionLog --------------------------------
owner.Reproduction =
        function(){
            var constructor = function(id, debugSession){
               this.id = id;
               this.debugSession = debugSession;
            };

            constructor.prototype = {
            };
            return constructor;
        }();


//------------------------------- TracePointLog ----------------------------------
// trace point is kept in debug model.
owner.TracePointLog =
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

//------------------------------- TraceObjectLog ----------------------------------
// This object uniquely specifies an object at a point.

owner.TraceObjectLog =
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