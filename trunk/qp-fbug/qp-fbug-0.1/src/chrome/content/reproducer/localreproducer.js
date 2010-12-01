var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

__owner.LocalReproducer = function(){

        var constructor = function(){
        };

        constructor.prototype =
        {

            reproduce: function (context, debugSessionId, reproductionId)
            {
                var Firebug = context.qpfbug.Firebug; // we are in a module and don't have access to Firebug in this scope.

                Manager.getInstance().onReproductionStart(context, debugSessionId);

//                Firebug.Debugger.rerun(context);
                Firebug.Debugger.localRerun(context);
            },

            toString: function()  // todo to base class
            {
                return "["+this.name+"Reproducer]";
            },

            name: "Callstack",

        };

        return constructor;
    }();

}}

};