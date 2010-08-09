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
//        DoubleDebugger.getInstance().toggleDoubleDebugging(true);
//        DoubleDebugger.getInstance().disableDoubleDebugging();
//        traceFunctionCalls("jsdEventHandler", QPFBUG.jsdEventHandler.fbs);
//        traceFunctionCalls("fbs", QPFBUG.jsdEventHandler.fbs);
//        traceFunctionCalls("DebugService", QPFBUG.debugService);
//        traceFunctionCalls("moduleEventHandler", Firebug.qpfbug.moduleEventHandler);
//        traceFunctionCalls("Manager", QPFBUG.manager);

    }}
    FBTest.testDone();
};

