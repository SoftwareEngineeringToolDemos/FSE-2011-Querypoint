var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- ReproductionLog --------------------------------
owner.Reproduction =

        function(){

            const states = ["notstarted", "paused", "running", "stopped"];
            const transitions = [
                    ["start", "notstarted", "running"],
                    ["pause", "running", "paused"],
                    ["resume", "paused", "running"],
                    ["stop", "paused", "stopped"]
                    ];

            var constructor = function(id, debugSession){
               this.stateMachine = new StateMachine(states, "notstarted", transitions);
               this.id = id;
               this.debugSession = debugSession;
               this.breakRequests = {}; //active breakpoints
               this.breakRequestsId = 0;
               this.breakRequests_tracePoints = [];
            };

            constructor.prototype = {
                start : function(){
                    this.stateMachine.transit("start");
                },

                pause : function(){
                    this.stateMachine.transit("pause");
                },
                resume : function(){
                    this.stateMachine.transit("resume");
                },
                stop : function(){
                    this.stateMachine.transit("stop");
                },

                newBreakEvent : function(breakEvent){

                }

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
            var constructor = function(theOwner, value ){
                this.theOwner = theOwner;
                this.value = value;
            };

            constructor.prototype = {
                // no fuctions
            };
            return constructor;
        }();

}}

//------------------------------- BreakRequest ----------------------------------
// This object uniquely specifies an object at a point.


};