var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

    //------------------------- enable debugging -----------------------------
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
            var constructor = function(win){
                this.win = win;
            };

            constructor.prototype = {

                enableDoubleDebugger : function() {

                    with(this.win){with(FBL){
                        // --------------------------- update fbs -----------------------------------

                        var old_onBreakpoint = fbs.onBreakpoint;
                        fbs.onBreakpoint = function(frame, type, val){
                            FBTrace.sysout("Execution hook, "+ frame.script.fileName + ", " +frame.line , frame);

                            if(!QPFBUG)
                                return old_onBreakpoint.apply(fbs, arguments);

                            if (!QPFBUG.enableDebugging)
                            {
                                QPFBUG.enableDebugging = {};
                                QPFBUG.enableDebugging.stopped = 0;
                                var jsdIFilter = Components.interfaces.jsdIFilter;
                                var filter = {
                                         globalObject: null,
                                         flags: jsdIFilter.FLAG_ENABLED | jsdIFilter.FLAG_PASS,
                                         urlPattern:  "*/salman.mirghasemi@gmail.com/*",
                                         startLine: 0,
                                         endLine: 0
                                     };

                                QPFBUG.enableDebugging.filter1 = filter;
                                //to ignores all other hooks
                                filter = {
                                         globalObject: null,
                                         flags: jsdIFilter.FLAG_ENABLED,
                                         urlPattern:  null,
                                         startLine: 0,
                                         endLine: 0
                                     };
                                QPFBUG.enableDebugging.filter2 = filter;
                            }

                            if (QPFBUG.enableDebugging.stopped == 2) // we let 2 pauses and therefore 2 debuggers at a time
                                return Ci.jsdIExecutionHook.RETURN_CONTINUE;

                            QPFBUG.enableDebugging.stopped++;


                            FBTrace.sysout("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
                            //because debugFrame may not exist later due to our artifial
                            // changes by calling unPause() we keep
                            // execution context reference.
                            QPFBUG.enableDebugging.executionContext = frame.executionContext;


                            FBTrace.sysout(QPFBUG.enableDebugging.stopped);
                            if (QPFBUG.enableDebugging.stopped == 1)
                            {
                                fbs.getJSD().appendFilter(QPFBUG.enableDebugging.filter1);
                                fbs.getJSD().appendFilter(QPFBUG.enableDebugging.filter2);
                                // by calling unPause we let other bp hooks happen.
                                fbs.getJSD().unPause();
                            }

                            var rv =  old_onBreakpoint.apply(fbs,arguments);

                            if (QPFBUG.enableDebugging.stopped == 1)
                            {
                                // we increase the pauseDepth to compensate our earlier
                                // unPause;
                                fbs.getJSD().pause();
                                //todo it is better to only remove those were added
                                fbs.getJSD().clearFilters();
                            }

                            QPFBUG.enableDebugging.stopped--;

                            return rv;
                        };

                        // to make sure that new hook will be applied.
                        fbs.hookScripts();

                        // ---------------------------- update debuggers ---------------------------
                        var old_registerDebugger = fbs.registerDebugger;
                        fbs.registerDebugger = function(debuggerWrapper){

                            var debuggr = debuggerWrapper.wrappedJSObject;

                            // to not update debugger more than once
                            if (!debuggr.qpfbugUpdated)
                            {
                                var old_startDebugging = debuggr.startDebugging;
                                debuggr.startDebugging = function(context)
                                {
                                    var rv = old_startDebugging.apply(debuggr, arguments);
//                                        fbs.getJSD().unPause();
                                    return rv;
                                }

                                var old_stopDebugging = debuggr.stopDebugging;
                                debuggr.stopDebugging = function(context)
                                {
                                    var rv = old_stopDebugging.apply(debuggr, arguments);
//                                        fbs.getJSD().pause();
                                }

                                var old_thaw = debuggr.thaw;
                                debuggr.thaw = function(context)
                                {
                                    try{
                                        old_thaw.apply(debuggr, arguments);
                                    }catch(e){}
                                    // this part is added because of possible exception
                                    // in debugger thow function due to invalid stackframe.
                                    if (QPFBUG.enableDebugging.executionContext.isValid)
                                    {
                                        this.unsuppressEventHandling(context);
                                        QPFBUG.enableDebugging.executionContext.scriptsEnabled = true;
                                    }
                                }
                                debuggr.qpfbugUpdated = true;
                            }
                            return old_registerDebugger.apply(fbs, arguments);
                        }
                    }}
                },

                enableDoubleDebugger_old : function(){
                    with(this.win){with(FBL){
                        // --------------------------- update fbs -----------------------------------

                       // We change fbs breakpoint hook

                        var old_onBreakpoint = fbs.onBreakpoint;
                        fbs.onBreakpoint = function(frame, type, val){
                            FBTrace.sysout("Execution hook, "+ frame.script.fileName + ", " +frame.line , frame);

//                            if ( fbs.isTopLevelScript(frame, type, val) )
//                                return Ci.jsdIExecutionHook.RETURN_CONTINUE;

                            var bp = fbs.findBreakpointByScript(frame.script, frame.pc);
                            if (bp)
                            {
//                                FBTrace.sysout("On breakpoint : bp ", bp);
                                var theDebugger = fbs.getDebuggerByName(bp.debuggerName);
                                if (!theDebugger)
                                    theDebugger = fbs.findDebugger(frame);

                                //todo: to make sure that
                                // all debuggers are updated I need to get the list of debuggers
                                // from fbs at first and update them. The next check is due to this
                                // issue.
                                if (!theDebugger.qpfbug)
                                {
                                    theDebugger.qpfbug = {};
                                }

                                if (theDebugger.qpfbug.debugging) // to prevent falling in loop
                                    return Ci.jsdIExecutionHook.RETURN_CONTINUE;

                                theDebugger.qpfbug.stopped = true;
                                var rv =  old_onBreakpoint.apply(fbs,arguments);
                                theDebugger.qpfbug.stopped = false;
                                return rv;
                            }
                            return old_onBreakpoint.apply(this,arguments);
                        };

                        // to make sure that new hook will be applied.
                        fbs.hookScripts();

                        // ---------------------------- update debuggers ---------------------------
                        var old_registerDebugger = fbs.registerDebugger;
                        fbs.registerDebugger = function(debuggerWrapper){

                            var debuggr = debuggerWrapper.wrappedJSObject;

                            //It shows the state of debugger and is used to prevent
                            // loops in calling execution hooks.
                            if (!debuggr.qpfbug)
                            {
                                debuggr.qpfbug = {};
                                debuggr.qpfbug.stopped = false;
                                //flag to prevent more than one time method update
                                // because registerDebugger may be called more than once
                                // with the same debugger.

                                var old_startDebugging = debuggr.startDebugging;
                                debuggr.startDebugging = function(context)
                                {
                                    FBTrace.sysout("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
                                    //because debugFrame may not exist later due to our artifial
                                    // changes by calling unPause() we keep
                                    // execution context reference.
                                    debuggr.qpfbug.executionContext = context.debugFrame.executionContext;
                                    var rv = old_startDebugging.apply(debuggr, arguments);
                                    // filters prevent all other hook calls except those
                                    // in this module. The reason is that whenever executionHook_Proc
                                    // is called, all stack frame data will be lost so we try to avoid
                                    // it. However, stack frame data is available only at the hit time.
                                    // After starting stepping in chromebug it will not be any longer available
                                    // because stepping is implemented by interrupt hooks.
                                    //
                                    // we use filters to make sure that from the point that we call
                                    // unpause() on jsd and therefore another hook call can happen
                                    // it only happens for the part
                                    var jsdIFilter = Components.interfaces.jsdIFilter;

                                    var filter = {
                                             globalObject: null,
                                             flags: jsdIFilter.FLAG_ENABLED | jsdIFilter.FLAG_PASS,
                                             urlPattern:  "*/salman.mirghasemi@gmail.com/*",
                                             startLine: 0,
                                             endLine: 0
                                         };
                                    debuggr.qpfbug.filter1 = filter;

                                    var filter = {
                                             globalObject: null,
                                             flags: jsdIFilter.FLAG_ENABLED | jsdIFilter.FLAG_PASS,
                                             urlPattern:  "*/fbtest/*",
                                             startLine: 0,
                                             endLine: 0
                                         };
                                    debuggr.qpfbug.filter_test = filter;

                                    //ignores all other
                                    filter = {
                                             globalObject: null,
                                             flags: jsdIFilter.FLAG_ENABLED,
                                             urlPattern:  null,
                                             startLine: 0,
                                             endLine: 0
                                         };
                                    debuggr.qpfbug.filter2 = filter;

                                    fbs.getJSD().appendFilter(debuggr.qpfbug.filter1);
//                                    fbs.getJSD().appendFilter(debuggr.qpfbug.filter_test);
                                    fbs.getJSD().appendFilter(debuggr.qpfbug.filter2);

                                    // by calling unPause we let other bp hooks happen.
                                    fbs.getJSD().unPause();
                                    return rv;
                                }

                                var old_stopDebugging = debuggr.stopDebugging;
                                debuggr.stopDebugging = function(context)
                                {
                                    var rv = old_stopDebugging.apply(debuggr, arguments);

                                    // we increase the pauseDepth to compensate our earlier
                                    // unPause;
                                    fbs.getJSD().pause();
                                    fbs.getJSD().removeFilter(debuggr.qpfbug.filter1);
//                                    fbs.getJSD().removeFilter(debuggr.qpfbug.filter_test);
                                    fbs.getJSD().removeFilter(debuggr.qpfbug.filter2);
                                }


                                var old_thaw = debuggr.thaw;
                                debuggr.thaw = function(context)
                                {
                                    try{
                                        old_thaw.apply(debuggr, arguments);
                                    }catch(e){}
                                    // this part is added because of possible exception
                                    // in debugger thow function due to invalid stackframe.
                                    if (debuggr.qpfbug.executionContext.isValid)
                                    {
                                        this.unsuppressEventHandling(context);
                                        debuggr.qpfbug.executionContext.scriptsEnabled = true;
                                    }
                                }

                            }
                            return old_registerDebugger.apply(fbs, arguments);
                        }
                    }}
                }
            };
            return constructor;
        }();
}}

};
