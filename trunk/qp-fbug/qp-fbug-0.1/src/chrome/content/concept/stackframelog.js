var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //------------------------------- StackFrameLog ----------------------------------
    // StackFrameLog
    owner.StackFrameLog =
        function(){
            var constructor = function(frame){
                //init
            };

            constructor.prototype = {
                // no fuctions
            };

            return constructor;
        }();

}}

};