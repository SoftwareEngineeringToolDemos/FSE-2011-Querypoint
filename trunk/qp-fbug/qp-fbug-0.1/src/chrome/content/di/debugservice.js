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
            this.eventRequests = [];
        };

        constructor.prototype =
        {
            
            // TODO: in cases that owner object created in another context this request
            // will not be effective, we need to consider all contexts to make sure
            // that we don't miss anything.
            //
            // url & lineNo that the object is created there.
            createModificationWatchpointRequest: function(callBack, context, ownerCreationURL,
                                                          ownerCreationLineNo, propertyName){
                var eventRequest = new EventRequest(EventRequest.TYPES.WATCHPOINT, callBack, context,
                                                    null, null,
                                                    ownerCreationURL, ownerCreationLineNo, propertyName
                                                    );
                this.eventRequests.push(eventRequest);
                return eventRequest;
            },

            createBreakpointRequest: function(callBack, context, url, lineNo ){

                var eventRequest = new EventRequest(EventRequest.TYPES.BREAKPOINT, callBack, context,
                                                    url, lineNo,
                                                    null, null, null
                                                    );
                this.eventRequests.push(eventRequest);
                return eventRequest;
            },

            //--------------------------------- changes to loaded scripts --------------------------------
            // source file is created or changed so update breakpoints
            onSourceFileCreated: function(context, sourceFile){
                var eventRequests = this.eventRequests;

                for (var i=0 ; i<eventRequests.length ; i++)
                {
                    var eventRequest = eventRequests[i];
                    if (eventRequest.context != context)
                        continue;
                    if (sourceFile.href == eventRequest.bp_url){
                        var bp = {type: 1, href: sourceFile.href, lineNo: eventRequest.bp_lineNo, disabled: 0,
                                  debuggerName: "QPFBUG",
                                  condition: "", onTrue: true, hitCount: -1, hit: 0, tracePoints : []};
                        eventRequest.breakpoints=[];
                        eventRequest.breakpoints.push(bp);
                        this.setJSDBreakpoint(sourceFile, bp);
                    }

                    if (sourceFile.href == eventRequest.w_ownerCreationURL){
                        var bp = {type: 1, href: url, lineNo: eventRequest.w_ownerCreationLineNo, disabled: 0,
                                  debuggerName: "QPFBUG",
                                  condition: "", onTrue: true, hitCount: -1, hit: 0, tracePoints : []};
                        eventRequest.breakpoints=[];
                        eventRequest.breakpoints.push(bp);
                        this.setJSDBreakpoint(sourceFile, bp);
                    }
                    trace(sourceFile.href+ " " + eventRequest.bp_url);

                }
            },

            //------------------------------------------ jsd hooks -------------------------------------------------
            onInterrupt: function(frame, type, rv){
//                var context = this.getContextFromFrame(frame);
//                if (!context || !context.qpfbug.stepping) // it is not in any context that manager knows
//                    return Ci.jsdIExecutionHook.RETURN_CONTINUE;
//
//                QPFBUG.FBTrace.sysout("******* " + frame.line + "," +frame.pc +  " , " + frame.isConstructing +" , "+ frame.script.functionSource, frame);
//
//                if (context.qpfbug.isStepping)
//                {
//                    this.inStepping(context, frame, type, rv);
//                }
                return Ci.jsdIExecutionHook.RETURN_CONTINUE;

            },

            onFunction: function(frame, type, rv){
//                var context = this.getContextFromFrame(frame);
//                if (!context || !context.qpfbug.stepping) // it is not in any context that manager knows
//                    return false;
//
//                QPFBUG.FBTrace.sysout("******* " + frame.line + "," +frame.pc +  " , " + frame.isConstructing +" , "+ frame.script.functionSource, frame);
//
//                if (context.qpfbug.isStepping)
//                {
//                    this.inStepping(context, frame, type, rv);
//                }
                return Ci.jsdIExecutionHook.RETURN_CONTINUE;
            },

            onBreakpoint: function(frame, type, rv){
                var eventRequests = this.eventRequests;
                var eventRequest;
                var script = frame.script;
                var context = this.getContextFromFrame(this.fbs, frame);
                for (let i=0 ; i<eventRequests.length ; i++){

                    eventRequest = eventRequests[i];
                    if (eventRequest.context != context)
                        continue;
                    for (let j=0 ; j<eventRequest.breakpoints.length ; j++){ //there is only one

                        var bp = eventRequest.breakpoints[j];
                        if (bp.scriptsWithBreakpoint)
                        {
                            for (let iScript = 0; iScript < bp.scriptsWithBreakpoint.length; iScript++)
                            {
                                if ( bp.scriptsWithBreakpoint[iScript] && (bp.scriptsWithBreakpoint[iScript].tag == script.tag) && (bp.pc[iScript] == pc) )
                                {
                                    if (eventRequest.type == EventRequest.BREAKPOINT)
                                    {
                                        eventRequest.callBack(eventRequest, frame, type, rv);
                                    }
                                    if (eventRequest.type == EventRequest.WATCHPOINT) 
                                    {
                                        // start monitoring the execution

                                    }
                                }
                            }
                        }
                    }
                }

                //find eventRequests related to this breakpoint
                return Ci.jsdIExecutionHook.RETURN_CONTINUE;
            },

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

            //to find new created objects in a line
            inStepping: function(context, frame, type, rv){
                context.qpfbug.stepping.currentscript;
                context.qpfbug.stepping.assignees;

                var currentScript = context.qpfbug.stepping.currentscript;
                var depth = context.qpfbug.stepping.callstackdepth;
                QPFBUG.FBTrace.sysout('Depth : ' + depth + " " + this.getCallStackDepth(frame));

                if (!currentScript || (frame.script.tag != currentScript.tag))
                {
                    context.qpfbug.isStepping = false;
                    return;
                }
//                if (frame.line != context.qpfbug.stepping.searchLine)
//                {
//                    context.qpfbug.isStepping = false;
//                    return;
//                }


                context.qpfbug.stepping = true;
                context.qpfbug.stepping.stepCount = 0;

                var scriptAnalyzer = context.qpfbug.stepping.scriptAnalyzer;
                var refs = context.qpfbug.stepping.refs;
                var refValues = context.qpfbug.stepping.refValues;
                var result;

                if (!refs)
                {
                    currentScript = frame.script;
                    scriptAnalyzer = context.qpfbug.stepping.scriptAnalyzer =
                        new ScriptAnalyzer(currentScript.functionSource);

                    refs = context.qpfbug.stepping.refs =
                        scriptAnalyzer.getRefsToCreatedObjects(true);

                    QPFBUG.FBTrace.sysout("<<<<<<<<  "+ refs.join(" , "));
                    refValues = context.qpfbug.stepping.refValues = [];

                    for (let k=0 ; k<refs.length ; k++)
                    {
                        QPFBUG.FBTrace.sysout("<<<<<<<<" + refs[k]);
                        refValue = null;
                        result = {};
                        try{
                            frame.eval(ref[k], "", 1, result)
                            refValue = result.value;
                        }catch(e)
                        {
                        }
                        QPFBUG.FBTrace.sysout("<<<<<<<<", refValue);
                        refValues[k] = refValue;
                    }
                }else{
                    for (let k=0 ; k<refs.length ; k++)
                    {
                        QPFBUG.FBTrace.sysout("<<<<<<<<" + refs[k]);
                        refValue = null;
                        result = {};
                        try{
                            frame.eval(ref[k], "", 1, result)
                            refValue = result.value;
                        }catch(e)
                        {
                        }
                        if (refValue && refValues[k] != refValue)
                        {
                            if (typeof(refValue) == "object")
                            {
                                refValue.watch(context.qpfbug.stepping.propertyToWatch,
                                   function (id, oldval, newval) {
                                      QPFBUG.FBTrace.sysout("o." + id + " changed from " + oldval + " to " + newval);
                                      return newval;
                                   });
                            }
                        }
                    }
                }
                //step_into 2
//                this.fbs.step(2, context.stoppedFrame, context.qpfbug.firefoxWindow.Firebug.Debugger);
//                this.fbs.startStepping();

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

            getContextFromFrame: function(fbs, frame)
            {
                var context;

                // this 'outerMostScope' is just the outermost scope (not necessarily
                // 'manager.win' which has 'Firebug' object)
                outerMostScope = this.fbs.getOutermostScope(frame);
                if (outerMostScope)
                {
                    outerMostScope = outerMostScope.wrappedJSObject;
                    for (i=0 ; i<QPFBUG.windows.length ; i++)
                    {
                        context = QPFBUG.windows[i].TabWatcher.getContextByWindow(outerMostScope);
                        if (context)
                            return context;
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
