// This script should be loaded into QPFBUG.Classes object

with (QPFBUG.Lang){
with (QPFBUG.Classes){

    var owner = QPFBUG.Classes;
    //--------------------------------- Timer --------------------------------
    owner.Timer =
        function(){
            const states = ["notstarted", "paused", "working"];
            const transitions = [
                    ["start", "notstarted", "working"],
                    ["pause", "working", "paused"],
                    ["resume", "paused", "working"],
                    ["reset", "paused", "notstarted"]
                    ];

             var Constructor = function(){
             this.stateMachine = new StateMachine(states, "notstarted", transitions);
             //long
             this.startTime;
             //long
             this.lastStartTime;
             //long
             this.lastPauseTime;
             //long
             this.recordedTime;
             };

             Constructor.prototype = {

                start : function(){
                    this.stateMachine.startTransit("start");

                    this.startTime = currentTimeMillis();
                    this.lastStartTime = currentTimeMillis();

                    this.stateMachine.endTransit();
                },

                reset : function(){
                    this.stateMachine.startTransit("reset");
                    this.lastStartTime = 0;
                    this.lastPauseTime = 0;
                    this.recordedTime = 0;
                    this.stateMachine.endTransit();
                },

                pause : function() {
                    this.stateMachine.startTransit("pause");

                    this.lastPauseTime = currentTimeMillis();
                    this.recordedTime += this.lastPauseTime - this.lastStartTime;

                    this.stateMachine.endTransit();
                },

                resume : function() {
                    this.stateMachine.startTransit("resume");

                    this.lastStartTime = currentTimeMillis();

                    this.stateMachine.endTransit();
                },


                getRecordedTime : function() {
                    if ("paused" == (this.stateMachine.getState()))
                        return this.recordedTime;
                    else
                        return this.recordedTime + (currentTimeMillis() - this.lastStartTime);
                },

                getWholeTime : function(){
                    return currentTimeMillis() - this.startTime;
                },

                getPassedTime : function() {
                    return currentTimeMillis() - this.startTime;
                }
            }
            return Constructor;
        }();

}}