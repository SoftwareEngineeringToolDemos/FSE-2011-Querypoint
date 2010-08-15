// Test entry point.
function runTest()
{
    var QPFBUG = FBTest.FirebugWindow.QPFBUG;
    var Firebug = FBTest.FirebugWindow.Firebug;
    var FBTrace = FBTest.FirebugWindow.QPFBUG.FBTrace;

    with (QPFBUG.Classes){
    with (Lang){

        Firebug.TraceModule.openConsole();
        //write your code here
        //e.g., QPFBUG.reproducer.reproduce = function(){ ...}
//        pref("extensions.firebug.alwaysOpenTraceConsole", true);       /*@explore*/
//        pref("extensions.firebug.alwaysOpenTestConsole", true);       /*@explore*/
        //Enable double debugger
        DoubleDebugger.getInstance().toggleDoubleDebugging(false);
//        DoubleDebugger.getInstance().disableDoubleDebugging();
//        TraceUtils.traceClassFunctionCalls("Manager");
//        TraceUtils.traceClassFunctionCalls("Trace");
//
//        TraceUtils.traceClassFunctionCalls("ModuleEventHandler");
//        TraceUtils.traceClassFunctionCalls("ModuleEventHandler");
//        if (QPFBUG.contexts.length>0){ //set for already created objects.
//            var qpfbug = QPFBUG.contexts[0].qpfbug.firefoxWindow.Firbug.qpfbug;
//            TraceUtils.traceObjectFunctionCalls("ModuleEventHandler", qpfbug.moduleEventHandler);
//            TraceUtils.traceObjectFunctionCalls("ModuleEventHandler", qpfbug.uiEventHandler);
//        }
//        TraceUtils.traceClassFunctionCalls("DebugService");
//        TraceUtils.traceClassFunctionCalls("UIEventHandler");
//        TraceUtils.traceClassFunctionCalls("DebugModel");
//        TraceUtils.traceClassFunctionCalls("DebugSession");
//        traceFunctionCalls("fbs", QPFBUG.jsdEventHandler.fbs);
//        traceFunctionCalls("DebugService", QPFBUG.debugService);
//        traceFunctionCalls("moduleEventHandler", Firebug.qpfbug.moduleEventHandler);
//        traceFunctionCalls("Manager", QPFBUG.manager);

    }}
    FBTest.testDone();
};

