var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //------------------------------- TraceObject ----------------------------------
    // This object keeps collected data from an objects.

    owner.TraceObject =
        function(){
            var constructor = function(queryData, parentValue, value){
                this.queryData = queryData;
                this.parentValue = parentValue ;
                this.value = value;
                this.parentCreatorURL = null;
                this.parentCreatorLine = 0;
                this.parentConstructorURL = null;
                this.parentConstructorLine = 0;
            };

            constructor.prototype = {
                toString: function()
                {
                    return "[TraceObject]";
                }
            };

            return constructor;
        }();

}}

};