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
        panel.scrollToLine(null, lineNo);

        // Wait for the UI modification that shows the source line has been scrolled
        var lookLine = new MutationRecognizer(panel.document.defaultView, "Text", {}, lineNo+"");
        lookLine.onRecognizeAsync(function onFoundLine(sourceRow)
        {
            var sourceRow = FBTestFirebug.getSourceLineNode(lineNo);
            FBTest.ok(sourceRow, "The sourceRow at "+lineNo+" must exist");
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
            var node = testData.firstTabWin.document.getElementById("reproducer");
            FBTest.click(node);

        });
      };

    var breakpointHit = function(row){

        var chrome = FW.Firebug.chrome;
        var panel = FBTestFirebug.getPanel("watches");
        var panelNode = panel.panelNode;

        testData.watchesPanelNode = panel.panelNode;

        // Wait for the myObject line
        var lookLine = new MutationRecognizer(panel.document.defaultView, "Text", {}, "myObject");
        lookLine.onRecognizeAsync(function onFoundLine(tableRow)
        {
            FBTest.progress("found myObject tableRow "+tableRow, tableRow);

            var myObjectElt = FW.FBL.getElementsByClass(tableRow, "memberLabel userLabel")[0];
            FBTest.compare("myObject", myObjectElt.textContent, "The property name myObject must be found");

            // Wait for the table row to open
            var lookIn =  new MutationRecognizer(panel.document.defaultView, "Text", {}, "myProperty");
            lookIn.onRecognizeAsync(function onFoundProperty(tableRow)
            {
                FBTest.progress("found myProperty tableRow "+tableRow, tableRow);
                var myPropertyElt = FW.FBL.getElementsByClass(tableRow, "memberLabel userLabel")[0];
                FBTest.executeContextMenuCommand(myPropertyElt, "lastChange", function()
                {
                    FBTest.progress("clicked on lastChange, waiting for tracepoints panel");
                    FBTest.waitForPanel("tracepoints", end);  //TODO complete the test analysis
                });

            });

            FBTest.click(myObjectElt);  // open the table row
        });

        var thisElt = FW.FBL.getElementByClass(testData.watchesPanelNode, "memberLabel userLabel");
        FBTest.click(thisElt); // Click "this" to cause the myObject to show up

    }

    var end = function()
    {

        window.alert("pause");
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


