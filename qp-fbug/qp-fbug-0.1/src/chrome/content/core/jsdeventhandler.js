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

//                if ( fbs.isTopLevelScript(frame, type, rv) )
//                    return jsdEventHandler.fbs_onBreakpoint.apply(fbs,arguments);

                var outerMostScope;
                var manager;
                var context;

                // this 'outerMostScope' is just the outermost scope (not necessarily
                // 'manager.win' which has 'Firebug' object)
                outerMostScope = fbs.getOutermostScope(frame);
                if (outerMostScope)
                {
                    outerMostScope = outerMostScope.wrappedJSObject;
//                    for (i=0 ; i<jsdEventHandler.managers.length ; i++)
//                    {
//                        manager = jsdEventHandler.managers[i];
//                        context = manager.win.TabWatcher.getContextByWindow(outerMostScope);
//                        if (context) break;
//                    }
                }
                if (!context)
                    return jsdEventHandler.fbs_onBreakpoint.apply(fbs,arguments);

                with(manager.win)
                {
                    FBTrace.sysout("************** Context", context);
                    var reproduction = context.reproduction;
                    reproduction.on
                    var tracePoints = context.debugSession.debugModel.tracePoints;
                    for (i=0 ; i<tracePoints.length ; i++)
                    {
                        var tracePoint = tracePoints[i];
                    }
                }
                var returnValue = jsdEventHandler.fbs_onBreakpoint.apply(fbs, arguments);
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