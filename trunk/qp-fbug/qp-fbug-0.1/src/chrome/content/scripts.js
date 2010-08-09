// Although this file may be for every new window
// the js files are loaded only once fore thw whole firefox process.

var loadScript = function(path, scope)
{
    if (typeof(QPFBUG) == "undefined") //basics.js
        Components.utils.import(path);
    else{
        if (!scope){
            var tmp = {};
            Components.utils.import(path, tmp);
            tmp.loadModule(QPFBUG);
        }else{
            Components.utils.import(path, scope);
        }
    }
}

//qpfbug basics
loadScript("resource://qpfbug/basics.js");
// to be available as a basic utility function
QPFBUG.loadScript = loadScript; 

//--------------------- all following modules will be loaded in QPFBUG

//from firebug
loadScript("resource://firebug/firebug-service.js", QPFBUG);
loadScript("resource://firebug/firebug-trace-service.js", QPFBUG);
//load lib.js
QPFBUG.FBL = FBL; //FBL is created once per window, one of them is enough

// qpfbug scripts
loadScript("resource://qpfbug/util/lang.js");
loadScript("resource://qpfbug/util/statemachine.js");
loadScript("resource://qpfbug/util/timer.js");

loadScript("resource://qpfbug/concept/debugmodel.js");
loadScript("resource://qpfbug/concept/querypoint.js");
loadScript("resource://qpfbug/concept/queryobjectref.js");
loadScript("resource://qpfbug/concept/queryobject.js");
loadScript("resource://qpfbug/concept/trace.js");
loadScript("resource://qpfbug/concept/tracepoint.js");
loadScript("resource://qpfbug/concept/traceobject.js");
loadScript("resource://qpfbug/concept/stackframelog.js");
loadScript("resource://qpfbug/concept/debugsession.js");
loadScript("resource://qpfbug/concept/reproduction.js");

loadScript("resource://qpfbug/core/datastore.js");
loadScript("resource://qpfbug/core/manager.js");
loadScript("resource://qpfbug/core/reproducer.js");
loadScript("resource://qpfbug/core/moduleeventhandler.js");

loadScript("resource://qpfbug/di/jsdconstants.js");
loadScript("resource://qpfbug/di/jsdeventhandler.js");
loadScript("resource://qpfbug/di/eventrequest.js");
loadScript("resource://qpfbug/di/debugservice.js");
loadScript("resource://qpfbug/di/haltobject.js");
loadScript("resource://qpfbug/di/executionmonitor.js");
loadScript("resource://qpfbug/di/steppingdriver.js");
loadScript("resource://qpfbug/di/scriptanalyzer.js");

loadScript("resource://qpfbug/parser/jsparser.js");

loadScript("resource://qpfbug/ui/uieventhandler.js");

loadScript("resource://qpfbug/dev/doubledebugger.js");

