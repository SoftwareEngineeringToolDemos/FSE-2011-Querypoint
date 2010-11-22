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
            var constructor = function(queryData, parentTraceObject, value){
                this.queryData = queryData;

                this.parentTraceObject = parentTraceObject;
                this.value = value;

//                this.scopeType;


                //scopeType
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