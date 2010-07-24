var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- JSDEventHandler --------------------------------
// Only one instance of this class will be created and it is kept in QPFBUG.jsdEventHandler;

// WARNING: It only changee the onXXX functions, but there is no change on hookScripts, unhookScripts.
// So fbs controls when hooks are active
//

owner.JSDEventHandler = function(){

        var constructor = function(fbs){
            this.fbs = fbs;
        };

        constructor.prototype =
        {
            init : function(){
                this.replaceFBSFunction("enableDebugger");
                this.replaceFBSFunction("onScriptCreated");
                this.replaceFBSFunction("onScriptDestroyed");
                this.replaceFBSFunction("onDebugger");
                this.replaceFBSFunction("onDebug");
                this.replaceFBSFunction("onBreak");
                this.replaceFBSFunction("onBreakpoint");
                this.replaceFBSFunction("onThrow");
                this.replaceFBSFunction("onError");
                this.replaceFBSFunction("onTopLevel");
                this.fbs.unhookScripts();
                this.fbs.getJSD().flags = 0;
                this.fbs.hookScripts();

            },


            // ---------------------------------------   fbs functions -----------------------------
            // Do not use "this" in the following methods.
            // because it can be jsdEventHandler or fbs.
            // enables debugger
            enableDebugger : function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_enableDebugger.apply(fbs, arguments);

                //activate object tracing
                fbs.getJSD().flags = 0;
                return returnValue;
            },
            //jsd.scriptHook.onScriptCreated
            onScriptCreated: function(script){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onScriptCreated.apply(fbs, arguments);
                return returnValue;
            },

            //jsd.scriptHook.onScriptDestroyed
            onScriptDestroyed: function(script){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onScriptDestroyed.apply(fbs, arguments);
                return returnValue;
            },

            // jsd debuggerHook
            onDebugger: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onDebugger.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.debugHook
            onDebug: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onDebug.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.breakpointHook
            onBreakpoint: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                var done = QPFBUG.manager.onBreak(frame, type, rv);

                if (done)
                    return Components.interfaces.jsdIExecutionHook.RETURN_CONTINUE;

                var returnValue = jsdEventHandler.fbs_onBreakpoint.apply(fbs,arguments);
                return returnValue;

            },

            // jsd.throwHook
            onThrow: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onThrow.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.errorHook
            onError: function(message, fileName, lineNo, pos, flags, errnum, exc){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onError.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.topLevelHook
            onTopLevel: function(frame, type){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onTopLevel.apply(fbs, arguments);
                return returnValue;
            },


            // fbs onBreak
            onBreak: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                // avoid step_out from web page to chrome
                if (type==Components.interfaces.jsdIExecutionHook.TYPE_INTERRUPTED)
                {
                    var done = QPFBUG.manager.onInterrupt(frame, type, rv);

                    if (done)
                        return Components.interfaces.jsdIExecutionHook.RETURN_CONTINUE;
                }

                var returnValue = jsdEventHandler.fbs_onBreak.apply(fbs,arguments);
                return returnValue;

            },

            //---------------------------------- internal functions --------------------------------
            replaceFBSFunction: function(functionName)
            {
                this["fbs_"+functionName] = this.fbs[functionName];
                this.fbs[functionName] = this[functionName];
            }

        };


        constructor.getInstance = function(fbs){
            if (!QPFBUG.jsdEventHandler)
            {
                QPFBUG.jsdEventHandler = new JSDEventHandler(fbs);
                QPFBUG.jsdEventHandler.init();
            }
            return QPFBUG.jsdEventHandler;
        };

        return constructor;
    }();
}}

};