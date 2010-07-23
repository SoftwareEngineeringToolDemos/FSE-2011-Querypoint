var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- JSDEventHandler --------------------------------
// Only one instance of this class will be created and it is kept in QPFBUG.jsdEventHandler;

owner.JSDEventHandler = function(){

        var constructor = function(fbs){
            this.fbs = fbs;
        };

        constructor.prototype =
        {
            init : function(){
                this.replaceFBSFunction("enableDebugger");
                this.replaceFBSFunction("onScriptCreated");
                this.replaceFBSFunction("onScriptDestroyed");
                this.replaceFBSFunction("onDebugger");
                this.replaceFBSFunction("onDebug");
                this.replaceFBSFunction("onBreakpoint");
                this.replaceFBSFunction("onThrow");
                this.replaceFBSFunction("onError");
                this.replaceFBSFunction("onTopLevel");
                this.fbs.unhookScripts();
                this.fbs.getJSD().flags = 0;
                this.fbs.hookScripts();

            },


            // ---------------------------------------   fbs functions -----------------------------
            // Do not use "this" in the following methods.
            // because it can be jsdEventHandler or fbs.
            // enables debugger
            enableDebugger : function(){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_enableDebugger.apply(fbs, arguments);

                //activate object tracing
                fbs.getJSD().flags = 0;
                return returnValue;
            },
            //jsd.scriptHook.onScriptCreated
            onScriptCreated: function(script){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onScriptCreated.apply(fbs, arguments);
                return returnValue;
            },

            //jsd.scriptHook.onScriptDestroyed
            onScriptDestroyed: function(script){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onScriptDestroyed.apply(fbs, arguments);
                return returnValue;
            },

            // jsd debuggerHook
            onDebugger: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onDebugger.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.debugHook
            onDebug: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;
                var returnValue = jsdEventHandler.fbs_onDebug.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.breakpointHook
            onBreakpoint: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                var context = jsdEventHandler.getContextFromFrame(fbs, frame);

                if (!context)
                    return jsdEventHandler.fbs_onBreakpoint.apply(fbs,arguments);



                var bp = jsdEventHandler.findBreakpointByScript(context, frame.script, frame.pc);
                QPFBUG.FBTrace.sysout("xxxxxxxxxxxxxxxxx");

//                   var fbugbp = fbs.findBreakpointByScript(frame.script, frame.pc);
                if (!bp)
                    return jsdEventHandler.fbs_onBreakpoint.apply(fbs,arguments);
                QPFBUG.FBTrace.sysout("eeeeeeeeeeeeee");

                var win = context.qpfbug.firefoxWindow;
                with(win)
                {
                    QPFBUG.FBTrace.sysout("BP");
                    QPFBUG.FBTrace.sysout(frame.script.fileName);
                    QPFBUG.FBTrace.sysout("************** Context", context);
                    var reproduction = context.qpfbug.reproduction;
//                    var tracePoints = context.qpfbug.debugSession.debugModel.tracePoints;
//                    for (i=0 ; i<tracePoints.length ; i++)
//                    {
//                        var tracePoint = tracePoints[i];
//                    }
                }
                var returnValue = Components.interfaces.jsdIExecutionHook.RETURN_CONTINUE;
                return returnValue;

            },

            // jsd.throwHook
            onThrow: function(frame, type, rv){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                var returnValue = jsdEventHandler.fbs_onThrow.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.errorHook
            onError: function(message, fileName, lineNo, pos, flags, errnum, exc){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                var returnValue = jsdEventHandler.fbs_onError.apply(fbs, arguments);
                return returnValue;
            },

            // jsd.topLevelHook
            onTopLevel: function(frame, type){
                var jsdEventHandler = QPFBUG.jsdEventHandler;
                var fbs = jsdEventHandler.fbs;

                var returnValue = jsdEventHandler.fbs_onTopLevel.apply(fbs, arguments);
                return returnValue;
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


            replaceFBSFunction: function(functionName)
            {
                this["fbs_"+functionName] = this.fbs[functionName];
                this.fbs[functionName] = this[functionName];
            }



        };


        constructor.getInstance = function(fbs){
            if (!QPFBUG.jsdEventHandler)
            {
                QPFBUG.jsdEventHandler = new JSDEventHandler(fbs);
                QPFBUG.jsdEventHandler.init();
            }
            return QPFBUG.jsdEventHandler;
        };

        return constructor;
    }();
}}

};