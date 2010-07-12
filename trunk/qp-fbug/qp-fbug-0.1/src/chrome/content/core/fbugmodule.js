// This script should be loaded into QPFBUG object
//------------------------------- FBUGModule ------------------------------
with (FBL) {
with (QPFBUG.Lang){
with (QPFBUG.Classes){

    var owner = QPFBUG;
    owner.FBUGModule = extend(Firebug.Module,  //TODO change it to activeModule
    {

        stateMachine : new StateMachine
            (
                ["not-initialized", "initialized"],
                "not-initialized",
                [
                    ["initialize", "not-initialized", "not-initialized"]
                ] 
            ),

        initialize: function(){
            this.stateMachine.startTransit("initialize");

            QPFBUG.qpfbugState = new QPFBUG.Classes.QpfbugState();

            this.stateMachine.endTransit();
        },
        initializeUI: function()
        {

           this.jsd = Cc["@mozilla.org/js/jsd/debugger-service;1"].getService(Ci.jsdIDebuggerService);
           jsd.flags=0;

            var old_onBreakpoint = fbs.onBreakpoint;
            fbs.onBreakpoint = function(frame, type, val){
                FBTrace.sysout("onBreakpoint frame ... ", frame);
                FBTrace.sysout("onBreakpoint type ... ", type);
                FBTrace.sysout("onBreakpoint val ... ", val);

                return old_onBreakpoint.apply(this,arguments);
            };
            fbs.hookScripts();
    //        jsd.breakpointHook = { onExecute: hook(fbs.onBreakpoint, RETURN_CONTINUE) };

                QPFBUG.addLastChangeMenuItem();

                //added code for FBTest
                var testListURI="C:\\salmir\\work\\epfl\\projects\\43_querypoint-debugging\\trunk\\qp-fbug\\qp-fbug-0.1\\test\\testList.html";
                var args = {
                    firebugWindow: window,
                    testListURI: testListURI
                };
                window.arguments[0] = args;

                var FBTest = FBTestApp.FBTest = {};
                FBTestApp.TestConsole =
                {
                   initialize : function(){},
                   shutdown : function(){},
                };

        },
        initContext: function(context, persistedState)
        {
            if (FBTrace.DBG_QPFBUG)
                FBTrace.sysout("QPFBUG initContext() ..." , context);

           var tabBrowser = $("content");
           var selectedTab = tabBrowser.selectedTab;

           if (selectedTab.hasAttribute("debugSessionId"))
           {
               Firebug.Console.log(selectedTab.getAttribute("debugSessionId")+" ");
               Firebug.Console.log(selectedTab.getAttribute("reproductionId")+" ");
           }else{
               var debugSession = QPFBUG.qpfbugState.newDebugSession();
               if (FBTrace.DBG_QPFBUG)
                     FBTrace.sysout("New debug session was created." , debugSession);
           }

           //var debugSession = QPFBUG.qpfbugState.getDebugSession(debugSessionId);
           // analyze debug model
           // set breakpoint as javascripts are loaded
           // store points
           // find the right one.

           object = context.window;
           if (object.wrappedJSObject)
                    object = object.wrappedJSObject;

            if (FBTrace.DBG_QPFBUG)
                FBTrace.sysout("... QPFBUG initContext()." , context);
        },
        loadedContext: function(context)
        {
           Firebug.Console.log("loadedContext ................. " + context.uid);

        }
    });
}}};