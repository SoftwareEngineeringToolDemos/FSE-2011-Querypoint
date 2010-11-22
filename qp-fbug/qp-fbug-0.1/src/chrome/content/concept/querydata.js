var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var __owner = QPFBUG.Classes;

    //------------------------------- QueryData ----------------------------------
    // This object specifies data should be collected for an object at a point.
    // @Deprecated
    __owner.QueryData =
        function(){
            var constructor = function(queryExpr){

                this.queryExpr = queryExpr;
            };

            constructor.prototype = {
                toString: function()
                {
            		return "[QueryData]";
                }
            };

            return constructor;
        }();

}}

};