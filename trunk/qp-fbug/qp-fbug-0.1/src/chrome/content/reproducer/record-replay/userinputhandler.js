var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------
owner.UserInputHandler = function(){

        var constructor = function(recorder, win){
            this.win = win;
            this.recorder = recorder;
            this.boundOnEvent = bind(this.onEvent, this);
        };

        constructor.prototype =
        {
            start : function() {
                var document = this.win.document;
                
                for each(var eventType in RecordReplayConstants.UI_EVENT_TYPES) {
                    document.addEventListener(eventType, this.boundOnEvent, true);
                }
                this.win.addEventListener("resize", this.boundOnEvent, true);
            },
            
            stop : function() {
                var document = this.win.document;
                
                for each(var eventType in RecordReplayConstants.UI_EVENT_TYPES) {
                    document.removeEventListener(eventType, this.boundOnEvent,true);
                }
                this.win.removeEventListener("resize", this.boundOnEvent, true);
            },

            onEvent : function(originalEvent){
                //trace(" on user input event : " + originalEvent.toString(), originalEvent);
        		var evt = new RecordedEvent("UI", originalEvent);
                if(originalEvent.type == "resize") {
//                    evt.oldWidth = this.innerDimensions.width;
//                    evt.oldHeight = this.innerDimensions.height;
//                    this.innerDimensions = {width:wdw.innerWidth,height:wdw.innerHeight};
//                    evt.newWidth = this.innerDimensions.width;
//                    evt.newHeight = this.innerDimensions.height;
                }
        		this.recorder.onEvent(evt);
            }
        };

        return constructor;
    }();

}}

};