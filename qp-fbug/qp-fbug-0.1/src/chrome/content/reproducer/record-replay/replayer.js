var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------
__owner.Replayer = function(){

        var constructor = function(record){
            this.record = record;
        };

        constructor.prototype =
        {
            start : function(win) {
                trace("record items: " + this.record.length ,this.record);
                trace("win: " ,win);
                for (var i=0 ; i<this.record.length ; i++){
                    trace("replayer: " + this.record[i].originalEvent.type);
                    if (this.record[i].originalEvent.type != "resize")
                        ReplayUtils.fireEvent(win.document, win.document, this.record[i]);
                    trace("**************");
                    
                }
            },
            
            stop : function() {
            },

            onEvent : function(evt){
                evt.timestamp = (new Date()).getTime();
                this.record.push(evt);
            }
        };

        return constructor;
    }();

}}

};