// Test entry point.                
function runTest()
{

	FW.Firebug.setPref("extensions.firebug", "querypoints.reproducer", 'hardwired');
	var reproducer = FW.Firebug.getPref("extensions.firebug", "querypoints.reproducer");
	FBTest.progress("Set extensions.firebug.querypoints.reproducer to "+reproducer);
	
    var firstTabLoaded = function(win)
    {
        testData.firstTabWin = win;
        FBTestFirebug.openFirebug();
        FBTestFirebug.selectPanel("script");
        FBTestFirebug.enableScriptPanel(scriptPanelEnabled)
    };

    var scriptPanelEnabled = function(win){
        // Set a breakpoint
        var lineNo = testData.bp_lineNo;
        var panel = FW.Firebug.chrome.getSelectedPanel();
        FBTest.compare("script", panel.name, "Got selected panel "+panel.name);
        var sourceRow = FBTestFirebug.getSourceLineNode(lineNo);
        if ("true" != sourceRow.getAttribute('breakpoint'))
        {
            panel.toggleBreakpoint(lineNo);
            sourceRow.setAttribute('breakpoint', "true");
        }
        // it is not a good way to check! just as a message.
        FBTest.compare("true", sourceRow.getAttribute('breakpoint'), "Line "+lineNo+" should have a breakpoint set");

        // Asynchronously wait for break in debugger.
        var chrome = FW.Firebug.chrome;
        FBTestFirebug.waitForBreakInDebugger(chrome, lineNo, true, breakpointHit);

        // click on the page
        var node = testData.firstTabWin.document.getElementById("myParagraph");
        FBTest.click(node);
    };

    var breakpointHit = function(row){

        var chrome = FW.Firebug.chrome;
        var panel = FBTestFirebug.getPanel("watches");
        var panelNode = panel.panelNode;

        setTimeout(clickOn_This, 100);
    };

    var clickOn_This = function(){
        var panel = FBTestFirebug.getPanel("watches");
        testData.watchesPanelNode = panel.panelNode;
        var thisElt = FW.FBL.getElementByClass(testData.watchesPanelNode, "memberLabel userLabel");
        FBTest.click(thisElt);
        setTimeout(clickOn_MyObject, 100);
    }

    var clickOn_MyObject = function(){
        var myObjectElt = FW.FBL.getElementsByClass(testData.watchesPanelNode, "memberLabel userLabel")[1];
        FBTest.click(myObjectElt);
        setTimeout(lastChangeOn_MyProperty, 100);
    }

    var lastChangeOn_MyProperty = function(){
        var myPropertyElt = FW.FBL.getElementsByClass(testData.watchesPanelNode, "memberLabel userLabel")[2];
        FBTest.executeContextMenuCommand(myPropertyElt, "lastChange", function()
        {
            setTimeout(end, 100000);
        });
    }

    var end = function()
    {
        //cleanUpReproductionTabs
        var tabbrowser = FBTest.FirebugWindow.getBrowser();
        var removeThese = [];
        for (var i = 0; i < tabbrowser.mTabs.length; i++)
        {
            var tab = tabbrowser.mTabs[i];

            var firebugAttr = tab.getAttribute("reproductionId");

            if (firebugAttr)
                removeThese.push(tab);
        }

        for (var i = 0; i < removeThese.length; i++)
                tabbrowser.removeTab(removeThese[i]);

        FBTest.testDone("DONE");
    }


     // wait for the second tab
     // once it is loaded and the reproduction point hit
     // check collected data

    var testData = {};
    testData.bp_lineNo = 21;
    FBTestFirebug.openNewTab(basePath + "test/usecase/page_double.html", firstTabLoaded);
    
};

/**
 * Closes all Firefox tabs that were opened because of test purposes.
 */


