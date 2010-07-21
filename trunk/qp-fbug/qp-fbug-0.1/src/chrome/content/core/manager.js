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
                   this.jsdEventHandler = new JSDEventHandler(win);
                };

                constructor.prototype =
                {
                    //------------------------------ event handling -----------------------------------------
                    initialize : function(){
                        with(this.win){with(FBL){

                            var jsd = Cc["@mozilla.org/js/jsd/debugger-service;1"].getService(Ci.jsdIDebuggerService);
                            jsd.flags = 0; //activating object creation tracing
                            this.addJSDEventHandling();

                            this.reproducer.init();
                            this.jsdEventHandler.init();
                            var wrappedDebugger = {
                                wrappedJSObject: this.jsdEventHandler
                            };
                            Firebug.Debugger.fbs.registerDebugger(wrappedDebugger);
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

                                //set bps
                            debugModel.tracePoints;

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

                    addJSDEventHandling : function(){

                        with(this.win){with(FBL){

                            var old_onBreakpoint = fbs.onBreakpoint;
                            fbs.onBreakpoint = function(frame, type, val){
                                FBTrace.sysout("**************");
                                if ( fbs.isTopLevelScript(frame, type, val) )
                                    return Ci.jsdIExecutionHook.RETURN_CONTINUE;

                                FBTrace.sysout(frame.script.fileName);

                                if (frame.script.fileName.indexOf("test.html") != -1)
                                    var context = TabWatcher.getContextByWindow(this.win);


                                var rv =  old_onBreakpoint.apply(fbs,arguments);
                                return rv;
                            };

    //                        var old_onScriptCreated = fbs.onScriptCreated;
    //
    //                        fbs.onScriptCreated = function(script){
    //                            if (script.fileName.indexOf("test.html") != -1)
    //                                FBTrace.sysout("script loaded!" ,script)
    //                            old_onScriptCreated.apply(fbs, arguments);
    //                        }
    //
    //                        var old_onScriptDestroyed = fbs.onScriptDestroyed;
    //                        fbs.onScriptDestroyed = function(script){
    //
    //                            old_onScriptDestroyed.apply(fbs, arguments);
    //                        }

                            // to make sure that new hook will be applied.
                            fbs.hookScripts();

                        }}
                    }
                    //------------------------- internal functions -----------------------------

                 };
                 return constructor;
             }();
    }}

    };
