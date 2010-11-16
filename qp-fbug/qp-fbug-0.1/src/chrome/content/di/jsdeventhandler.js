var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- JSDEventHandler --------------------------------
// Only one instance of this class is created in runtime and kept as QPFBUG.jsdEventHandler;
// The created object wraps firebug-service and controls jsd flags and hooks.
// It also overwrites firebug-service hook functions.
// WARNING: Changes to jsd flags and hooks from any other point than this object, may cause
//          bugs.
//

__owner.JSDEventHandler = function(){

        var constructor = function(){
            this.ds = DebugService.getInstance();
            this.fbs = QPFBUG.fbs;
            this.cachedContexts = {}; // map <context.uid, executionContext.tag>

        };

        constructor.prototype =
        {
            init : function(){

                // those with no changes to the original fbs function are commented

                // ----- fbs functions -----
                this.replaceFBSFunction("enableDebugger");
                this.replaceFBSFunction("onDebuggerActivated");
                //this.replaceFBSFunction("onBreak");


                // ----- jsd hooks -----
                //this.replaceFBSFunction("onScriptCreated");
                //this.replaceFBSFunction("onScriptDestroyed");
                //this.replaceFBSFunction("onDebugger");
                //this.replaceFBSFunction("onDebug");
                //this.replaceFBSFunction("onBreakpoint");
                //this.replaceFBSFunction("onThrow");
                //this.replaceFBSFunction("onError");
                //this.replaceFBSFunction("onTopLevel");
                //this.replaceFBSFunction("onInterrupt");
                //this.replaceFBSFunction("onFunction");

                // ----- hook/unhook -----
                this.replaceFBSFunction("hookScripts");
                this.replaceFBSFunction("unhookScripts");
                this.replaceFBSFunction("hookInterrupts");
                this.replaceFBSFunction("unhookInterrupts");
                this.replaceFBSFunction("hookFunctions");
                this.replaceFBSFunction("unhookFunctions");
                //this.replaceFBSFunction("hookCalls");

                var jsd = this.fbs.getJSD();

                if (jsd){  //if jsd already loaded to firebug-service (in case of running chromebug)
                    // ---- update jsd ----
                    this.fbs.unhookScripts();

                    jsd.flags = 0;

                    this.fbs.hookScripts();

                    this.fbs_hooksState = {regularHooks: true,
                        interruptHook: !!jsd.interruptHook,
                        functionHook: !!jsd.functionHook}
                }else{
                    this.fbs_hooksState = {regularHooks: true,
                        interruptHook: false,
                        functionHook: false}
                }

                this.ds_hooksState = {regularHooks: true,
                     interruptHook: false,
                     functionHook: false }

            },

            // ---------------------------------------   fbs functions -----------------------------
            // Important: Do not use "this" in the following methods.
            // because it can be jsdEventHandler or fbs.
            // enables debugger
            enableDebugger : function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_enableDebugger.apply(fbs, arguments);

                //activate object tracing
                jsdEventHandler.fbs.getJSD().flags = 0;

                return returnValue;
            },

            onDebuggerActivated : function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onDebuggerActivated.apply(fbs, arguments);

                //activate object tracing
                jsdEventHandler.fbs.getJSD().flags = 0;

                return returnValue;
            },

            // fbs onBreak
            onBreak: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onBreak.apply(fbs,arguments);
                return returnValue;
            },

            // ------------------------------------------- jsd hooks --------------------------------
            //jsd.scriptHook.onScriptCreated
            onScriptCreated: function(script){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onScriptCreated.apply(fbs, arguments);
                return returnValue;
            },

            //jsd.scriptHook.onScriptDestroyed
            onScriptDestroyed: function(script){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onScriptDestroyed.apply(fbs, arguments);
                return returnValue;
            },

            // jsd debuggerHook
            onDebugger: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;

                var returnValue = Ci.jsdIExecutionHook.RETURN_CONTINUE;

                //The special case we use for halting by debugger keyword.
                if (frame.thisValue && frame.thisValue.getWrappedValue() instanceof HaltObject)
                    return ds.onDebugger(frame, type, rv);

//                var returnValue = jsdEventHandler.fbs_onDebugger.apply(fbs, arguments);
                var returnValue = fbs.onDebugger.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.debugHook
            onDebug: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onDebug.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.breakpointHook
            onBreakpoint: function(frame, type, rv){
                Monitor.getInstance().counterBreakpoint++;

                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = Ci.jsdIExecutionHook.RETURN_CONTINUE;

                var context = jsdEventHandler.getContextFromFrame(frame);
                if (context)
                    returnValue = ds.onBreakpoint(context, frame, type, rv);

                if (context && !context.qpfbug)//only for debugging
                    return returnValue;
                // fbs removes the breakpoint from the script if it doesn't have
                // the breakpoint in its list, so it should be called
                // if this breakpoint is one of its breakpoints.
                // Consider that "isTopLevelScript" is called another time in fbs
                // and it may cause some issues.
                // To understand these lines look at fbs onBreakpoint function.
                if (fbs.isTopLevelScript(frame, type, rv))
                    return returnValue;
                var bp = fbs.findBreakpointByScript(frame.script, frame.pc);
                if (bp){
//                    returnValue = jsdEventHandler.fbs_onBreakpoint.apply(fbs,arguments);
                    returnValue = fbs.onBreakpoint.apply(fbs,arguments);
                }

                return returnValue;
            },

            // jsd.throwHook
            onThrow: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onThrow.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.errorHook
            onError: function(message, fileName, lineNo, pos, flags, errnum, exc){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onError.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.topLevelHook
            onTopLevel: function(frame, type){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onTopLevel.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.interruptHook
            onInterrupt: function(frame, type, rv){
                Monitor.getInstance().counterInterrupt++;

                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = Ci.jsdIExecutionHook.RETURN_CONTINUE;

                if (jsdEventHandler.ds_hooksState.interruptHook){
                    var context = jsdEventHandler.getContextFromFrame(frame);

                    Monitor.getInstance().test++;
                    if (context)
                        returnValue = ds.onInterrupt(context, frame, type, rv);
                }

                if (jsdEventHandler.fbs_hooksState.interruptHook)
                    returnValue = fbs.onInterrupt.apply(fbs, arguments);

                return returnValue;
            },

            // jsd.functionHook
            onFunction: function(frame, type){
                Monitor.getInstance().counterFunction++;

                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = Ci.jsdIExecutionHook.RETURN_CONTINUE;

                if (jsdEventHandler.ds_hooksState.functionHook){
                    var context = jsdEventHandler.getContextFromFrame(frame);
//                    var context = jsdEventHandler.getContextFromExecutionTag(frame);
                    if (context)
                    returnValue = ds.onFunction(context, frame, type);
                }

                if (jsdEventHandler.fbs_hooksState.functionHook)
                    returnValue = fbs.onFunction.apply(fbs, arguments);

                return returnValue;
            },

            // -------------------------------------- hook/unhook -----------------------------------
            hookScripts: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var jsd =  fbs.getJSD()

                jsdEventHandler.fbs_hookScripts.apply(fbs, arguments);

                //replace hooks
                jsd.debuggerHook = {onExecute: jsdEventHandler.onDebugger};
//                jsd.debugHook = ;
                jsd.breakpointHook = {onExecute: jsdEventHandler.onBreakpoint};
//                jsd.throwHook = ;
//                jsd.errorHook = ;
//                jsd.topLevelHook = ;

            },
            
            unhookScripts: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;

                jsdEventHandler.fbs_unhookScripts.apply(fbs, arguments);
            },
            
            hookInterrupts: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var jsd =  fbs.getJSD()

                if (this == jsdEventHandler){
                    jsdEventHandler.ds_hooksState.interruptHook = true;
                }else{
                    jsdEventHandler.fbs_hooksState.interruptHook = true;
                }

                jsdEventHandler.fbs_hookInterrupts.apply(fbs, arguments);

                //replace hooks
                jsd.interruptHook = {onExecute: jsdEventHandler.onInterrupt};
            },
            
            unhookInterrupts: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;

                if (this == jsdEventHandler){
                    jsdEventHandler.ds_hooksState.interruptHook = false;
                }else{
                    jsdEventHandler.fbs_hooksState.interruptHook = false;
                }
                if (jsdEventHandler.ds_hooksState.interruptHook || jsdEventHandler.fbs_hooksState.interruptHook)
                    return; // do not unhook

                jsdEventHandler.fbs_unhookInterrupts.apply(fbs, arguments);

            },
            
            hookFunctions: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var jsd =  fbs.getJSD()

                if (this == jsdEventHandler){
                    jsdEventHandler.ds_hooksState.functionHook = true;
                }else{
                    jsdEventHandler.fbs_hooksState.functionHook = true;
                }
                jsdEventHandler.fbs_hookFunctions.apply(fbs, arguments);

                //replace hooks
                jsd.functionHook = {onCall: jsdEventHandler.onFunction};
            },
            
            unhookFunctions: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;

                if (this == jsdEventHandler){
                    jsdEventHandler.ds_hooksState.functionHook = false;
                }else{
                    jsdEventHandler.fbs_hooksState.functionHook = false;
                }
                if (jsdEventHandler.ds_hooksState.functionHook || jsdEventHandler.fbs_hooksState.functionHook)
                    return; // do not unhook

                jsdEventHandler.fbs_unhookFunctions.apply(fbs, arguments);
            },
            
            hookCalls: function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var ds = jsdEventHandler.ds;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_hookCalls.apply(fbs, arguments);
                return returnValue;
            },

            //---------------------------------- internal functions --------------------------------
            //Todo this method may not be a reliable approach for relating an execution tag to a context
            // This function is useful for tracking an execution even after it goes out of a context.
            //
            // I assumed that different executionContext.tag may assigned to a context
            // but for each executionContext.tag there is only one context;
            // This assumption needs some proof.
            getContextFromExecutionTag: function(frame){
                var context = null;
                var contextUID = this.cachedContexts[frame.executionContext.tag];
                if (contextUID){
                    context = DebugService.getInstance().registeredContexts[contextUID];
                    return context;
                }

                //try to get context from frame
                return this.getContextFromFrame(frame);
            },

            getContextFromFrame: function(frame)
            {
                Monitor.getInstance().counter++;

                var context = null;

                  //todo contextexecution tag is not a safe way to recognize context
                  // the outer scope should also considreed

                if (DebugService.getInstance().registeredContextsNo == 0)//there is no context
                    return null;

                // this 'outerMostScope' is just the outermost scope (not necessarily
                // 'manager.win' which has 'Firebug' object)
                outerMostScope = this.fbs.getOutermostScope(frame);
                if (!outerMostScope)
                    return null;

                var winIn  = outerMostScope.wrappedJSObject;

                if (!winIn)
                    return null;

                var rootWindow = getRootWindow(winIn);

                if (rootWindow)
                {
                    for (var uid in DebugService.getInstance().registeredContexts)
                    {
                        var context = DebugService.getInstance().registeredContexts[uid];
                        if (context.window == rootWindow)
                        {
                            if(!this.cachedContexts[frame.executionContext.tag])
                                this.cachedContexts[frame.executionContext.tag] = {id:context.uid, counter:1};
                            return context;
                        }
//                        else{
//                            trace(":::: " + frame.script.fileName + " " + frame.line);
//                        }
                    }
                }
                return null;
            },


            replaceFBSFunction: function(functionName)
            {
                this["fbs_"+functionName] = this.fbs[functionName];
                this.fbs[functionName] = this[functionName];
            },

        };

        constructor.getInstance = function(){
            if (!QPFBUG.jsdEventHandler)
            {
                QPFBUG.jsdEventHandler = new JSDEventHandler();
                Lang.wrapFunctionsWithTryCatch(QPFBUG.jsdEventHandler);
                QPFBUG.jsdEventHandler.init();
            }
            return QPFBUG.jsdEventHandler;
        };

        return constructor;
    }();
}}

};