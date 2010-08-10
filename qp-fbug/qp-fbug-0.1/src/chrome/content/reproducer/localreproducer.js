var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

owner.LocalReproducer = function(){

        var constructor = function(){
        };

        constructor.prototype =
        {

            reproduce: function (context, debugSessionId, reproductionId)
            {
                var Firebug = context.Firebug; // we are in a module and don't have access to Firebug in this scope.
                Firebug.Debugger.rerun(context);
            },

            toString: function()
            {
                return "[CallStackReproducer]";
            },

        };

        return constructor;
    }();

}}

};