var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------
owner.Recorder = function(){

        var constructor = function(win){
            this.win = win;
            this.record = [];
            this.userInputHandler = new UserInputHandler(this, this.win)
        };

        constructor.prototype =
        {
            start : function() {
                this.userInputHandler.start();
            },
            
            stop : function() {
                this.userInputHandler.stop();
            },

            onEvent : function(evt){
                evt.timestamp = (new Date()).getTime();
                this.record.push(evt);
            },
        };

        return constructor;
    }();

}}

};