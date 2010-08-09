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
                var href = win.location.toString();
                var line = 18;
                var queryPointA = debugSession.debugModel.addQueryPoint_Breakpoint(href, line, 0);
                FBTest.ok(queryPointA, "Created a breakpoint querypoint");
                FW.Firebug.chrome.select(debugSession);
                FBTest.compare("querypoints", FW.Firebug.chrome.getSelectedPanel().name, "The querypoints panel should be selected");
            }
            //FBTest.testDone("queryPoints.DONE");

        });
    });
}
