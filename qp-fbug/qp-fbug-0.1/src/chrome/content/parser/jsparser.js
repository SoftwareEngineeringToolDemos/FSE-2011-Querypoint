var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

    //--------------------------------- JSParser --------------------------------
    QPFBUG.Classes.JSParser =
        function(){

            var constructor = function(){
                var loader = Cc["@mozilla.org/moz/jssubscript-loader;1"].getService(Ci.mozIJSSubScriptLoader);
                loader.loadSubScript("resource://qpfbug/parser/jsdefs.js", this);
                loader.loadSubScript("resource://qpfbug/parser/jsparse.js", this);
            };

            constructor.prototype = {

//                parse : function(source){
//                }

            }

            constructor.getInstance = function(){
                if (!QPFBUG.jsParser)
                {
                    QPFBUG.jsParser = new JSParser();
                }
                return QPFBUG.jsParser;
            };

            return constructor;
        }();

}}
};