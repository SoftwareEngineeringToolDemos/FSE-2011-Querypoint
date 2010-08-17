var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- ReproductionLog --------------------------------
__owner.Reproduction =

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
               this.breakRequests_querypoints = [];
               this.trace = new Trace();
            };

            constructor.prototype = {
                start : function(){
                    this.stateMachine.transit("start");
                },

                pause : function(){
                    this.stateMachine.transit("pause");
                },
                resume : function(){
                    this.stateMachine.startTransit("resume");
                    //collect data before resume
                    this.stateMachine.endTransit();
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