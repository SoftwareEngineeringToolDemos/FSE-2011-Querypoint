var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

owner.RecordedEvent = function(){

        var constructor = function(type, originalEvent){
//            this.target = target;
            this.type = type;
            this.originalEvent = originalEvent;
        };

        constructor.prototype = {
            toString : function() {
                return (this.type + "["+ this.originalEvent.toString() + "]");
            }
        };

        return constructor;
    }();

}}

};