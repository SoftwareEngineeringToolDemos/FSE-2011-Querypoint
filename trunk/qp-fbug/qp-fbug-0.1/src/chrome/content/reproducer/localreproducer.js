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

                var debugSession = Manager.getInstance().getDebugSession(debugSessionId);
                var reproduction = debugSession.getReproduction(reproductionId);

                QPFBUG.contexts[context.uid] = context;
                //set qpfbug data holder for the context
                context.qpfbug.debugSession = debugSession;
                context.qpfbug.reproduction = reproduction;
                context.qpfbug.trace = reproduction.trace;

                Manager.getInstance().enableQP(context);

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