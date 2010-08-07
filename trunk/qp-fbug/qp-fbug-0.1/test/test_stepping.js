function runTest()
{
    var firstTabLoaded = function(win)
    {
//        testData.firstTabWin = win;
//        FBTestFirebug.openFirebug();
//        FBTestFirebug.selectPanel("script");
//        FBTestFirebug.enableScriptPanel(scriptPanelEnabled)
    };


    var win = FBTest.FirebugWindow;
    var QPFBUG = win.QPFBUG;
    var Firebug = win.Firebug;
    var qpfbug = Firebug.qpfbug;
    QPFBUG.testData = {};
    var myModule = QPFBUG.testData.myModule;

    with (QPFBUG.Classes){
    with (Lang){
        if (!myModule){
            trace("=================================", myModule);
            myModule = win.FBL.extend(Firebug.Module, {});
            QPFBUG.testData.myModule = myModule;
            Firebug.registerModule(myModule);
        }
        myModule.initialize = function(){
            trace(":::::::::::::::::::;");
        };

        myModule.initContext = function(context, persistedState){
            trace("xxxxxxxxxxxxxxxxxxxx " + context.uid);
            this.steppingDriver = DebugService.getInstance().getSteppingDriver(this, context);
            this.steppingDriver.start();
        };

        myModule.destroyContext = function(context, persistedState){
        },

        myModule.onStep = function(steppingDriver, stepMode, context, frame, type, rv){
            trace("JJJJJJJJJJJJJJJJJJJJ ");
            trace(this.isStopped + " -+-+-+" + frame.script.fileName + " " +  frame.script.pcToLine(frame.pc, Ci.jsdIScript.PCMAP_SOURCETEXT) + " " + frame.pc + "------- " + context.uid);
//                this.steppingDriver.start();
        },

        FBTestFirebug.openNewTab(basePath + "test/page_simple.html", firstTabLoaded);
        FBTest.openFirebug();
        FBTest.enableAllPanels();
    }}
};
