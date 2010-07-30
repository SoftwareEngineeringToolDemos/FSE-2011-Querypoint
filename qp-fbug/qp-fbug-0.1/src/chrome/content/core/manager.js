var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

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
                if (reproductionId)
                {
                    reproduction = this.dataStore.getReproduction(reproductionId);
                }
                if (!reproduction)
                {
                    if (!debugSession)
                        debugSession = this.dataStore.newDebugSession();
                    reproduction = this.dataStore.newReproduction(debugSession);
                    debugSession.reproductions.push(reproduction);
                }
                return reproduction;
            },

            //------------------------- actions ---------------------------------------
            onSourceFileCreated: function(context, sourceFile){
                var tracePoints = context.qpfbug.debugSession.debugModel.tracePoints;

                //remove all breakpoints for this sourceFile
                var breakpoints = context.qpfbug.breakpoints[sourceFile.href] = [];

                var anyBreakpoint = false;

                for (i in tracePoints)
                {
                    var tracePoint = tracePoints[i];
                    if (tracePoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT)
                    {
                        if (tracePoint.url == sourceFile.href)
                        {
                            var bp = {type: 1, href: sourceFile.href, lineNo: tracePoint.lineNo, disabled: 0,
                                      debuggerName: "QPFBUG",
                                      condition: "", onTrue: true, hitCount: -1, hit: 0, tracePoints : []};
                            bp.tracePoints.push(tracePoint);
                            breakpoints.push(bp);
                            anyBreakpoint = true;
                            context.qpfbug.firefoxWindow.FBL.fbs.setJSDBreakpoint(sourceFile, bp);
                        }

                    }

                    if (tracePoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE)
                    {
                        var traceObjectLog = context.qpfbug.debugSession.getLastTraceObjectLog(
                                     tracePoint.globalObjectRef.refPoint,
                                     tracePoint.globalObjectRef.frameNo,
                                     tracePoint.globalObjectRef.ref
                                     );

                        if (traceObjectLog)
                        {
                            var lineNo;
                            var url;
                            if (sourceFile.href == traceObjectLog.parentCreatorURL)
                            {
                                url = sourceFile.href;
                                lineNo = traceObjectLog.parentCreatorLine;
                            }

                            if (sourceFile.href == traceObjectLog.parentConstructorURL)
                            {
                                url = sourceFile.href;
                                lineNo = traceObjectLog.parentConstructorLine;
                            }

                            if (url)
                            {
                                var bp = {type: 1, href: url, lineNo: lineNo, disabled: 0,
                                          debuggerName: "QPFBUG",
                                          condition: "", onTrue: true, hitCount: -1, hit: 0, tracePoints : []};
                                bp.tracePoints.push(tracePoint);
                                breakpoints.push(bp);
                                anyBreakpoint = true;
                                context.qpfbug.firefoxWindow.FBL.fbs.setJSDBreakpoint(sourceFile, bp);
                            }
                        }

                    }

                }
                if (anyBreakpoint)
                    context.qpfbug.breakpointURLs.push(sourceFile.href);

            },

            onFunction: function(frame, type, rv){

                return false;
            },


            onBreak: function(frame, type ,rv){

                var context = this.getContextFromFrame(this.fbs, frame);
                if (!context) // it is not in any context that manager knows
                    return false;

                context.stoppedFrame = frame;
                var bp = this.findBreakpointByScript(context, frame.script, frame.pc);

                //var fbugbp = fbs.findBreakpointByScript(frame.script, frame.pc);
                if (!bp) // it is not any of manager's breakpoints
                    return false;

                if (!bp.tracePoints)
                    return false;

                for (let i=0 ; i<bp.tracePoints.length ; i++ )
                {
                    var tracePoint = bp.tracePoints[i];
                    var tracePointLog;
                    if (tracePoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT)
                    {
                        tracePointLog = context.qpfbug.reproduction.executionLog.addTracePointLog(tracePoint, frame);
                    }
                    if (tracePoint.queryType == DebugModel.QUERY_TYPES.LASTCHANGE)
                    {
                        // get the object which is Created
                        //set watch point

                        //getScriptsAtLineNumber
                        tracePointLog = context.qpfbug.reproduction.executionLog.addTracePointLog(tracePoint, frame);
                        var sourceFile = context.sourceFileMap[context.qpfbug.firefoxWindow.FBL.normalizeURL(frame.script.fileName)];
//                        QPFBUG.FBTrace.sysout(sourceFile.getScriptsAtLineNumber(bp.lineNo));
                        context.qpfbug.isStepping = true;

                        context.qpfbug.stepping = {};
                        context.qpfbug.stepping.stepCount = 0;
                        context.qpfbug.stepping.searchURL = bp.href;
                        context.qpfbug.stepping.searchLine = bp.lineNo;
                        context.qpfbug.stepping.propertyToWatch = tracePoint.globalObjectRef.propertyName;
                        context.qpfbug.stepping.currentscript = frame.script;
                        context.qpfbug.stepping.callstackdepth = this.getCallStackDepth(frame);
                        
                        this.inStepping(context, frame, type, rv);
                    }
                };

                context.stoppedFrame = null;
                return true;
            },


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
                outerMostScope = fbs.getOutermostScope(frame);
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
