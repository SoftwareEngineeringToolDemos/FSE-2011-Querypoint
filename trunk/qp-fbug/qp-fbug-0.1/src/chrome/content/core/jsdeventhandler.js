var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- JSDEventHandler --------------------------------
// Only one instance of this class will be created and it is kept in QPFBUG.jsdEventHandler;
// The created object wraps firebug-service and controls jsd flags and hooks.
// It als overwrites firebug-service hook functions.
// WARNING: Changes to jsd flags and hooks from any other point than this object, may cause
//    bugs.
//

owner.JSDEventHandler = function(){

        var constructor = function(fbs){
            this.fbs = fbs;
        };

        constructor.prototype =
        {
            init : function(){

                // those with no changes to the original fbs function are commented

                // ----- fbs functions -----
                this.replaceFBSFunction("enableDebugger");
                //this.replaceFBSFunction("onBreak");


                // ----- jsd hooks -----
                //this.replaceFBSFunction("onScriptCreated");
                //this.replaceFBSFunction("onScriptDestroyed");
                //this.replaceFBSFunction("onDebugger");
                //this.replaceFBSFunction("onDebug");
                this.replaceFBSFunction("onBreakpoint");
                //this.replaceFBSFunction("onThrow");
                //this.replaceFBSFunction("onError");
                //this.replaceFBSFunction("onTopLevel");
                this.replaceFBSFunction("interruptHook");
                this.replaceFBSFunction("functionHook");

                // ----- hook/unhook -----
                //this.replaceFBSFunction("hookScripts");
                //this.replaceFBSFunction("unhookScripts");
                this.replaceFBSFunction("unhookInterrupts");
                this.replaceFBSFunction("hookInterrupts");
                this.replaceFBSFunction("hookFunctions");
                this.replaceFBSFunction("unhookFunctions");
                //this.replaceFBSFunction("hookCalls");

                // ---- update jsd ----
                this.fbs.unhookScripts();
                this.fbs.getJSD().flags = 0;

                this.hooksState = {regularHooks: true,
                     interruptHook: false,
                     functionHook: false
                }

                this.fbs_hooksState = {regularHooks: true,
                    interruptHook: !!this.fbs.getJSD().interruptHook,
                    functionHook: !!this.fbs.getJSD().functionHook
                    }
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
                this.fbs.getJSD().flags = 0;

                return returnValue;
            },

            // fbs onBreak
            onBreak: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onBreak.apply(fbs,arguments);
                return returnValue;
            },

            // ------------------------------------------- jsd hooks --------------------------------
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

            // jsd.interruptHook
            interruptHook: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                var done = QPFBUG.manager.onInterrupt(frame, type, rv);
                if (done || !jsdEventHandler.fbs_hooksState.interruptHook)
                    return Components.interfaces.jsdIExecutionHook.RETURN_CONTINUE;

                var returnValue = jsdEventHandler.fbs_interruptHook.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.functionHook
            functionHook: function(frame, type){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                var done = QPFBUG.manager.onFunction(frame, type, rv);
                if (done || !jsdEventHandler.fbs_hooksState.functionHook)
                    return Components.interfaces.jsdIExecutionHook.RETURN_CONTINUE;

                var returnValue = jsdEventHandler.fbs_functionHook.apply(fbs, arguments);
                return returnValue;
            },

            // -------------------------------------- hook/unhook -----------------------------------
            hookScripts: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                jsdEventHandler.fbs_hookScripts.apply(fbs, arguments);
            },
            
            unhookScripts: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                jsdEventHandler.fbs_unhookScripts.apply(fbs, arguments);
            },
            
            hookInterrupts: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                if (this == jsdEventHandler){
                    jsdEventHandler.hooksState.interruptHook = true;
                }else{
                    jsdEventHandler.fbs_hooksState.interruptHook = true;
                }

                jsdEventHandler.fbs_hookInterrupts.apply(fbs, arguments);
            },
            
            unhookInterrupts: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                if (this == jsdEventHandler){
                    jsdEventHandler.hooksState.interruptHook = false;
                }else{
                    jsdEventHandler.fbs_hooksState.interruptHook = false;
                }
                if (jsdEventHandler.hooksState.interruptHook || jsdEventHandler.fbs_hooksState.interruptHook)
                    return; // do not unhook

                jsdEventHandler.fbs_unhookInterrupts.apply(fbs, arguments);
            },
            
            hookFunctions: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                if (this == jsdEventHandler){
                    jsdEventHandler.hooksState.functionHook = true;
                }else{
                    jsdEventHandler.fbs_hooksState.functionHook = true;
                }

                jsdEventHandler.fbs_hookFunctions.apply(fbs, arguments);
            },
            
            unhookFunctions: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                if (this == jsdEventHandler){
                    jsdEventHandler.hooksState.functionHook = false;
                }else{
                    jsdEventHandler.fbs_hooksState.functionHook = false;
                }
                if (jsdEventHandler.hooksState.functionHook || jsdEventHandler.fbs_hooksState.functionHook)
                    return; // do not unhook

                jsdEventHandler.fbs_unhookFunctions.apply(fbs, arguments);
            },
            
            hookCalls: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_hookCalls.apply(fbs, arguments);
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