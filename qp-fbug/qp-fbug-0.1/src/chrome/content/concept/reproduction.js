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

            var constructor = function(id, debugSession, previousReproduction){
               this.stateMachine = new StateMachine(states, "notstarted", transitions);
               this.id = id;
               this.debugSession = debugSession;
               this.previousReproduction = previousReproduction;
               this.numberOfQuerypoints = debugSession.debugModel.querypointsSize;
               this.trace = null;
               this.context = null;
            };

            constructor.prototype = {
                start : function(context){
                    this.stateMachine.startTransit("start");
                    this.context = context;
                    this.trace = new Trace();
                    this.stateMachine.endTransit();
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

                isAlreadyStarted : function(){
                    return !this.stateMachine.isState("notstarted");
                },

                newBreakEvent : function(breakEvent){

                }

            };

            return constructor;
        }();

}}

};