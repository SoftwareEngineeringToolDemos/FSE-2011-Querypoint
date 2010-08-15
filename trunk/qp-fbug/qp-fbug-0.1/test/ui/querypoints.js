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
            var panel = FW.FirebugChrome.selectPanel("tracepoints");

            var QPFBUG = FBTest.FirebugWindow.QPFBUG;
            FBTest.ok(QPFBUG, "FBTest.FirebugWindow.QPFBUG exists");
            FBTest.ok(QPFBUG.Classes, "FBTest.FirebugWindow.QPFBUG.Classes exists");

            with (QPFBUG.Classes)
            {
                var debugSession = new DebugSession(1);
                FBTest.ok(debugSession, "Created a debugSession");
                FW.Firebug.chrome.select(debugSession);
                FBTest.compare("tracepoints", FW.Firebug.chrome.getSelectedPanel().name, "The tracepoints panel should be selected");

                var href = win.location.toString();
                var line = 18;
                var queryPointA = debugSession.debugModel.addQueryPoint_Breakpoint(href, line, 0);
                FBTest.ok(queryPointA, "Created a breakpoint querypoint");

                var jsdTrace = FW.FBL.getCurrentJSDStackDump();
                FBTest.sysout("jsdTrace ", jsdTrace);
                var stackFrameLogA = new StackFrameLog(jsdTrace, FW.Firebug.currentContext);
                var fakeFrames = [];
                fakeFrames[0] = new FW.FBL.StackFrame(FW.FBL.getSourceFileByHref(href, FW.Firebug.currentContext), line, "foo");
                stackFrameLogA.setFrames(fakeFrames);

                var tracePointA = new TracePoint(1, queryPointA, stackFrameLogA);

                FW.Firebug.chrome.select(tracePointA);
                FBTest.compare("tracepoints", FW.Firebug.chrome.getSelectedPanel().name, "The tracepoints panel should be selected");
                FBTest.compare(tracePointA, FW.Firebug.chrome.getSelectedPanel().location, "The location should be correct");
                var sourceRow = FBTestFirebug.getSourceLineNode(line);
                FBTest.progress("The sourceRow ", sourceRow);

                var propertyPath = "myObject.myProperty";
                var queryPointB = debugSession.debugModel.addQueryPoint_LastChange(queryPointA, 0, propertyPath);

                var stackFrameLogB = new StackFrameLog(jsdTrace, FW.Firebug.currentContext);
                var fakeFrames = [];
                var line = 13;
                fakeFrames[0] = new FW.FBL.StackFrame(FW.FBL.getSourceFileByHref(href, FW.Firebug.currentContext), line, "bar");
                stackFrameLogB.setFrames(fakeFrames);
                
                var tracePointB = new TracePoint(2, queryPointB, stackFrameLogB);
                FW.Firebug.chrome.select(tracePointB);
            }
             
            FBTest.testDone("queryPoints.DONE");

        });
    });
}
