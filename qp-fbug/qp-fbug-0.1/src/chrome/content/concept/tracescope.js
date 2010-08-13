var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //------------------------------- ScopeTrace ----------------------------------
    // This object keeps collected data from an scope.

    owner.TraceScope =
        function(){
            var constructor = function(parentScope, jsClassName, variables, values){
                this.parentScope = parentScope;
                this.jsClassName = jsClassName;
                this.variables = variables;
                this.values = values;
            };

            constructor.prototype = {
                toString: function()
                {
                    return "[TraceScope]";
                }
            };

            return constructor;
        }();

}}

};