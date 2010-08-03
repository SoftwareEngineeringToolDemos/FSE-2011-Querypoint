// Test entry point.
function runTest()
{
    var QPFBUG = FBTest.FirebugWindow.QPFBUG;
    with (QPFBUG.Classes){
    with (Lang){
        //write your code here
        //e.g., QPFBUG.reproducer.reproduce = function(){ ...}

        //Enable double debugger
        DoubleDebugger.getInstance().enableDoubleDebugging();


    }}
    FBTest.testDone();
};

