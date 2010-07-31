var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //--------------------------- QueryPoint Debugging Manager ----------------------
    owner.Manager = function(){

        var constructor = function(fbs){
            this.fbs = fbs;
            this.dataStore = new DataStore();
        };

        constructor.prototype =
        {
            getReproduction: function(debugSession, reproductionId){
                var reproduction;
                if (reproductionId){
                    reproduction = this.dataStore.getReproduction(reproductionId);
                }

                if (!reproduction){
                    if (!debugSession)
                        debugSession = this.dataStore.newDebugSession();
                    reproduction = this.dataStore.newReproduction(debugSession);
                    debugSession.reproductions.push(reproduction);
                }
                return reproduction;
            },

            initContext: function(win, context, persistedState)
            {
                with (win){
                    //set qpfbug data holder for the context
                    context.qpfbug = {};
                    context.qpfbug.firefoxWindow = this.win;
                    context.qpfbug.breakpoints = {};
                    context.qpfbug.breakpointURLs = [];
                    context.qpfbug.debugger = {debuggerName:"QPFBUG"}

                    //get reproductionId passed to this tab
                    var tabBrowser = FBL.$("content");
                    var selectedTab = tabBrowser.selectedTab;
                    var reproductionId = selectedTab.getAttribute("reproductionId");

                    //get reproduction for this tab;
                    var reproduction = QPFBUG.manager.getReproduction(null, reproductionId);

                    // set reproduction and debugSession for the context
                    context.qpfbug.reproduction = reproduction;
                    context.qpfbug.debugSession = reproduction.debugSession;
                    context.qpfbug.tab = selectedTab;

                    //to select this context
                    Firebug.selectContext(context);


                    //------------------------ create event requests -----------------

                    var tracePoints = context.qpfbug.debugSession.debugModel.tracePoints;

                    var eventRequests = context.qpfbug.eventRequests = [];

                    for (i in tracePoints){

                        var tracePoint = tracePoints[i];
                        var eventRequest = null;

                        if (tracePoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT){
                            if (tracePoint.url == sourceFile.href){
                                //todo set execution context tag
                                eventRequest = QPFBUG.createBreakpointRequest(
                                   bind(this.onBreakpointEvent, this), context, tracePoint.url, tracePoint.lineNo);
                            }

                        }

                        if (tracePoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE){
                            var traceObjectLog = context.qpfbug.debugSession.getLastTraceObjectLog(
                                         tracePoint.globalObjectRef.refPoint,
                                         tracePoint.globalObjectRef.frameNo,
                                         tracePoint.globalObjectRef.ref
                                         );

                            if (traceObjectLog){
                                var lineNo;
                                var url;
                                if (sourceFile.href == traceObjectLog.parentCreatorURL){
                                    url = sourceFile.href;
                                    lineNo = traceObjectLog.parentCreatorLine;
                                }

                                if (sourceFile.href == traceObjectLog.parentConstructorURL){
                                    url = sourceFile.href;
                                    lineNo = traceObjectLog.parentConstructorLine;
                                }

                                if (url){
                                    eventRequest = QPFBUG.createModificationWatchpointRequest(
                                        bind(this.onModificationWatchpointEvent, this),
                                        context, url, lineNo, tracePoint.globalObjectRef.propertyName);
                                }

                            }

                        }
                        if (eventRequest){
                            eventRequest.tracePoint = tracePoint;
                            eventRequest.context = context;
                            eventRequests.push(eventRequest);
                        }
                    }
                };
            },

            destroyContext: function(win, context, persistedState)
            {
                delete context.qpfbug;
                //todo store debugModel in the persistedState
                // remove all breakpoints
            },

            //------------------------------- call backs ---------------------------------------
            onModificationWathpointEvent: function(eventRequest, oldValue, newValue){

            },

            onBreakpointEvent: function(eventRequest, frame, type ,rv){

                var context = eventRequest.context;
                var tracePoint = eventRequest.tracePoint;

                var tracePointLog;
                if (tracePoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT)
                {
                    tracePointLog = context.qpfbug.reproduction.executionLog.addTracePointLog(tracePoint, frame);
                }

            },

            //------------------------------- actions ---------------------------------------
            addLastChange: function(context, owner, propertyPath){
                var win = context.qpfbug.firefoxWindow;
                with(win){
                    var debugSession = context.qpfbug.debugSession;
                    var reproduction = context.qpfbug.reproduction;
                    var debugModel = debugSession.debugModel;

                    if (!context.stopped)
                        return;

                    //add current breakpoint as a point
                    // todo breakpoint is not enough, we should get the hit count
                    // we also need the all steps (step in, steps over, steps out)
                    // taken before reaching this point
                    // todo get breakpoint from context

                    var href = context.executingSourceFile.href;
                    var line = context.stoppedFrame.line;
                    var fileName = context.stoppedFrame.script.fileName;
                    var bp = FBL.fbs.findBreakpoint(href, line);
                    var tracePointA, tracePointB;
                    if (bp)
                    {
                        //todo set the correct hit count
                        tracePointA = debugModel.addTracePoint_Breakpoint(href, line, 0);

                        //todo set the correct frame number
                        tracepointB = debugModel.addTracePoint_LastChange(tracePointA, 0, propertyPath);

                        // collect data
                        var tracePointLog = reproduction.executionLog.addTracePointLog(tracePointA, context.stoppedFrame);
                        reproduction.executionLog.assignTracePointLog(tracePointA, tracePointLog);

                        //todo add current traceobj  data to the tracePointAlog in reproduction
                        // we keep parent creation url as information in traceobjlog
                        //getRealObject
                        owner = FBL.unwrapObject(owner);

                        var wrappedJSDValue = FBL.jsd.wrapValue(owner);
                        // NO good reason for getting js parent only because it works
                        wrappedJSDValue = wrappedJSDValue.jsParent;


                        var sourceFile = context.sourceFileMap[wrappedJSDValue.objectValue.creatorURL];
//                        FBL.fbs.addBreakpoint(1, sourceFile, wrappedJSDValue.objectValue.creatorLine,
//                                                      null, context.qpfbug.debugger);
                    }

                    Firebug.Debugger.resume(context);
                    var newReproduction = this.getReproduction(debugSession);

                    var tabBrowser = win.FBL.$("content");
                    QPFBUG.reproducer.reproduce(win, debugSession.id, newReproduction.id); //TODO changeit
                    tabBrowser.removeTab(context.qpfbug.tab);
                }

            },

            //---------------------------------- internal functions --------------------------------

            getCallStackDepth: function(frame)
            {
                var depth = 0;
                while (frame){
                    depth++;
                    frame = frame.callingFrame;
                }
                return depth;
            },


        };

        constructor.getInstance = function(){
            if (!QPFBUG.manager)
            {
                var fbs = QPFBUG.fbs;
                QPFBUG.manager = new Manager(fbs);
            }
            return QPFBUG.manager;
        };

        return constructor;
    }();

}}

};
