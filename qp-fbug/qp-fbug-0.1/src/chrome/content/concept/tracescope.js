var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //------------------------------- ScopeTrace ----------------------------------
    // This object keeps collected data from an scope.

    __owner.TraceScope =
        function(){
            var constructor = function(parentScope, jsClassName, variableValues){
                this.parentScope = parentScope;
                this.jsClassName = jsClassName;
                this.variableValues = variableValues;
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