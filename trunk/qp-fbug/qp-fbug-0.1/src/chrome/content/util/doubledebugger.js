var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    const DBG_DOUBLEDEBUGGER = false;

    //------------------------- enable double debuggers -----------------------------
    // This function changes Firebug in a way that I can debug my code in chromebug
    // when firebug paused the page execution.
    // This function should not be called in the release versions.
    // The whole reason for such change is that JSD is one object in whole firefox
    // process and it is build to support only one hook execution at a
    // time. After finishing one hook execution it invalidate all stackFrame data.
    // The reason behind this limitation of JSD is to prevent loops like (breakpoint hit
    // , hook, breakpiont hit, hook ...)
    // I can handle this issue by setting a flag on each firebug stopped debugger
    // Now we can artificially call unPause function of JSD to keep hooks enabled.
    // The new problem is that JSD invalidated all stack frame data after hook execution.
    // So if during one hook execution another hook starts and finishes, the stack
    // frame date is no longer available for the first executing hook.
    //
    // JSD :  ExecutionHook_Proc, Pause, EnterNestedLoop
    // JSD ExecutionHook_Proc:   ... -> pause -> call hook -> unpause ..
    //
    //  EnterNestedLoop allows new UI operations without returning back through the debugger
    //         to get to the base UI event loop. So in hook this method is called.
    // debugger hook:  enterNestedLoop(callback)
    // debugger ui : exitNestedLoop  (for example by resume button)
    // JSD enterNestedLoop: ... pause -> callback -> unpause ...



    QPFBUG.Classes.DoubleDebugger =

        function(){
            var constructor = function(fbs){
                this.fbs = fbs;
                this.fbs_onBreakpoint = this.fbs.onBreakpoint;
                this.fbs_registerDebugger = this.fbs.registerDebugger;

                this.stopped = 0;
                var jsdIFilter = Ci.jsdIFilter;

                this.filters = [];

                var filter = {
                         globalObject: null,
                         flags: jsdIFilter.FLAG_ENABLED | jsdIFilter.FLAG_PASS,
                         urlPattern:  "*/salman.mirghasemi@gmail.com/*",
                         startLine: 0,
                         endLine: 0
                     };

                this.filters.push(filter);

                var filter = {
                         globalObject: null,
                         flags: jsdIFilter.FLAG_ENABLED | jsdIFilter.FLAG_PASS,
                         urlPattern:  "*/hot_deploy.js",
                         startLine: 0,
                         endLine: 0
                     };

                this.filters.push(filter);

                //to ignores all other hooks
                filter = {
                         globalObject: null,
                         flags: jsdIFilter.FLAG_ENABLED,
                         urlPattern:  null,
                         startLine: 0,
                         endLine: 0
                     };
                this.filters.push(filter);

            };

            constructor.prototype = {

                enableDoubleDebugging : function() {
                    if (QPFBUG.doubleDebugger.enabled)
                        return;
                    QPFBUG.doubleDebugger.enabled = true;
                        // --------------------------- update fbs -----------------------------------
                         var fbs = this.fbs;
                         fbs.onBreakpoint = function(frame, type, val){
                            if (DBG_DOUBLEDEBUGGER)
                                trace("Execution hook, "+ frame.script.fileName + ", " +frame.line , frame);

                            if (QPFBUG.doubleDebugger.stopped == 2) // we let 2 pauses and therefore 2 debuggers at a time
                                return Ci.jsdIExecutionHook.RETURN_CONTINUE;

                            QPFBUG.doubleDebugger.stopped++;

                            if (DBG_DOUBLEDEBUGGER)
                                trace("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<, stopped: " + QPFBUG.doubleDebugger.stopped);
                            //because debugFrame may not exist later due to our artificial
                            // changes by calling unPause() we keep
                            // execution context reference.
                            QPFBUG.doubleDebugger.executionContext = frame.executionContext;

                            if (QPFBUG.doubleDebugger.stopped == 1)
                            {
                                for (let i=0 ; i<QPFBUG.doubleDebugger.filters.length; i++)
                                {
                                    fbs.getJSD().appendFilter(QPFBUG.doubleDebugger.filters[i]);
                                }

                                // by calling unPause we let other bp hooks happen.
                                fbs.getJSD().unPause();
                            }

                            var rv = Components.interfaces.jsdIExecutionHook.RETURN_CONTINUE;
                            try{
                                rv =  QPFBUG.doubleDebugger.fbs_onBreakpoint.apply(fbs,arguments);
                            }catch(e)
                            {
                                trace("FBS onBreakpoint Exception! : " + e, e)
                            }

                            if (QPFBUG.doubleDebugger.stopped == 1)
                            {
                                // we increase the pauseDepth to compensate our earlier
                                // unPause;
                                fbs.getJSD().pause();
                                for (let i=0 ; i<QPFBUG.doubleDebugger.filters.length; i++)
                                {
                                    fbs.getJSD().removeFilter(QPFBUG.doubleDebugger.filters[i]);
                                }
                            }

                            QPFBUG.doubleDebugger.stopped--;

                            return rv;
                        };

                        // to make sure that new hook will be applied.
                        fbs.hookScripts();

                        // ---------------------------- update debuggers ---------------------------
                        fbs.registerDebugger = function(debuggerWrapper){

                            var debuggr = debuggerWrapper.wrappedJSObject;

                            // to not update debugger more than once
                            if (!debuggr.qpfbugUpdated)
                            {
                                var old_thaw = debuggr.thaw;
                                debuggr.thaw = function(context)
                                {
                                    try{
                                        old_thaw.apply(debuggr, arguments);
                                    }catch(e){}
                                    // this part is added because of possible exception
                                    // in debugger thow function due to invalid stackframe.
                                    if (QPFBUG.doubleDebugger.executionContext.isValid)
                                    {
                                        this.unsuppressEventHandling(context);
                                        QPFBUG.doubleDebugger.executionContext.scriptsEnabled = true;
                                    }
                                }
                                debuggr.qpfbugUpdated = true;
                            }
                            return QPFBUG.doubleDebugger.fbs_registerDebugger.apply(fbs, arguments);
                        }

                },

                disableDoubleDebugging : function() {
                    this.fbs.onBreakpoint = this.fbs_onBreakpoint;
                    this.fbs.registerDebugger = this.fbs_registerDebugger;
                    QPFBUG.doubleDebugger.enabled = false;
                }
            };

            constructor.getInstance = function(){
                if (!QPFBUG.doubleDebugger)
                {
                    var fbs = QPFBUG.fbs;
                    QPFBUG.doubleDebugger = new DoubleDebugger(fbs);
                }
                return QPFBUG.doubleDebugger;
            };

            return constructor;
        }();
}}

};
