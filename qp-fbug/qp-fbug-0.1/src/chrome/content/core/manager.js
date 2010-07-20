var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- Manager --------------------------------

owner.Manager = function(){

            var constructor = function(win){
               this.win = win;
               this.dataStore = new DataStore();
               this.view = new View(win);
               this.reproducer = new Reproducer(win);
            };

            constructor.prototype =
            {
                //------------------------------ event handling -----------------------------------------
                initialize : function(){
                    with(this.win){with(FBL){

                        var jsd = Cc["@mozilla.org/js/jsd/debugger-service;1"].getService(Ci.jsdIDebuggerService);
                        jsd.flags = 0; //activating object creation tracing

                        if(FBTrace.DBG_QPFBUG)
                            this.enableDebugging();
                        //update view

                        this.reproducer.init();
                    }}

                },

                initializeUI :function(){
                    this.view.init();
                },
                initContext : function(context){
                    with (this.win){
                        var debugSession;
                        var reproduction;

                        var tabBrowser = FBL.$("content");
                        var selectedTab = tabBrowser.selectedTab;

                        var reproductionId = selectedTab.getAttribute("reproductionId");
                        if (reproductionId)
                        {
                            reproduction = this.dataStore.getReproduction(reproductionId);
                            debugSession = this.dataStore.getDebugSessionForReproduction(reproductionId);
                            //to select this context
                            Firebug.selectContext(context);

                        }

                        if (!debugSession)
                        {
                            debugSession = this.dataStore.newDebugSession();
                            reproduction = this.dataStore.newReproduction(debugSession.id);
                            if (FBTrace.DBG_QPFBUG)
                                  FBTrace.sysout("New debug session was created." , debugSession);
                        }

                        context.debugSession = debugSession;
                        context.reproduction = reproduction;
                        // analyze debug model
                        var debugModel = debugSession.debugModel;

                        debugModel.tracePoints;

                            //set bps

                        // set breakpoint as javascripts are loaded
                        // store points
                        // find the right one.

                        object = context.window;
                        if (object.wrappedJSObject)
                                 object = object.wrappedJSObject;
                    };

                },

                loadedContext: function(context){

                },

                //------------------------- actions ---------------------------------------
                addLastChange: function(context, owner, propertyPath){
                     with(this.win){
                         var debugSession = context.debugSession;
                         var reproduction = context.reproduction;
                         var debugModel = debugSession.debugModel;


                         Firebug.Console.log(context.stopped);

                         if (context.stopped)
                         {
                            //add current breakpoint as a point
                            // todo breakpoint is not enough, we should get the hit count
                            // we also need the all steps (step in, steps over, steps out)
                            // taken before reaching this point

                            var href = context.executingSourceFile.href;
                            var line = context.debugFrame.line;
                            var fileName = context.debugFrame.script.fileName;
                            var bp = FBL.fbs.findBreakpoint(href, line);
                            var tracePointA;
                            if (bp)
                            {
                                //todo set the correct hit count
                                tracePointA = debugModel.addTracePoint_Breakpoint(href, line, 0);

                                //todo set the correct frame number
                                debugModel.addTracePoint_LastChange(tracePointA.id, 0, propertyPath);

                                //todo add current traceobj  data to the tracePointAlog in reproduction
                                // we keep parent creation url as information in traceobjlog
                                //getRealObject
                                 owner = FBL.unwrapObject(owner);

                                 var wrappedJSDValue = FBL.jsd.wrapValue(owner);
                                 // NO good reason for getting js parent only because it works
                                 wrappedJSDValue = wrappedJSDValue.jsParent;


                                 Firebug.Console.log(wrappedJSDValue.objectValue);
                                 Firebug.Console.log(wrappedJSDValue.objectValue.creatorURL);
                                 Firebug.Console.log(wrappedJSDValue.objectValue.creatorLine);
                                 Firebug.Console.log(wrappedJSDValue.objectValue.constructorURL);

                                 var sourceFile = context.sourceFileMap[wrappedJSDValue.objectValue.creatorURL];

                            }
//                             Firebug.Debugger.setBreakpoint(sourceFile, wrappedJSDValue.objectValue.creatorLine);
                         }
                         Firebug.Debugger.resume(context);
                         var newReproduction = this.dataStore.newReproduction(context.debugSession);
                         this.reproducer.reproduce(context.debugSession.id, newReproduction.id); //TODO changeit

                     }

                },


                //------------------------- internal functions -----------------------------

                //------------------------- enable debugging -----------------------------
                // This function changes Firebug in a way that I can debug my code in chromebug
                // when firebug paused the page execution.
                // This function should not be called in the release versions.
                // The whole reason for such change is that JSD is one object in whole firefox
                // process and it is build to support only one hook execution at a
                // time. After finishing one hook execution it invalidate all stackFrame data.
                // The reason behind this limitation of JSD is to prevent loops like (breakpoint hit
                // , hook, breakpiont hi, hook ...)
                // be called in the release versions.
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

                enableDebugging : function(){
                    with(this.win){with(FBL){
                        // --------------------------- update fbs -----------------------------------

                       // We change fbs breakpoint hook

                        var old_onBreakpoint = fbs.onBreakpoint;
                        fbs.onBreakpoint = function(frame, type, val){
                            FBTrace.sysout("Execution hook, "+ frame.script.fileName + ", " +frame.line , frame);

                            if ( fbs.isTopLevelScript(frame, type, val) )
                                return Ci.jsdIExecutionHook.RETURN_CONTINUE;

                            var bp = fbs.findBreakpointByScript(frame.script, frame.pc);
                            if (bp)
                            {
                                FBTrace.sysout("On breakpoint : bp ", bp);
                                var theDebugger = fbs.getDebuggerByName(bp.debuggerName);
                                if (!theDebugger)
                                    theDebugger = fbs.findDebugger(frame);

                                //todo it seems that to make sure that
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
                            }else
                            {
                                return old_onBreakpoint.apply(this,arguments);
                            }
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
                                    fbs.getJSD().appendFilter(debuggr.qpfbug.filter_test);
                                    fbs.getJSD().appendFilter(debuggr.qpfbug.filter2);

                                    // by calling unPause we let other bp hooks happen.
                                    fbs.getJSD().unPause();
                                    return rv;
                                }
                                var old_resume = debuggr.resume;
                                debuggr.resume = function(context)
                                {
                                    FBTrace.sysout(Firebug.Debugger.fbs.getJSD().pauseDepth);
                                    var rv = old_resume.apply(debuggr, arguments);
                                    FBTrace.sysout(Firebug.Debugger.fbs.getJSD().pauseDepth);

                                    FBTrace.sysout(context.isFrozen, context);
                                    FBTrace.sysout(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                                }

                                var old_stopDebugging = debuggr.stopDebugging;
                                debuggr.stopDebugging = function(context)
                                {
                                    FBTrace.sysout("Stop Debugging");

                                    // this part is added because of possible exception
                                    // in debugger thow function due to invalid stackframe.
                                    if (debuggr.qpfbug.executionContext.isValid)
                                    {
                                        this.unsuppressEventHandling(context);
                                        debuggr.qpfbug.executionContext.scriptsEnabled = true;
                                    }

                                    var rv = old_stopDebugging.apply(debuggr, arguments);

                                    // we increase the pauseDepth to compensate our earlier
                                    // unPause;
                                    fbs.getJSD().pause();
                                    fbs.getJSD().removeFilter(debuggr.qpfbug.filter1);
                                    fbs.getJSD().removeFilter(debuggr.qpfbug.filter_test);
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
