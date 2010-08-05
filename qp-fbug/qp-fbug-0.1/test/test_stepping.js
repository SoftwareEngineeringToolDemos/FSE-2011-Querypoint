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
    FBTest.compare( 27, classesNo, "Number of classes");
    FBTest.ok(QPFBUG.debugService, "QPFBUG.debugService");
    FBTest.ok(QPFBUG.manager, "QPFBUG.manager");
    FBTest.ok(QPFBUG.jsdEventHandler, "QPFBUG.jsdEventHandler");
    FBTest.ok(qpfbug.moduleEventHandler, "Firebug.qpfbug.moduleEventHandler");
    FBTest.ok(qpfbug.uiEventHandler, "Firebug.qpfbug.uiEventHandler");
    FBTest.testDone("QPFBUG was loaded successfully!");

    var firstTabLoaded = function(win)
    {
        testData.firstTabWin = win;
        FBTestFirebug.openFirebug();
        FBTestFirebug.selectPanel("script");
        FBTestFirebug.enableScriptPanel(scriptPanelEnabled)
    };

    var testData = {};
    testData.bp_lineNo = 17;
    FBTestFirebug.openNewTab(basePath + "test/page_simple.html", firstTabLoaded);

};
