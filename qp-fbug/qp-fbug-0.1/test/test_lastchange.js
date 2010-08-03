// Test entry point.                
function runTest()
{

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
        var node = testData.firstTabWin.document.getElementById("myBody");
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
            setTimeout(cleanUpReproductionTabs, 500);
            FBTest.testDone("DONE");
        });
    }



     // wait for the second tab
     // once it is loaded and the reproduction point hit
     // check collected data

    var testData = {};
    testData.bp_lineNo = 17;
    FBTestFirebug.openNewTab(basePath + "test/page_simple.html", firstTabLoaded);
    
};

/**
 * Closes all Firefox tabs that were opened because of test purposes.
 */
var cleanUpReproductionTabs = function()
{
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
}


