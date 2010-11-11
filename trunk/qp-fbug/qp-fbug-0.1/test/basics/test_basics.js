function runTest()
{
        var QPFBUG = FBTest.FirebugWindow.QPFBUG;
        var Firebug = FBTest.FirebugWindow.Firebug;
        var qpfbug = Firebug.qpfbug;
        // were QPFBUG loaded
        FBTest.ok(QPFBUG, "QPFBUG");
        FBTest.ok(QPFBUG.Classes, "QPFBUG.Classes");
        var classesNo = 0;
        for (var i in QPFBUG.Classes)
            classesNo++;
        FBTest.compare( 42, classesNo, "Number of classes");
        FBTest.ok(QPFBUG.debugService, "QPFBUG.debugService");
        FBTest.ok(QPFBUG.manager, "QPFBUG.manager");
        FBTest.ok(QPFBUG.jsdEventHandler, "QPFBUG.jsdEventHandler");
        FBTest.ok(qpfbug.moduleEventHandler, "Firebug.qpfbug.moduleEventHandler");
        FBTest.ok(qpfbug.uiEventHandler, "Firebug.qpfbug.uiEventHandler");
        FBTest.testDone("QPFBUG was loaded successfully!");
};
