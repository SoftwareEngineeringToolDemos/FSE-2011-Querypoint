var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- EventRequest --------------------------------
__owner.HaltObject = function(){

        var constructor = function(context, callBack){
            this.context = context;
            this.callBack = callBack;
        };

        constructor.prototype =
        {
            halt: function(){
                debugger;
            },
        };
        return constructor;

    }();
}}
};