var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------
owner.Replayer = function(){

        var constructor = function(record){
            this.record = record;
            trace("record", record);
        };

        constructor.prototype =
        {
            start : function(win) {
                for (var i ; i<this.record.length ; i++){
                    trace(this.record[i].source);
                    fireEvent(win.document, win.document, record[i]);
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