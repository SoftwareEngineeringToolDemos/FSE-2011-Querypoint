// This script should be loaded into QPFBUG object
//------------------------------- FBUGModule ------------------------------
with (FBL) {
with (QPFBUG){
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
                    ["initialize", "not-initialized", "initialized"]
                ] 
            ),

        initialize: function(){
            this.stateMachine.startTransit("initialize");

            QPFBUG.manager = new Manager();

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
            manager.initContext(context, persistedState);
        },

        loadedContext: function(context)
        {
            manager.loadedContext(context, persistedState);
        }
    });
}}}};