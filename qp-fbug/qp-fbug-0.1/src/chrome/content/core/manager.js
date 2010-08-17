var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //--------------------------- Querypoint Debugging Manager ----------------------
    __owner.Manager = function(){

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
                for (var i=0 ; i < this.debugSessions.length ; i++)
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

            loadedContext: function(win, context)
            {
                var debugSession = context.qpfbug.debugSession;
                //todo change it
                if (!debugSession.record)
                {
                    var recorder = new Recorder(context.window);
                    context.qpfbug.recorder = recorder;
                    recorder.start();
                }
            },

            destroyContext: function(win, context, persistedState)
            {
                //todo store debugModel in the persistedState
                // remove all breakpoints
                this.disableQP(context);
                if (context.qpfbug.recorder){
                    context.qpfbug.recorder.stop();
                    context.qpfbug.debugSession.record = context.qpfbug.recorder.record;
                }
                delete context.qpfbug;
                delete QPFBUG.contexts[context.uid];
            },

            initContextForQPFBUG: function(win, context, debugSessionId, reproductionId){
                //get reproductionId passed to this tab
                var tabBrowser = $("content");
                var selectedTab = tabBrowser.selectedTab;

                if (!debugSessionId)
                    debugSessionId = selectedTab.getAttribute("debugSessionId");

                if (!reproductionId)
                    reproductionId = selectedTab.getAttribute("reproductionId");

                //get reproduction for this tab;
                var debugSession = this.getDebugSession(debugSessionId);
                var reproduction = debugSession.getReproduction(reproductionId);

                QPFBUG.contexts[context.uid] = context;
                //set qpfbug data holder for the context
                context.qpfbug = {
                    listeningToJSDEvents : false,
                    firefoxWindow : win,
                    //debugger : {debuggerName:"QPFBUG"},
                    eventRequests : [],
                    reproduction : reproduction,
                    debugSession : debugSession,
                    trace: reproduction.trace,
                    tab : selectedTab,
                    inSession : false,
                    inQuery : false, //todo
                    reproducer: win.Firebug.getPref("extensions.firebug", "querypoints.reproducer"),
                    recorder: null,
                };


                this.enableQP(context);

            },

            enableQP: function(context){

                var querypoints = context.qpfbug.debugSession.debugModel.querypoints;
                var anyQuerypoint = false;
                for (var i in querypoints){
                    anyQuerypoint = true;
                    var querypoint = querypoints[i];
                    var eventRequest = null;

                    if (querypoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT){
                        //todo set execution context tag
                        eventRequest = DebugService.getInstance().createBreakpointRequest(
                           context, bind(this.onBreakpointEvent, this), querypoint.url, querypoint.lineNo);

                    }

                    if (querypoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE){
                        var traceData = context.qpfbug.debugSession.getLastTraceData(
                                     querypoint.refQuerypoint,
                                     querypoint.refQueryexpr.frameNo,
                                     querypoint.refQueryexpr.expr
                                     );

                        if (traceData){
                            var url = traceData.parentCreatorURL;
                            var lineNo = traceData.parentCreatorLine;

                            if (!url){
                                url = traceData.parentConstructorURL;
                                lineNo = traceData.parentConstructorLine;
                            }
                            if (url){    //todo
                                url = normalizeURL(url);
                                eventRequest = DebugService.getInstance().createModificationWatchpointRequest(
                                    context, bind(this.onModificationWatchpointEvent, this), url, lineNo, querypoint.refQueryexpr.propertyName);
                            }else{
                                eventRequest = DebugService.getInstance().createModificationWatchpointRequest(
                                    context, bind(this.onModificationWatchpointEvent, this), null, null, querypoint.refQueryexpr.propertyName);
                            }

                        }

                    }
                    if (eventRequest){
                        eventRequest.querypoint = querypoint;
                        eventRequest.context = context;
                    }
                }

                if (anyQuerypoint){
                    context.qpfbug.listeningToJSDEvents = true;
                    context.qpfbug.inSession = true;
                    context.qpfbug.inQuery = true;
                }
            },

            disableQP: function(context){
                if (context.qpfbug.listeningToJSDEvents)
                    DebugService.getInstance().removeEventRequestsForContext(context); //todo is it necessary?
                context.qpfbug.listeningToJSDEvents = false;
            },

            //------------------------------- call backs ---------------------------------------
            onModificationWatchpointEvent: function(eventRequest,  frame, type, rv, object, propertyName, oldValue, newValue){
//                trace(frame.script.fileName+ " " +frame.line);
//                trace(eventRequest.w_propertyName + " " + oldValue + " " + newValue, object);

                var context = eventRequest.context;
                var querypoint = eventRequest.querypoint;
                var tracepoint;
                if (querypoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE)
                {
                    tracepoint = context.qpfbug.reproduction.trace.addLastChangeTracepoint(querypoint, context, frame, object, oldValue, newValue);
                }
            },

            onBreakpointEvent: function(eventRequest, frame, type ,rv){
                var context = eventRequest.context;
                var querypoint = eventRequest.querypoint;
                var tracepoint;
                if (querypoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT)
                {
                    tracepoint = context.qpfbug.reproduction.trace.addBreakpointTracepoint(querypoint, context, frame);
                }
            },

            //------------------------------- actions ---------------------------------------
            findLastChangeFromQuerypoint: function(context, querypoint, propertyPath){
                var win = context.qpfbug.firefoxWindow;
                with(win){
                    var debugSession = context.qpfbug.debugSession;
                    var reproduction = context.qpfbug.reproduction;
                    var debugModel = debugSession.debugModel;

                    //todo set the correct frame number
                    var querypointB = debugModel.addQuerypoint_LastChange(querypoint, 0, propertyPath);

                    //todo move this tag to another place
                    context.qpfbug.inQuery = true;

                    this.resume(context);
                }
            },

            findLastChangeFromBreakpoint: function(context, propertyPath){
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
                    var bp = getFirebugService().findBreakpoint(href, line);
                    var querypointA, querypointB;
                    if (bp)
                    {
                        //todo set the correct hit count
                        querypoint = debugModel.addQuerypoint_Breakpoint(href, line, 0);

                        context.qpfbug.toBeCollected = [];
                        context.qpfbug.toBeCollected.push(querypoint);
                        context.qpfbug.stoppedFrame = context.stoppedFrame;

                        this.findLastChangeFromQuerypoint(context, querypoint, propertyPath);
                    }
                }
            },

            collectData: function(context){
                var querypoints = context.qpfbug.toBeCollected;
                var debugSession = context.qpfbug.debugSession;
                var reproduction = context.qpfbug.reproduction;

                var frame = context.qpfbug.stoppedFrame;
                if (!frame)
                    return;
                var querypoint;
                for (var i=0 ; i<querypoints.length ; i++){
                    querypoint = querypoints[i];
                    // collect data
                    var tracepoint = reproduction.trace.addBreakpointTracepoint(querypoint, context, frame);
                    if (querypoint.queryType == 0){ //breakpoint todo change it
                        reproduction.trace.assignTracepoint(querypoint, tracepoint);
                        //todo assign other tracepoints
                    }
                }
                context.qpfbug.toBeCollected = [];

            },
            
            resume: function(context){
                this.collectData(context);

                var debugSession = context.qpfbug.debugSession;
                var reproduction = context.qpfbug.reproduction;

                context.qpfbug.stoppedFrame = null;
                var newReproduction = debugSession.getReproduction();
                this.disableQP(context);
                Reproducer.getInstance().reproduce(context.qpfbug.reproducer, context, debugSession.id, newReproduction.id);
            }

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
