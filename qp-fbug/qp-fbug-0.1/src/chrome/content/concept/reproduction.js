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
               this.nextBreakRequestsId = 0;
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

}}

};