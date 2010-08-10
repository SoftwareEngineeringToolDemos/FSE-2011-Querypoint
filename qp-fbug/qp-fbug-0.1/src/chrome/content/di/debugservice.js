var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //------------------------------ DebugService --------------------------
    owner.DebugService = function(){

        var constructor = function(fbs){
            this.fbs = fbs;
            this.nextEventRequestId = 0;
            this.nextBreakpointId = 0;
            this.interruptListeners = {};
            this.functionListeners = {};
            this.listeningToInterrupts = 0;
            this.listeningToFunctions = 0;
            this.nextListenerId = 0;
        };

        constructor.prototype =
        {
            // TODO: in cases that owner object created in another context this request
            // will not be effective, we need to consider all contexts to make sure
            // that we don't miss anything.
            //
            // url & lineNo that the object is created there.
            createModificationWatchpointRequest: function(context, callBack, w_ownerCreationUrl,
                                                          ownerCreationLineNo, propertyName){
                var eventRequest = new EventRequest(EventRequest.TYPES.WATCHPOINT, callBack, context,
                                                    null, null,
                                                    w_ownerCreationUrl, ownerCreationLineNo, propertyName
                                                    );
                eventRequest.id = this.nextEventRequestId++;
                context.qpfbug.eventRequests.push(eventRequest);
                return eventRequest;
            },

            createBreakpointRequest: function(context, callBack, url, lineNo ){

                var eventRequest = new EventRequest(EventRequest.TYPES.BREAKPOINT, callBack, context,
                                                    url, lineNo,
                                                    null, null, null
                                                    );
                eventRequest.id = this.nextEventRequestId++;
                context.qpfbug.eventRequests.push(eventRequest);
                return eventRequest;
            },

            removeEventRequestsForContext: function(context){
                var eventRequests = context.qpfbug.eventRequests;
                var eventRequest;
                var executionMonitor;
                for (var i=0 ; i<eventRequests.length ; i++){
                    eventRequest = eventRequests[i];
                    for (var j=0 ; j<eventRequest.executionMonitors.length ; j++){
                         executionMonitor = eventRequest.executionMonitors[j]; 
                         executionMonitor.stop();
                    }
                }
                context.qpfbug.eventRequests = null;
            },

            onModificationWatchpointEvent: function(eventRequest, frame, type, rv, object, propertyName, oldValue, newValue){
                eventRequest.callBack(eventRequest,  frame, type, rv, object, propertyName, oldValue, newValue);
            },

            onBreakpointEvent: function(eventRequest, frame, type, rv){
                eventRequest.callBack(eventRequest, frame, type, rv);
            },



            //--------------------------------- SteppingDriver ----------------------------
            getSteppingDriver: function(stepHandler, context){
                return new SteppingDriver(this.nextListenerId++, stepHandler, context);
            },

            releaseSteppingDriver: function(steppingDriver){
                steppingDriver.stop();
            },

            //--------------------------------- register/unregister listeners ----------------------------
            // interrupt
            registerInterruptListener: function(interruptListener){
                this.interruptListeners[interruptListener.id] = interruptListener;
                this.listeningToInterrupts++;
                if (this.listeningToInterrupts > 0){
                    JSDEventHandler.getInstance().hookInterrupts();
                }
            },
            
            unRegisterInterruptListener: function(interruptListener){
                delete this.interruptListeners[interruptListener.id];
                this.listeningToInterrupts--;
                if (!this.listeningToInterrupts){
                    JSDEventHandler.getInstance().unhookInterrupts();
                }
            },
            
            //function
            registerFunctionListener: function(functionListener){
                this.functionListeners[functionListener.id] = functionListener;
                this.listeningToFunctions++;
                if (this.listeningToFunctions > 0){
                    JSDEventHandler.getInstance().hookFunctions();
                }
            },

            unRegisterFunctionListener: function(functionListener){
                delete this.functionListeners[functionListener.id];
                this.listeningToFunctions--;
                if (!this.listeningToFunctions){
                    JSDEventHandler.getInstance().unhookFunctions();
                }
            },

            //--------------------------------- changes to loaded scripts --------------------------------
            // source file is created or changed so update breakpoints
            onSourceFileCreated: function(context, sourceFile){
                var eventRequests = context.qpfbug.eventRequests;

                for (var i=0 ; i<eventRequests.length ; i++)
                {
                    var eventRequest = eventRequests[i];
                    if (sourceFile.href == eventRequest.bp_url){
                        var bp = {type: 1, href: sourceFile.href, lineNo: eventRequest.bp_lineNo, disabled: 0,
                                  debuggerName: "QPFBUG",
                                  condition: "", onTrue: true, hitCount: -1, hit: 0, queryPoints : []};
                        bp.id = this.nextBreakpointId++;
                        eventRequest.breakpoints=[];
                        eventRequest.breakpoints.push(bp);
                        this.setJSDBreakpoint(sourceFile, bp);
                    }

                    if (sourceFile.href == eventRequest.w_ownerCreationUrl){
                        var bp = {type: 1, href: sourceFile.href, lineNo: eventRequest.w_ownerCreationLineNo, disabled: 0,
                                  debuggerName: "QPFBUG",
                                  condition: "", onTrue: true, hitCount: -1, hit: 0, queryPoints : []};
                        bp.id = this.nextBreakpointId++;
                        eventRequest.breakpoints=[];
                        eventRequest.breakpoints.push(bp);
                        this.setJSDBreakpoint(sourceFile, bp);
                    }

                }
            },

            //----------------------------------------- halt functions ---------------------------------------------
            halt: function(context, callBack){
                var haltObject = new HaltObject(context, callBack);
                haltObject.halt();
            },

            // halt made by this object
            onHalt: function(frame, type, rv){
                var haltObject;
                if (!frame.thisValue || !(frame.thisValue.getWrappedValue() instanceof HaltObject)){
                    return Ci.jsdIExecutionHook.RETURN_CONTINUE;
                }

                haltObject = frame.thisValue.getWrappedValue() ;

                // To remove halting functions from the stack five stepOut steps needed.
                // Here, by restricting stepping driver to debugging context, only one stepMin
                // is enough for removing halting function from the top of the stack.
                var stepHandler = {
                    start: function(context, frame, type, rv){
                        this.steppingDriver = DebugService.getInstance().getSteppingDriver(this, context);
                        this.steppingDriver.step(0, frame.script.tag, frame.line, frame.pc);
                    },
                    onStep: function(frame, type, rv, stackDepthChange){
                        haltObject.callBack(frame, type, rv);
                        DebugService.getInstance().releaseSteppingDriver(this.steppingDriver);
                    },
                }
                stepHandler.start(haltObject.context, frame, type, rv);

                return Ci.jsdIExecutionHook.RETURN_CONTINUE;
            },

            //------------------------------------------ jsd hooks -------------------------------------------------
            onInterrupt: function(context, frame, type, rv){
                var copy = cloneObject(this.interruptListeners);
                for (var i in copy){
                    var interruptListener = copy[i];
                    if (interruptListener){
                        interruptListener.onInterrupt(context, frame, type, rv);
                    }
                }            

                return Ci.jsdIExecutionHook.RETURN_CONTINUE;
            },

            onFunction: function(context, frame, type){
                var copy = cloneObject(this.functionListeners);
                for (var i in copy){
                    var functionListener = copy[i]; 
                    if (functionListener){
                        functionListener.onFunction(context, frame, type);
                    }
                }            

                return Ci.jsdIExecutionHook.RETURN_CONTINUE;
            },

            onBreakpoint: function(context, frame, type, rv){
                var eventRequests = context.qpfbug.eventRequests;
                var eventRequest;
                var script = frame.script;
                var pc = frame.pc;
                for (let i=0 ; i<eventRequests.length ; i++){

                    eventRequest = eventRequests[i];
                    for (let j=0 ; j<eventRequest.breakpoints.length ; j++){ //there is only one

                        var bp = eventRequest.breakpoints[j];
                        if (bp.scriptsWithBreakpoint)
                        {
                            for (let iScript = 0; iScript < bp.scriptsWithBreakpoint.length; iScript++)
                            {
                                if ( bp.scriptsWithBreakpoint[iScript] && (bp.scriptsWithBreakpoint[iScript].tag == script.tag) && (bp.pc[iScript] == pc) )
                                {
                                   trace("On Breakpoint : " + bp.href +  ": " + bp.lineNo);
                                    if (eventRequest.isBreakpoint())
                                    {
                                        this.onBreakpointEvent(eventRequest, frame, type, rv);
                                    }
                                    if (eventRequest.isWatchpoint()) 
                                    {
                                        trace("--------------------------");
                                        //todo monitor should be saved in a list
                                        executionMonitor = new ExecutionMonitor(context);
                                        eventRequest.executionMonitors.push(executionMonitor);
                                        executionMonitor.start(bind(this.onPropertyChanged, this, eventRequest), eventRequest.w_propertyName, frame, type, rv);
                                    }
                                }
                            }
                        }
                    }
                }

                //find eventRequests related to this breakpoint
                return Ci.jsdIExecutionHook.RETURN_CONTINUE;
            },

            onDebugger: function(frame, type, rv){
                return this.onHalt(frame, type, rv);
            },

            onPropertyChanged: function(propertyName, oldValue, newValue, object, eventRequest){
                var onModificationWatchpointEvent = this.onModificationWatchpointEvent;
                var callBack = function(frame, type, rv){
                    onModificationWatchpointEvent(eventRequest, frame, type, rv, object, propertyName, oldValue, newValue);
                }
                this.halt(eventRequest.context, callBack);
            },

            //------------------------------ internal functions ---------------------------

            //TODO improve it
            // set breakpoint
            setJSDBreakpoint: function(sourceFile, bp)
            {
                var scripts = sourceFile.getScriptsAtLineNumber(bp.lineNo);
                if (!scripts)
                {
                     scripts = [sourceFile.outerScript];
                }

                if (!bp.scriptsWithBreakpoint)
                {
                    bp.scriptsWithBreakpoint = [];
                    bp.pc = [];
                }

                for (var i = 0; i < scripts.length; i++)
                {
                    var script = scripts[i];
                    if (!script.isValid){
                        continue;
                    }

                    var haveScript = false;
                    for (let j = 0; j < bp.scriptsWithBreakpoint.length; j++)
                    {
                        if (bp.scriptsWithBreakpoint[j].tag === script.tag)
                           {
                            haveScript = true;
                            break;
                           }
                    }
                    if (haveScript) //it is already set
                        continue;

                    var pcmap = sourceFile.pcmap_type;
                    if (!pcmap)
                    {
                        pcmap = Ci.jsdIScript.PCMAP_SOURCETEXT;
                    }
                    var jsdLine = bp.lineNo + sourceFile.getBaseLineOffset();

                    var isExecutable = false;
                    try {
                         isExecutable = script.isLineExecutable(jsdLine, pcmap);
                    } catch(e) {
                        // guess not then...
                    }

                    if (isExecutable)
                    {
                        var pc = script.lineToPc(jsdLine, pcmap);
                        var pcToLine = script.pcToLine(pc, pcmap);  // avoid calling this unless we have to...

                        if (pcToLine == jsdLine)
                        {
                            script.setBreakpoint(pc);

                            bp.scriptsWithBreakpoint.push(script);
                            bp.pc.push(pc);
                            bp.pcmap = pcmap;
                            bp.jsdLine = jsdLine;

                            if (pc == 0)  // signal the breakpoint handler to break for user
                                sourceFile.breakOnZero = script.tag;

                        }
                    }
                 }
            },

            findBreakpointByScript: function(context, script, pc)
            {
                var urlsWithBreakpoints = context.qpfbug.breakpointURLs;
                var breakpoints = context.qpfbug.breakpoints;
                for (let iURL = 0; iURL < urlsWithBreakpoints.length; iURL++)
                {
                    var url = urlsWithBreakpoints[iURL];
                    var urlBreakpoints = breakpoints[url];
                    if (urlBreakpoints)
                    {
                        for (var iBreakpoint = 0; iBreakpoint < urlBreakpoints.length; ++iBreakpoint)
                        {
                            var bp = urlBreakpoints[iBreakpoint];
                            if (bp.scriptsWithBreakpoint)
                            {
                                for (let iScript = 0; iScript < bp.scriptsWithBreakpoint.length; iScript++)
                                {
                                    if ( bp.scriptsWithBreakpoint[iScript] && (bp.scriptsWithBreakpoint[iScript].tag == script.tag) && (bp.pc[iScript] == pc) )
                                        return bp;
                                }
                            }
                        }
                    }
                }

                return null;
            },

        };

        constructor.getInstance = function(){
            if (!QPFBUG.debugService)
            {
                var fbs = QPFBUG.fbs;
                QPFBUG.debugService = new DebugService(fbs);
            }
            return QPFBUG.debugService;
        };

        return constructor;
    }();

}}

};
