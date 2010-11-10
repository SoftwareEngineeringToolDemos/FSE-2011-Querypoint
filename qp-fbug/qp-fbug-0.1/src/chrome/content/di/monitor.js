var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- Monitor --------------------------------

__owner.Monitor = function(){

        var constructor = function(){

            //jsdeventhandler
            this.counter = 0;
            this.counterInterrupt = 0;
            this.counterFunction = 0;
            this.counterBreakpoint = 0;

            //debugservice
            this.ds_counterInterrupt = 0;
            this.ds_counterFunction = 0;
            this.ds_counterBreakpoint = 0;
            this.ds_objectCreation = 0;
            this.ds_propertyChanged = 0;

            this.test = 0;
        };

        constructor.prototype =
        {
            reset : function(){
                for (p in this){
                    if (typeof(this[p])=="number"){
                        this[p] = 0;
                    }
                }
            }
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