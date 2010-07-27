function runTest()
{
        var QPFBUG = FBTest.FirebugWindow.QPFBUG;
        var Firebug = FBTest.FirebugWindow.Firebug;
        var qpfbug = Firebug.qpfbug;
        // were QPFBUG loaded
        FBTest.ok(QPFBUG, "QPFBUG")
        FBTrace.sysout("QPFBUG", qpfbug);
        FBTest.ok(QPFBUG.Lang, "QPFBUG.Lang")
        FBTest.ok(QPFBUG.Classes, "QPFBUG.Classes")
        FBTest.ok(QPFBUG.manager, "QPFBUG.manager")
        FBTest.ok(QPFBUG.jsdEventHandler, "QPFBUG.jsdEventHandler")
        FBTest.ok(qpfbug.moduleEventHandler, "Firebug.qpfbug.moduleEventHandler")
        FBTest.ok(qpfbug.uiEventHandler, "Firebug.qpfbug.uiEventHandler")
        FBTest.testDone("QPFBUG was loaded successfully!");
};
