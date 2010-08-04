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

//qpfbug init
loadScript("resource://qpfbug/basics.js");

QPFBUG.loadScript = loadScript; 

//--------------------- all following modules will be loaded in QPFBUG

//from firebug
loadScript("resource://firebug/firebug-service.js", QPFBUG);
loadScript("resource://firebug/firebug-trace-service.js", QPFBUG);

// other scripts
loadScript("resource://qpfbug/util/lang.js");
loadScript("resource://qpfbug/util/statemachine.js");
loadScript("resource://qpfbug/util/doubledebugger.js");
loadScript("resource://qpfbug/util/timer.js");
loadScript("resource://qpfbug/concept/debugmodel.js");
loadScript("resource://qpfbug/concept/executionlog.js");
loadScript("resource://qpfbug/concept/debugsession.js");
loadScript("resource://qpfbug/concept/reproduction.js");
loadScript("resource://qpfbug/core/datastore.js");
loadScript("resource://qpfbug/core/manager.js");
loadScript("resource://qpfbug/core/uieventhandler.js");
loadScript("resource://qpfbug/core/reproducer.js");
loadScript("resource://qpfbug/core/moduleeventhandler.js");
loadScript("resource://qpfbug/di/jsdeventhandler.js");
loadScript("resource://qpfbug/di/eventrequest.js");
loadScript("resource://qpfbug/di/debugservice.js");
loadScript("resource://qpfbug/di/executionmonitor.js");
loadScript("resource://qpfbug/parser/jsparser.js");
loadScript("resource://qpfbug/util/scriptanalyzer.js");

