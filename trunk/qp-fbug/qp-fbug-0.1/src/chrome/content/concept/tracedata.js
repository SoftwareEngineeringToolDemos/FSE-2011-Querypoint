var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //------------------------------- TraceData ----------------------------------
    // This object keeps collected data from an objects.

    __owner.TraceData =
        function(){
            var constructor = function(queryExpr, value){
                this.queryExpr = queryExpr;

                this.parentTrace = null;  //a traceObject or a traceScope

                this.value = value;
            };

            constructor.prototype = {
                toString: function()
                {
                    return "[TraceData]";
                }

            };

            return constructor;
        }();

}}

};