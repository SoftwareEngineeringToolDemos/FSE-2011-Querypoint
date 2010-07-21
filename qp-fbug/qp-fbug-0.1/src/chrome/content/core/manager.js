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

                            this.win.Firebug.qpfbug = {};
                            this.win.Firebug.qpfbug.manager = this.manager;

                            if (!QPFBUG.jsdEventHandler)
                            {
                                var jsdEventHandler = new JSDEventHandler(fbs);
                                jsdEventHandler.init();
                                QPFBUG.jsdEventHandler = jsdEventHandler;
                            }

                            QPFBUG.jsdEventHandler.registerManager(this);

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

                    }
                    //------------------------- internal functions -----------------------------

                 };
                 return constructor;
             }();
    }}

    };
