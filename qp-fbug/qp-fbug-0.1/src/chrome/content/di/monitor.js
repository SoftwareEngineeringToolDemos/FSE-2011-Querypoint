var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- Monitor --------------------------------

__owner.Monitor = function(){

        var constructor = function(){
            this.counter = 0;
            this.counterInterrupt = 0;
            this.counterFunction = 0;
            this.counterBreakpoint = 0;
        };

        constructor.prototype =
        {

        };

        constructor.getInstance = function(){
            if (!QPFBUG.monitor)
            {
                QPFBUG.monitor = new Monitor();
            }
            return QPFBUG.monitor;
        };

        return constructor;
    }();
}}

};