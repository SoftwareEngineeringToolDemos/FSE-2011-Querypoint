var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

    //--------------------------------- ScriptAnalyzer --------------------------------
    QPFBUG.Classes.ScriptAnalyzer =
        function(){

            var constructor = function(source){
                this.jsParser = JSParser.getInstance();
                if (source.match(/^(\s)*function(\s)*\(/)!=null)        //starts with function(
                {
                    source = "___XXXfunction = " + source;
                }

                this.root = this.jsParser.parse(source)
            };

            constructor.prototype = {


            }

            return constructor;
        }();

}}
};