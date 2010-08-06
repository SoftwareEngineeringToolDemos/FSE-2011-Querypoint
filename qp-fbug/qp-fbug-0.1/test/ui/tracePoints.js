function runTest()
{
    FBTest.sysout("tracePoints");

    // 1) Load test case page
    FBTest.openNewTab(basePath + "test/ui/testPage.html", function(win)
    {
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
                var href = win.location.toString();
                var line = 18;
                var tracePointA = debugSession.debugModel.addTracePoint_Breakpoint(href, line, 0);
                FW.Firebug.chrome.select(debugSession);

            }
            FBTest.testDone("tracePoints.DONE");

        });
    });
}
