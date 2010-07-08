/* 
 * Author: Salman Mirghasemi
 */

FBL.ns(function() { with (FBL) { 

const Cc = Components.classes;
const Ci = Components.interfaces;
const jsdIStackFrame = Ci.jsdIStackFrame;
FBTrace.DBG_QP4FB = true;
//----------------------------------- Module ----------------------------------

Firebug.QP4FBModel = extend(Firebug.Module,
{
    initializeUI: function()
    {

       this.jsd = Cc["@mozilla.org/js/jsd/debugger-service;1"].getService(Ci.jsdIDebuggerService);
       jsd.flags=0;

//        this.fbs = Cc["@joehewitt.com/firebug;1"].getService().wrappedJSObject;
        var old_onBreakpoint = fbs.onBreakpoint;
        fbs.onBreakpoint = function(frame, type, val){
            FBTrace.sysout("onBreakpoint frame ... ", frame);
            FBTrace.sysout("onBreakpoint type ... ", type);
            FBTrace.sysout("onBreakpoint val ... ", val);
//            Firebug.Console.log("onBreakpoint .... ((()))");
//            var jsdIExecutionHook = Ci.jsdIExecutionHook;
//            var RETURN_CONTINUE = jsdIExecutionHook.RETURN_CONTINUE;
//            return RETURN_CONTINUE;

            return old_onBreakpoint.apply(this,arguments);
        };
        fbs.hookScripts();
//        jsd.breakpointHook = { onExecute: hook(fbs.onBreakpoint, RETURN_CONTINUE) };

     		Firebug.QP4FBGlobals.addLastChangeMenuItem();

            //added code for FBTest
            var testListURI="C:\\salmir\\work\\epfl\\projects\\43_querypoint-debugging\\trunk\\qp-fbug\\qp-fbug-0.1\\test\\testList.html";
            var args = {
                firebugWindow: window,
                testListURI: testListURI
            };
            window.arguments[0] = args;

            var FBTest = FBTestApp.FBTest = {};
            FBTestApp.TestConsole = {};
    },
    initContext: function(context, persistedState)
    {
       object = context.window;
       if (object.wrappedJSObject)
                object = object.wrappedJSObject;
       alert("QueryPoint Debugging! Use it!");
    },
});

//----------------------------------- Rep -----------------------------------
//xxxsalmir we don't have any Rep yet

//var qp4fbRep = domplate(
//{
//    date: (new Date()).toGMTString(),
//
//    myTag:
//        DIV({class: "MyDiv", onclick: "$onClick"},
//            SPAN("OOOOOOOOOOOOOOOOOOO")
//        ),
//
//    onClick: function(event)
//    {
////        var cont = context.window;
//       var x = Firebug.Console;
//        alert("OOOOOOOOOOOOOOOOOO");
//       Firebug.Console.log("QP4FB");
//       Firebug.Console.log(jsd);
//       Firebug.Console.log(x);
//
//    }
//});

//----------------------------------- Panel -----------------------------------
//xxxsalmir we don't have any panel yet
//function QueryPointPanel() {}
//QueryPointPanel.prototype = extend(Firebug.Panel,
//{
//    name: "QP4FB",
//    title: "QueryPoint Debugging",
//
//    initialize: function() {
//      Firebug.Panel.initialize.apply(this, arguments);
//      var panel = this;
//    },
//});

//xxxsalmir we don't have any panel yet
// Firebug.registerPanel(QueryPointPanel);

Firebug.registerModule(Firebug.QP4FBModel);

// QP4FB Globals
Firebug.QP4FBGlobals = {};


//----------------------- Changes getContextMenuItems --------------
// Adds "lastChange" menuItem to popup menu
// There is also another strategy. We could change Firebug.reps
// to change "getContextMenuItems", However, due to a bug we change
// panels.
//
// paramters: window: the global object
// 'this': is not specified

Firebug.QP4FBGlobals.queries = [];

Firebug.QP4FBGlobals.addLastChangeMenuItem = function()
{
      var old_GetContextMenuItems = Firebug.getPanelType("dom").prototype.getContextMenuItems;

      //'this': is one of the dom panels
      var new_GetContextMenuItems = function(sourceLink, target)
      {
            var items = old_GetContextMenuItems.apply(this, arguments);
            var panel = target ? Firebug.getElementPanel(target) : null;
            if (!panel) // the event must be on our chrome not inside the panel
                return items;

            var row = getAncestorByClass(target, "memberRow");
            if (row)
            {
                var rowName;
                // = getRowName(row);
                var labelNode = row.getElementsByClassName("memberLabelCell").item(0);
                rowName = labelNode.textContent;

                var rowObject = this.getRowObject(row);
                var rowValue = this.getRowPropertyValue(row);

                var isWatch = hasClass(row, "watchRow");
                var isStackFrame = rowObject instanceof jsdIStackFrame;

            items.push(
                {label: "Last Change", command: bindFixed(Firebug.QP4FBGlobals.lastChange, this, row)});
            }
            return items;
       };

      // change panels
      Firebug.getPanelType("dom").prototype.getContextMenuItems = new_GetContextMenuItems;
      Firebug.getPanelType("domSide").prototype.getContextMenuItems = new_GetContextMenuItems;
      Firebug.getPanelType("watches").prototype.getContextMenuItems = new_GetContextMenuItems;
}

Firebug.QP4FBGlobals.lastChange = function(row)
{
        if (FBTrace.DBG_QP4FB)
            FBTrace.sysout("lastChange: "+row, row);

        var value = this.getRowPathName(row);
        value = value[1]; //don't want the seperator
        Firebug.Console.log(value);


        //--------------- local functions ----------------------------------
        var getRowValue = function(row)
        {
            var valueNode = row.getElementsByClassName("memberValueCell").item(0);
            return valueNode.firstChild.repObject;
        }

        var getRowOwnerObject = function (row)
        {
            var parentRow = getParentRow(row);
            if (parentRow)
                return getRowValue(parentRow);
        };

        var getParentRow = function(row)
        {
            var level = parseInt(row.getAttribute("level"))-1;
            // If it's top level object the level is now set to -1, is that a problem?
            for (row = row.previousSibling; row; row = row.previousSibling)
            {
                if (parseInt(row.getAttribute("level")) == level)
                    return row;
            }
        };

        var object = getRowOwnerObject(row);


        object = object ? object : this.selection;
        //getRealObject
        object = unwrapObject(object)

        var propertyValue = this.getObjectPropertyValue(object, row.domObject.name);

        Firebug.Console.log(propertyValue);
        Firebug.Console.log(typeof(propertyValue));

        var objectToDebug = value;

        var wrappedJSDValue = jsd.wrapValue(propertyValue);

        // NO good reason for getting js parent only because it works
        wrappedJSDValue = wrappedJSDValue.jsParent;
        propertyValue.newProp = 29;


        Firebug.Console.log(wrappedJSDValue.objectValue);
        Firebug.Console.log(wrappedJSDValue.objectValue.creatorURL);
        Firebug.Console.log(wrappedJSDValue.objectValue.creatorLine);
        Firebug.Console.log(wrappedJSDValue.objectValue.constructorURL);

//		Components.utils.import("resource://qp4fb/concept/tracepoint.js", this);

//        var point = new this.TracePointFactory(wrappedJSDValue.objectValue.creatorURL,
//                                          wrappedJSDValue.objectValue.creatorLine,
//                                          value);
//        Firebug.Console.log("Point : "+ point.toString());


        var sourceFile = this.context.sourceFileMap[wrappedJSDValue.objectValue.creatorURL];
//        var sourceFile = FirebugContext[wrappedJSDValue.objectValue.creatorURL];
//        sourceFile.href = wrappedJSDValue.objectValue.creatorURL;
        Firebug.Debugger.setBreakpoint(sourceFile, wrappedJSDValue.objectValue.creatorLine);
//          fbs.setBreakpoint(//,
//                            wrappedJSDValue.objectValue.creatorLine, null, Firebug.Debugger);


        Firebug.Console.log(this.context.stopped);
        if (this.context.stopped)
        { //get info about bp
          // get breakpoin for url and line no and see if it is active or not.
          Firebug.Console.log("debugFrame");
//          Firebug.Console.log(this.context.debugFrame);
          Firebug.Console.log(this.context.debugFrame.script.fileName);
          Firebug.Console.log(this.context.debugFrame.line);
          Firebug.Console.log(this.context.executingSourceFile.href);
          var bp = fbs.findBreakpoint(this.context.executingSourceFile.href, this.context.debugFrame.line);
          if (bp)
            Firebug.Console.log(bp);
        }

        Firebug.QP4FBGlobals.reproduce();
        Firebug.Console.log("**************");

        // reprdouce

        //
}

Firebug.QP4FBGlobals.reproduce = function ()
{

//    var runTest = function{
    FBTrace.sysout("test1.START");
    var url = "file:///C:/salmir/work/epfl/projects/43_querypoint-debugging/trunk/qp-fbug/qp-fbug-0.1/test/test.html";

    var tabbrowser = getBrowser();
   // Open new tab and mark as 'test' so it can be closed automatically.
    var newTab = tabbrowser.addTab(url);
    newTab.setAttribute("firebug", "test");
    tabbrowser.selectedTab = newTab;



    // Wait till the new window is loaded.
    var browser = tabbrowser.getBrowserForTab(newTab);

//    var callback =
//         FBTestFirebug.openNewTab("file:///C:/salmir/work/epfl/projects/43_querypoint-debugging/trunk/qp-fbug/qp-fbug-0.1/test/test.html", function(win)
//         {
             // Open Firebug UI and realod the page.
//             FBTestFirebug.pressToggleFirebug(true);
//
//             FBTestFirebug.selectPanel("dom");
//
//             for (var i=0 ;  i<10 ; i++ )
//             {
//                FBTest.click(win.document.getElementById("mybody"));
//             }
//             FBTrace.sysout(win.document.getElementById("mybody"));
//             FBTrace.sysout(win.myObject.first);
//             FBTrace.sysout("test reloading");
//             FBTest.testDone();
//         });

//    waitForWindowLoad(browser, callback);


    //{
        // Open Firebug UI and realod the page.
//                FBTestFirebug.pressToggleFirebug(true);

//                FBTestFirebug.selectPanel("dom");
//        FBTestFirebug.openFirebug();
//      var clickTarget = FW.FBL.getElementByClass(logRow, "spyTitleCol", "spyCol");
//      FBTest.click(win.document.getElementById("testButton"));

//        for (var i=0 ;  i<10 ; i++ )
//        {
//           FBTrace.sysout("i:"+i);
//           FBTest.click(win);
//           FBTest.click(win.document.getElementById("mybody"));
//           FBTest.click(win.document.getElementById("mybody"));
//        }
////                                 .getElementById("testButton")
//        FBTrace.sysout(win.document.getElementById("mybody"));
//        FBTrace.sysout(win.myObject.first);
//        FBTrace.sysout("test reloading");

//        FBTestFirebug.reload(function(win)
//        {
//            FBTest.ok(FBTestFirebug.isFirebugOpen(), "Firebug UI must be opened now.");
//            FBTestFirebug.testDone("openOnLocalPage.DONE");
//        });
//    FBTest.testDone();

//    });
//    }
//    runTest();
}

}});



