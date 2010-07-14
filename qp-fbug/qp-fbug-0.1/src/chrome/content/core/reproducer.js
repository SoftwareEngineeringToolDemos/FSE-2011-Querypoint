var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

owner.Reproducer = function(){

        var constructor = function(){

        };

        constructor.prototype =
        {
            init : function()
            {
                //added code for FBTest
                var testListURI="C:\\salmir\\work\\epfl\\projects\\43_querypoint-debugging\\trunk\\qp-fbug\\qp-fbug-0.1\\test\\testList.html";
                var args = {
                    firebugWindow: window,
                    testListURI: testListURI
                };
                window.arguments[0] = args;

                var FBTest = FBTestApp.FBTest = {};
                FBTestApp.TestConsole =
                {
                   initialize : function(){},
                   shutdown : function(){},
                };
            },

            reproduce : function (debugSessionId, reproductionId)
            {

            //----- first phase
            // just loading the page

                var url = "file:///C:/salmir/work/epfl/projects/43_querypoint-debugging/trunk/qp-fbug/qp-fbug-0.1/test/test.html";

                var tabbrowser = getBrowser();
               // Open new tab and mark as 'test' so it can be closed automatically.
                var newTab = tabbrowser.addTab(url);
                newTab.setAttribute("firebug", "test");
                newTab.setAttribute("debugSessionId", debugSessionId);
                newTab.setAttribute("reproductionId", reproductionId);
                //A tab is like a process in java version. For the moment we only support one tab
                newTab.setAttribute("tabId", "");

            //----- second phase
            //----- the start of the second phase: after the next line the context will change

                tabbrowser.selectedTab = newTab;



                // Wait till the new window is loaded.
                var browser = tabbrowser.getBrowserForTab(newTab);

               //look at FBTestFirebug.openNewTab(url, callback)

            // Open Firebug UI and realod the page.
            //      FBTestFirebug.pressToggleFirebug(true);

            //     FBTestFirebug.selectPanel("dom");
            //      FBTestFirebug.openFirebug();
            //      var clickTarget = FW.FBL.getElementByClass(logRow, "spyTitleCol", "spyCol");
            //      FBTest.click(win.document.getElementById("testButton"));

            //    FBTest.testDone();

                Firebug.Console.log("The end of reproduction " + reproductionId + ".");
            }

        };

        return constructor;
    }();
}}

};