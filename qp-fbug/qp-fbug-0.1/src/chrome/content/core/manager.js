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
            this.nextDebugSessionId = 0;
        };

        constructor.prototype =
        {
            //------------------------------- DebugSession  ---------------------------------------
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

            setReproducer: function(context, reproducer)
            {
                if (context && context.qpfbug)
                    context.qpfbug.reproducer = reproducer;
            },

            getReproducer: function(context)
            {
                if (context && context.qpfbug)
                    return context.qpfbug.reproducer;
            },

            //------------------------------- Context lifeCycle ---------------------------------------
            initContext: function(win, context, persistedState)
            {
                //get reproductionId passed to this tab
                //todo I think I can get tab from context
                var tabBrowser = $("content");
                var selectedTab = tabBrowser.selectedTab;

                debugSessionId = selectedTab.getAttribute("debugSessionId");

                //get reproduction for this tab;
                var debugSession;
                var reproduction;

                if (!debugSessionId)
                    debugSession = this.newDebugSession();
                else
                    debugSession = this.getDebugSession(debugSessionId);

                reproduction = debugSession.reproduction;

                //it means that no new reproduction is assigned
                //for example, page is reloaded
                //so a new debug session will be created.
                if (reproduction.isAlreadyStarted()){
                    debugSession = this.newDebugSession();
                    reproduction = debugSession.reproduction;
                }

                var reproducerName = win.Firebug.getPref("extensions.firebug", "querypoints.reproducer");
                context.qpfbug = {};
                context.qpfbug.reproducer = Reproducer.getInstance().getReproducer(reproducerName);
                context.qpfbug.Firebug = win.Firebug; //to keep a reference to Firebug

                //todo if !debugSession || !reproduction then ?

                this.onReproductionStart(context, debugSessionId);

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
                this.disableQuerypoints(context);
                if (context.qpfbug.recorder){
                    context.qpfbug.recorder.stop();
                    context.qpfbug.debugSession.record = context.qpfbug.recorder.record;
                }
                delete context.qpfbug;
            },

            onReproductionStart: function(context, debugSessionId){

                var debugSession = this.getDebugSession(debugSessionId)
                var reproduction = debugSession.reproduction;

                //set qpfbug data holder for the context
                context.qpfbug.debugSession = debugSession;
                context.qpfbug.newResults = false; //todo
                context.qpfbug.recorder= null;
                context.qpfbug.breakEnabled= true;

                if (reproduction.targetQuerypoint)
                    context.qpfbug.breakEnabled = false;

                reproduction.start(context);
                this.enableQuerypoints(context);
            },

            enableQuerypoints: function(context){

                var querypoints = context.qpfbug.debugSession.debugModel.querypoints;
                for (var i in querypoints){
                    var querypoint = querypoints[i];

                    if (!querypoint.isEnabled())
                        continue;

                    var eventRequest = null;

                    if (querypoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT){
                        //todo set execution context tag
                        eventRequest = DebugService.getInstance().createBreakpointRequest(
                           context, bind(this.onBreakpointEvent, this), querypoint.url, querypoint.lineNo);

                    }

                    if (querypoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE){
                        var traceData = context.qpfbug.debugSession.getLastTraceData(
                                     querypoint.refQuerypoint,
                                     querypoint.refQueryExpr.frameNo,
                                     querypoint.refQueryExpr.expr
                                     );

                        if (traceData){
                            var url = traceData.parentTrace.creatorURL;
                            var lineNo = traceData.parentTrace.creatorLine;

                            if (!url){
                                url = traceData.parentTrace.constructorURL;
                                lineNo = traceData.parentTrace.constructorLine;
                            }
                            if (url){    //todo
                                url = normalizeURL(url);
                                eventRequest = DebugService.getInstance().createModificationWatchpointRequest(
                                    context, bind(this.onModificationWatchpointEvent, this), url, lineNo, querypoint.refQueryExpr.propertyName);
                            }else{
                                eventRequest = DebugService.getInstance().createModificationWatchpointRequest(
                                    context, bind(this.onModificationWatchpointEvent, this), null, null, querypoint.refQueryExpr.propertyName);
                            }

                        }

                    }
                    if (eventRequest){
                        eventRequest.querypoint = querypoint;
                    }
                }

            },

            disableQuerypoints: function(context){
                DebugService.getInstance().removeEventRequestsForContext(context); //todo is it necessary?
            },

            //------------------------------- call backs ---------------------------------------
            onModificationWatchpointEvent: function(eventRequest, eventId, frame, type, rv, object, propertyName, oldValue, newValue, isObjectCreation){
                var context = eventRequest.context;
                var reproduction = context.qpfbug.debugSession.reproduction;
                var querypoint = eventRequest.querypoint;
                this.collectData(context, querypoint, eventId, frame, object, oldValue, newValue, isObjectCreation);
            },

            onBreakpointEvent: function(eventRequest, eventId, frame, type ,rv){
                var context = eventRequest.context;
                var reproduction = context.qpfbug.debugSession.reproduction;
                var querypoint = eventRequest.querypoint;

                this.collectData(context, querypoint, eventId, frame);
                if (!context.qpfbug.debugSession.moreReproductionPointsToFind())
                    if (context.qpfbug.debugSession.needsAnotherReproduction()){   
                        this.replay(context, reproduction.targetQuerypoint);
                    }else {
                        //show new found querypoints
                        context.qpfbug.newResults = true;
                        context.qpfbug.breakEnabled = true;
                    }
            },

            //------------------------------- actions ---------------------------------------
            findLastChangeFromQuerypoint: function(context, querypoint, propertyPath){
                var debugSession = context.qpfbug.debugSession;
                var reproduction = context.qpfbug.debugSession.reproduction;
                var debugModel = debugSession.debugModel;

                //todo set the correct frame number
                var querypointB = debugModel.addQuerypoint_LastChange(querypoint, 0, propertyPath);
                debugModel.enableQuerypoint(querypointB);

                //todo move this tag to another place
                context.qpfbug.newResults = true;

                this.replay(context, querypointB);
            },

            findLastChangeFromBreakpoint: function(context, propertyPath){
                var debugSession = context.qpfbug.debugSession;
                var reproduction = context.qpfbug.debugSession.reproduction;
                var debugModel = debugSession.debugModel;

                if (!context.stopped)
                    return;

                var href = context.executingSourceFile.href;
                var frame = context.stoppedFrame;
                var line = frame.line;
                var fileName = frame.script.fileName;
                var bp = getFirebugService().findBreakpoint(href, line);  // todo get breakpoint from context. why?
                var querypoint, querypointB;
                if (bp)
                {
                    //todo set the correct hit count + steps (in, over, out)
                    querypoint = debugModel.addQuerypoint_Breakpoint(href, line, 0);
                    debugModel.enableQuerypoint(querypoint);

                    //todo set the correct frame number
                    var querypointB = debugModel.addQuerypoint_LastChange(querypoint, 0, propertyPath);
                    debugModel.enableQuerypoint(querypointB);

                    //todo move this tag to another place
                    context.qpfbug.newResults = true;

                    this.collectData(context, querypoint, -1, frame); //todo eventId == -1  ? give a correct eventId?
                    this.replay(context, querypointB);
                }
            },

            collectData: function(context, querypoint, eventId, frame, object, oldValue, newValue, isObjectCreation){
                var debugSession = context.qpfbug.debugSession;
                var reproduction = context.qpfbug.debugSession.reproduction;
                var tracepoint;

                if (!reproduction.trace)
                    reproduction.start(context);

                if (querypoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE)
                {
                    tracepoint = reproduction.trace.addLastChangeTracepoint(querypoint, context, eventId,  frame, object, oldValue, newValue, isObjectCreation);
                }
                if (querypoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT)
                {
                    tracepoint = reproduction.trace.addBreakpointTracepoint(querypoint, context, eventId, frame);
                    reproduction.trace.assignTracepoint(querypoint, tracepoint);

                }

            },

            replay: function(context, targetQuerypoint){
                var debugSession = context.qpfbug.debugSession;
                var reproduction = context.qpfbug.debugSession.reproduction;

                var newReproduction = debugSession.nextReproduction();
                newReproduction.targetQuerypoint = targetQuerypoint;
                this.disableQuerypoints(context);
                this.getReproducer(context).reproduce(context, debugSession.id, newReproduction.id);
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
