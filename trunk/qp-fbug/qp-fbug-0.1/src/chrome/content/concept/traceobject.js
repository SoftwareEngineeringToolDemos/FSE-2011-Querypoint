var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //------------------------------- TraceObject ----------------------------------

    __owner.TraceObject =
        function(){
            var constructor = function(){
                this.id = 0;
                this.creatorURL = null;
                this.creatorLine = 0;
                this.constructorURL = null;
                this.constructorLine = 0;
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