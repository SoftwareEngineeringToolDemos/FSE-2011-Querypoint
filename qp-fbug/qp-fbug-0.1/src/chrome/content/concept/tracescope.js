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
                this.id = null;
                this.parentScope = parentScope;
                this.jsClassName = jsClassName;
                this.variableValues = variableValues;

                //if the scope is a regular js object
                this.creatorURL = null;
                this.creatorLine = 0;
                this.constructorURL = null;
                this.constructorLine = 0;

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