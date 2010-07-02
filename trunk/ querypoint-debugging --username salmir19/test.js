// Test entry point.                
function runTest()
{
    FBTrace.sysout("test1.START");
    FBTestFirebug.openNewTab("file:///C:/salmir/work/epfl/projects/38_qp4firebug/projects/testqp4fb/test.html", function(win)
    {
        // Open Firebug UI and realod the page.
                FBTestFirebug.pressToggleFirebug(true);
        
                FBTestFirebug.selectPanel("dom");
//        FBTestFirebug.openFirebug();
//      var clickTarget = FW.FBL.getElementByClass(logRow, "spyTitleCol", "spyCol");
//      FBTest.click(win.document.getElementById("testButton"));

        for (var i=0 ;  i<10 ; i++ )
        {
//           FBTrace.sysout("i:"+i);
//           FBTest.click(win);
//           FBTest.click(win.document.getElementById("mybody"));
           FBTest.click(win.document.getElementById("mybody"));
        }
//                                 .getElementById("testButton")
        FBTrace.sysout(win.document.getElementById("mybody"));
        FBTrace.sysout(win.myObject.first);
        FBTrace.sysout("test reloading");

//        FBTestFirebug.reload(function(win)
//        {
//            FBTest.ok(FBTestFirebug.isFirebugOpen(), "Firebug UI must be opened now.");
//            FBTestFirebug.testDone("openOnLocalPage.DONE");
//        });
    FBTest.testDone();

    });
}
