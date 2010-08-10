function runTest()
{
    FBTest.sysout("UI Unit Test for queryPoints");

    // 1) Load test case page
    FBTest.openNewTab(basePath + "test/ui/testPage.html", function(win)
    {
        FBTest.progress("Opened "+win.location);
        // 2) Open Firebug and enable the QP panel.
        FBTest.openFirebug();
        FBTest.enableScriptPanel(function(win)
        {
            // 3) Select the Script panel
            var panel = FW.FirebugChrome.selectPanel("querypoints");

            var QPFBUG = FBTest.FirebugWindow.QPFBUG;
            FBTest.ok(QPFBUG, "FBTest.FirebugWindow.QPFBUG exists");
            FBTest.ok(QPFBUG.Classes, "FBTest.FirebugWindow.QPFBUG.Classes exists");

            with (QPFBUG.Classes)
            {
                var debugSession = new DebugSession(1);
                FBTest.ok(debugSession, "Created a debugSession");
                FW.Firebug.chrome.select(debugSession);
                FBTest.compare("querypoints", FW.Firebug.chrome.getSelectedPanel().name, "The querypoints panel should be selected");
                
                var href = win.location.toString();
                var line = 18;
                var queryPointA = debugSession.debugModel.addQueryPoint_Breakpoint(href, line, 0);
                FBTest.ok(queryPointA, "Created a breakpoint querypoint");
                
                var stackFrameLogA = new StackFrameLog();
                
                var tracePointA = new TracePoint(1, queryPointA, stackFrameLogA);
                
                FW.Firebug.chrome.select(tracePointA);
                FBTest.compare("querypoints", FW.Firebug.chrome.getSelectedPanel().name, "The querypoints panel should be selected");
                FBTest.compare(href, FW.Firebug.chrome.getSelectedPanel().location, "The location should be correct");
                var sourceRow = FBTestFirebug.getSourceLineNode(line);
                FBTest.progress("The sourceRow ", sourceRow);
                
                var propertyPath = "myObject.myProperty";
                var queryPointB = debugSession.debugModel.addQueryPoint_LastChange(queryPointA, 0, propertyPath);
                
                var stackFrameLogB = new StackFrameLog();
                var tracePointB = new TracePoint(2, queryPointB, stackFrameLogB);
                FW.Firebug.chrome.select(tracePointB);
            }
            debugger;
            FBTest.testDone("queryPoints.DONE");

        });
    });
}
