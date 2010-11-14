var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //------------------------------ DebugService --------------------------
    __owner.DebugService = function(){

        var constructor = function(fbs){
            this.fbs = fbs;
            this.nextEventRequestId = 0;
            this.nextBreakpointId = 0;

            this.registeredContexts = {};
            this.registeredContextsNo = 0;

            this.interruptListeners = {};
            this.functionListeners = {};
            this.listeningToInterrupts = 0;
            this.listeningToFunctions = 0;
            this.nextListenerId = 0;
            this.nextJSObjectId = 0;
            this.nextEventId = 0;

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
                return this.createEventRequest(context, eventRequest);
            },

            createBreakpointRequest: function(context, callBack, url, lineNo ){

                var eventRequest = new EventRequest(EventRequest.TYPES.BREAKPOINT, callBack, context,
                                                    url, lineNo,
                                                    null, null, null
                                                    );
                return this.createEventRequest(context, eventRequest);
            },

            //private function
            createEventRequest: function(context, eventRequest){
                if (!this.registeredContexts[context.uid]){
                    this.registeredContexts[context.uid] = context;
                    this.registeredContextsNo++;
                    context.qpfbug.eventRequests = [];
                }
                eventRequest.id = this.nextEventRequestId++;
                eventRequest.context = context;
                context.qpfbug.eventRequests.push(eventRequest);

                this.enableEventRequest(context, eventRequest);

                return eventRequest;
            },

            removeEventRequestsForContext: function(context){
                delete this.registeredContexts[context.uid];
                this.registeredContextsNo--;

                var eventRequests = context.qpfbug.eventRequests;
                if (!eventRequests)
                    return;
                var eventRequest;
                var executionMonitor;
                for (var i=0 ; i<eventRequests.length ; i++){
                    eventRequest = eventRequests[i];
                    for (var j=0 ; j<eventRequest.executionMonitors.length ; j++){
                         executionMonitor = eventRequest.executionMonitors[j]; 
                         executionMonitor.stop();
                    }
                }
                //todo remove jsd breakpoints

                context.qpfbug.eventRequests = null;
            },

            onModificationWatchpointEvent: function(eventRequests, object, propertyName, oldValue, newValue, frame, type, rv, isObjectCreation){

                var eventId = this.getNextEventId();

                //Note this method might be called indirectly by watch, onPropertyChange->halt , onHalst -> onModificationWatchpoint
                // or it might be called executionMonitor -> onObjectCreation -> onModification
                var targetFrame = frame;

                if (!isObjectCreation){ //so it is from onPropertyChanged
//                if (unwrapIValue(targetFrame.thisValue) === this){ //it is in debugServcie and is the call from onPropertyChanged.
                //ignore frames onPropertyChanged()
                    targetFrame = targetFrame.callingFrame;
                    // remove bindAtHead    
                    targetFrame = targetFrame.callingFrame;
                }

                var eventRequest;
                for (var i=0; i<eventRequests.length; i++){
                    eventRequest = eventRequests[i];


                    eventRequest.callBack(eventRequest, eventId, targetFrame, type, rv, object, propertyName, oldValue, newValue, isObjectCreation);
                }
            },

            onBreakpointEvent: function(eventRequest, frame, type, rv){
                var eventId = this.getNextEventId();
                eventRequest.callBack(eventRequest, eventId, frame, type, rv);
            },



            //--------------------------------- SteppingDriver ----------------------------
            getSteppingDriver: function(context){
                return new SteppingDriver(this.nextListenerId++, context);
            },

            releaseSteppingDriver: function(steppingDriver){
                steppingDriver.stop();
            },

            //----------------------------------JSObject id getter-----------------------------------
            getNextJSObjectId: function(){
                return ++this.nextJSObjectId;
            },

            //----------------------------------Event id getter-----------------------------------
            getNextEventId: function(){
                return ++this.nextEventId;
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

            //--------------------------------- EventRequest-SourceFile --------------------------------
            enableEventRequest: function(context, eventRequest){
                if (eventRequest.type == EventRequest.TYPES.WATCHPOINT  && !eventRequest.w_ownerCreationUrl){ //todo improve it
                    var unwrapped = unwrapObject(context.window);
                    unwrapped.watch(eventRequest.w_propertyName, bindAtHead(this.onPropertyChanged, this, eventRequest, context.window));
                };

                //set hooks for already loaded sourcefiles
                for (var i in context.sourceFileMap){
                    this.enableEventRequestForSourceFile(context, context.sourceFileMap[i], eventRequest);

                }
            },

            enableAllEventRequestsForSourceFile: function(context, sourceFile){
                var eventRequests = context.qpfbug.eventRequests;

                for (var i=0 ; i<eventRequests.length ; i++)
                {
                    var eventRequest = eventRequests[i];
                    this.enableEventRequestForSourceFile(context, sourceFile, eventRequest);
                }
            },

            enableEventRequestForSourceFile: function(context, sourceFile, eventRequest){
                if (sourceFile.href == eventRequest.bp_url){
                    var bp = {type: 1, href: sourceFile.href, lineNo: eventRequest.bp_lineNo, disabled: 0,
                              debuggerName: "QPFBUG",
                              condition: "", onTrue: true, hitCount: -1, hit: 0, querypoints : []};
                    bp.id = this.nextBreakpointId++;
                    eventRequest.breakpoints=[];
                    eventRequest.breakpoints.push(bp);
                    this.setJSDBreakpoint(sourceFile, bp);
                }

                if (sourceFile.href == eventRequest.w_ownerCreationUrl){
                    var bp = {type: 1, href: sourceFile.href, lineNo: eventRequest.w_ownerCreationLineNo, disabled: 0,
                              debuggerName: "QPFBUG",
                              condition: "", onTrue: true, hitCount: -1, hit: 0, querypoints : []};
                    bp.id = this.nextBreakpointId++;
                    eventRequest.breakpoints=[];
                    eventRequest.breakpoints.push(bp);
                    this.setJSDBreakpoint(sourceFile, bp);
                }
            },

            //----------------------------------------- halt functions ---------------------------------------------
            halt: function(callBack){
                var haltObject = new HaltObject(callBack);
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
//                var stepHandler = {
//                    start: function(context, frame, type, rv){
//                        this.steppingDriver = DebugService.getInstance().getSteppingDriver(this, context);
//                        this.steppingDriver.step(0, frame.script.tag, frame.line, frame.pc);
//                    },
//                    onStep: function(frame, type, rv, stackDepthChange){
//                        DebugService.getInstance().releaseSteppingDriver(this.steppingDriver);
//                        haltObject.callBack(frame, type, rv);
//                    },
//                }
//                stepHandler.start(haltObject.context, frame, type, rv);

                //ignore 2 frames haltObject.halt and halt
                var haltFrame = frame;
                for (var i=0 ; i<2 ; i++){
                    haltFrame = haltFrame.callingFrame;
                }

                haltObject.callBack(haltFrame, type, rv);
                return Ci.jsdIExecutionHook.RETURN_CONTINUE;
            },

            //--------------------------------- new/changed script --------------------------------
            // source file is created or changed so update breakpoints
            onSourceFileCreated: function(context, sourceFile){
                if (!this.registeredContexts[context.uid])
                    return;
                this.enableAllEventRequestsForSourceFile(context, sourceFile);
            },

            //------------------------------------------ jsd hooks -------------------------------------------------
            onInterrupt: function(context, frame, type, rv){
                QPFBUG.monitor.ds_counterInterrupt++;
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
                QPFBUG.monitor.ds_counterFunction++;
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
                QPFBUG.monitor.ds_counterBreakpoint++;
                trace("On Breakpoint : " + frame.line);
                var eventRequests = context.qpfbug.eventRequests;
                var eventRequest;
                var script = frame.script;
                var pc = frame.pc;
                for (var i=0 ; i<eventRequests.length ; i++){

                    eventRequest = eventRequests[i];
                    for (var j=0 ; j<eventRequest.breakpoints.length ; j++){ //there is only one

                        var bp = eventRequest.breakpoints[j];
                        if (bp.scriptsWithBreakpoint)
                        {
                            for (var iScript = 0; iScript < bp.scriptsWithBreakpoint.length; iScript++)
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
                                        //todo monitor should be saved in a list
                                        executionMonitor = new ExecutionMonitor(context);
                                        eventRequest.executionMonitors.push(executionMonitor);
                                        executionMonitor.start(bind(this.onObjectCreation, this), eventRequest, frame, type, rv);
//                                        executionMonitor.start(bindAtHead(this.onPropertyChanged, this, eventRequest), eventRequest.w_propertyName, frame, type, rv);
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

            onObjectCreation: function(eventRequest, object, frame, type, rv){
                QPFBUG.monitor.ds_objectCreation++;

                var objectId = object["___qpfbug_objectId___"];
                //JSD doesn't give us txhe watch call back then we need to keep it here.

                var watchEventRequests = object["___qpfbug_watchRequests___"]; // list of watchEventRequests

                if (!watchEventRequests){
                    watchEventRequests = {};
                    object["___qpfbug_watchRequests___"] = watchEventRequests;
                }

                var propertyName = eventRequest.w_propertyName;
                var watchRequests = watchEventRequests[propertyName];

                if (!watchRequests){
                    watchRequests = [eventRequest];
                }else{ //the object has id and therefore another watch callback
                    watchRequests.push(eventRequest);
                }

                watchEventRequests[propertyName] = watchRequests;

                var undefinedValue;
                var newValue = object[propertyName];
                if (typeof(newValue) !== "undefined"){ //if propertyName is set consider it as a property change
                    this.onModificationWatchpointEvent(watchRequests, object, propertyName, undefinedValue, newValue, frame, type, rv, true); // the old value is undefined
                }

                object.watch(propertyName, bindAtHead(this.onPropertyChanged, this, watchRequests, object));
                trace("Object('"+ objectId + "') watch() was called.");
            },

            onPropertyChanged: function(eventRequests, object, propertyName, oldValue, newValue){
                QPFBUG.monitor.ds_propertyChanged++;
//                var onModificationWatchpointEvent = this.onModificationWatchpointEvent;

                this.halt(bindAtHead(this.onModificationWatchpointEvent, this,
                          eventRequests, object, propertyName, oldValue, newValue));

                return newValue;
            },

            //------------------------------ JSD functions ---------------------------

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
                    if (!script || !script.isValid){
                        continue;
                    }

                    var haveScript = false;
                    for (var j = 0; j < bp.scriptsWithBreakpoint.length; j++)
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

            //todo 
            removeJSDBreakpoint: function(sourceFile, bp)
            {

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
