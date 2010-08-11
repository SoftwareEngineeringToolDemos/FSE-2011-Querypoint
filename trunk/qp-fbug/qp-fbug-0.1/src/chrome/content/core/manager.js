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
            this.debugSessions = [];
            this.reproductions = [];
            this.nextDebugSessionId = 0;
        };

        constructor.prototype =
        {
            newDebugSession : function(){
                var id = this.nextDebugSessionId++;
                var debugSession = new DebugSession(id);
                this.debugSessions.push(debugSession);
                return debugSession;
            },

            getDebugSession : function(id){
                if (!id)
                    return this.newDebugSession();
                for (i=0 ; i < this.debugSessions.length ; i++)
                {
                    if (this.debugSessions[i].id == id)
                    {
                        return this.debugSessions[i];
                }
                }
                return null;
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
                this.disableQP(context);
                delete context.qpfbug;
                delete QPFBUG.contexts[context.uid];
            },

            initContextForQPFBUG: function(win, context){
                //get reproductionId passed to this tab
                var tabBrowser = win.FBL.$("content");
                var selectedTab = tabBrowser.selectedTab;
                var debugSessionId = selectedTab.getAttribute("debugSessionId");
                var reproductionId = selectedTab.getAttribute("reproductionId");

                //get reproduction for this tab;
                var debugSession = this.getDebugSession(debugSessionId);
                var reproduction = debugSession.getReproduction(reproductionId);

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
                    debugSession : debugSession,
                    trace: reproduction.trace,
                    tab : selectedTab,
                };

                //to select this context TODO  do we need this?  no. XXXjjb
                win.Firebug.selectContext(context);

                //------------------------ create event requests -----------------
                this.enableQP(context);

            },

            enableQP: function(context){

                var queryPoints = context.qpfbug.debugSession.debugModel.queryPoints;
                var anyQueryPoint = false;
                for (var i in queryPoints){
                    anyQueryPoint = true;
                    var queryPoint = queryPoints[i];
                    var eventRequest = null;

                    if (queryPoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT){
//                            if (queryPoint.url == sourceFile.href){
                            //todo set execution context tag
                            eventRequest = DebugService.getInstance().createBreakpointRequest(
                               context, bind(this.onBreakpointEvent, this), queryPoint.url, queryPoint.lineNo);
//                            }

                    }

                    if (queryPoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE){
                        var traceObject = context.qpfbug.debugSession.getLastTraceObject(
                                     queryPoint.queryObjectRef.refPoint,
                                     queryPoint.queryObjectRef.frameNo,
                                     queryPoint.queryObjectRef.ref
                                     );

                        if (traceObject){
                            var url = traceObject.parentCreatorURL;
                            var lineNo = traceObject.parentCreatorLine;

                            if (!url){
                                url = traceObject.parentConstructorURL;
                                lineNo = traceObject.parentConstructorLine;
                            }

                            if (url){
                                url = normalizeURL(url);
                                eventRequest = DebugService.getInstance().createModificationWatchpointRequest(
                                    context, bind(this.onModificationWatchpointEvent, this), url, lineNo, queryPoint.queryObjectRef.propertyName);
                            }

                        }

                    }
                    if (eventRequest){
                        eventRequest.queryPoint = queryPoint;
                        eventRequest.context = context;
                    }
                }

                if (anyQueryPoint)
                    context.qpfbug.enabled = true;
            },

            disableQP: function(context){
                if (context.qpfbug.enabled)
                    DebugService.getInstance().removeEventRequestsForContext(context); //todo is it necessary?
                context.qpfbug.enabled = false;
            },

            //------------------------------- call backs ---------------------------------------
            onModificationWatchpointEvent: function(eventRequest,  frame, type, rv, object, propertyName, oldValue, newValue){
                trace(frame.script.fileName+ " " +frame.line);
                trace(eventRequest.w_propertyName + " " + oldValue + " " + newValue, object);

                var context = eventRequest.context;
                var queryPoint = eventRequest.queryPoint;
                var tracePoint;
                if (queryPoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE)
                {
                    tracePoint = context.qpfbug.reproduction.trace.addLastChangeTracePoint(queryPoint, context, frame, object, oldValue, newValue);
                }
            },

            onBreakpointEvent: function(eventRequest, frame, type ,rv){
                var context = eventRequest.context;
                var queryPoint = eventRequest.queryPoint;
                var tracePoint;
                if (queryPoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT)
                {
                    tracePoint = context.qpfbug.reproduction.trace.addBreakpointTracePoint(queryPoint, context, frame);
                }
            },

            //------------------------------- actions ---------------------------------------
            addLastChange: function(context, owner, propertyPath){
                //this.enableQPFBUG(context);
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
                    var queryPointA, queryPointB;
                    if (bp)
                    {
                        //todo set the correct hit count
                        queryPointA = debugModel.addQueryPoint_Breakpoint(href, line, 0);

                        //todo set the correct frame number
                        queryPointB = debugModel.addQueryPoint_LastChange(queryPointA, 0, propertyPath);

                        // collect data
                        var tracePoint = reproduction.trace.addBreakpointTracePoint(queryPointA, context, context.stoppedFrame);
                        reproduction.trace.assignTracePoint(queryPointA, tracePoint);

                        //todo add current traceobj  data to the queryPointAlog in reproduction
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


                     //todo move this tag to another place
                    context.qpfbug.inQuery = true;

                    var newReproduction = debugSession.getReproduction();
                    this.disableQP(context);
                    Reproducer.getInstance().reproduce(context.qpfbug.reproducer, context, debugSession.id, newReproduction.id);

                }

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
