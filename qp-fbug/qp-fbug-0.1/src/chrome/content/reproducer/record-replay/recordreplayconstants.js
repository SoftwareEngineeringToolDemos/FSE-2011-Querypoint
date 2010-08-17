var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- JSDConstants --------------------------------
__owner.RecordReplayConstants = {

        RECORDED_EVENT_TYPES : ["INIT", "DOM","JS","UI"],
                            
        //user input
        // on doc
        UI_EVENT_TYPES : ["mousemove","mouseover","mouseout","scroll","textInput",
                            "keydown","keyup","mousedown","mouseup"], 
        // on win                    
        //resize
    };
}}
};