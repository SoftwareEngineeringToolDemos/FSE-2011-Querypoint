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
                    this.initContextForQPFBUG(win, context);
                }

            },

            destroyContext: function(win, context, persistedState)
            {
                //todo store debugModel in the persistedState
                // remove all breakpoints
                if (context.qpfbug.enabled)
                    DebugService.getInstance().removeEventRequestsForContext(context); //todo is it necessary?
                delete context.qpfbug;
                delete QPFBUG.contexts[context.uid];
            },

            initContextForQPFBUG: function(win, context){
                //get reproductionId passed to this tab
                var tabBrowser = win.FBL.$("content");
                var selectedTab = tabBrowser.selectedTab;
                var reproductionId = selectedTab.getAttribute("reproductionId");

                //get reproduction for this tab;
                var reproduction = this.getReproduction(null, reproductionId);

                QPFBUG.contexts[context.uid] = context;
                //set qpfbug data holder for the context
                context.qpfbug = {
                    enabled : false,
                    firefoxWindow : win,
                    breakpoints : {},
                    breakpointURLs : [],
                    debugger : {debuggerName:"QPFBUG"},
                    eventRequests : [],
                    reproduction : reproduction,
                    debugSession : reproduction.debugSession,
                    tab : selectedTab,
                };

                //to select this context TODO  do we need this?
                win.Firebug.selectContext(context);

                //------------------------ create event requests -----------------
                var tracePoints = context.qpfbug.debugSession.debugModel.tracePoints;

                var anyTracePoint = false;
                for (var i in tracePoints){
                    anyTracePoint = true;
                    var tracePoint = tracePoints[i];
                    var eventRequest = null;

                    if (tracePoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT){
//                            if (tracePoint.url == sourceFile.href){
                            //todo set execution context tag
                            eventRequest = DebugService.getInstance().createBreakpointRequest(
                               context, bind(this.onBreakpointEvent, this), tracePoint.url, tracePoint.lineNo);
//                            }

                    }

                    if (tracePoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE){
                        var traceObjectLog = context.qpfbug.debugSession.getLastTraceObjectLog(
                                     tracePoint.globalObjectRef.refPoint,
                                     tracePoint.globalObjectRef.frameNo,
                                     tracePoint.globalObjectRef.ref
                                     );

                        if (traceObjectLog){
                            var url = traceObjectLog.parentCreatorURL;
                            var lineNo = traceObjectLog.parentCreatorLine;

                            if (!url){
                                url = traceObjectLog.parentConstructorURL;
                                lineNo = traceObjectLog.parentConstructorLine;
                            }

                            if (url){
                                url = normalizeURL(url);
                                eventRequest = DebugService.getInstance().createModificationWatchpointRequest(
                                    context, bind(this.onModificationWatchpointEvent, this), url, lineNo, tracePoint.globalObjectRef.propertyName);
                            }

                        }

                    }
                    if (eventRequest){
                        eventRequest.tracePoint = tracePoint;
                        eventRequest.context = context;
                    }
                }

                if (anyTracePoint)
                    this.enableQPFBUG(context);
            },

            enableQPFBUG: function(context){
                context.qpfbug.enabled = true;
            },

            //------------------------------- call backs ---------------------------------------
            onModificationWathpointEvent: function(eventRequest, oldValue, newValue){

            },

            onBreakpointEvent: function(eventRequest, frame, type ,rv){
                var context = eventRequest.context;
                var tracePoint = eventRequest.tracePoint;
                trace("000000000000000000");
                var tracePointLog;
                if (tracePoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT)
                {
                    trace("11111111111111");
                    tracePointLog = context.qpfbug.reproduction.executionLog.addTracePointLog(tracePoint, frame);
                }

            },

            //------------------------------- actions ---------------------------------------
            addLastChange: function(context, owner, propertyPath){
                this.enableQPFBUG(context);
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

//                    Firebug.Debugger.resume(context);
//                    var newReproduction = this.getReproduction(debugSession);
//
//                    var tabBrowser = win.FBL.$("content");
//                    QPFBUG.reproducer.reproduce(win, debugSession.id, newReproduction.id); //TODO changeit
//                    tabBrowser.removeTab(context.qpfbug.tab);
                    var newReproduction = this.getReproduction(debugSession);
                    QPFBUG.reproducer.reproduce(context, debugSession.id, newReproduction.id);  
                    
                    // XXXjjb it needs to be up to the reproducer to remove tabs
                    //var tabBrowser = win.FBL.$("content");
                    //tabBrowser.removeTab(context.qpfbug.tab);
                    
                    // Show results
                    //context.dispatch(context.qpfbug.debugSession.debugModel);                   
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
