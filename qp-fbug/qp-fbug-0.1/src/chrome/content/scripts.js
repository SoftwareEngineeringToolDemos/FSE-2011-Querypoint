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

//following objects are created once per window, one of them is enough
QPFBUG.FBL = FBL;
QPFBUG.Classes.FB = {};

// qpfbug scripts
loadScript("resource://qpfbug/util/lang.js");
loadScript("resource://qpfbug/util/statemachine.js");
loadScript("resource://qpfbug/util/timer.js");
loadScript("resource://qpfbug/util/traceutils.js");

loadScript("resource://qpfbug/concept/debugmodel.js");
loadScript("resource://qpfbug/concept/querypoint.js");
loadScript("resource://qpfbug/concept/queryexpr.js");
loadScript("resource://qpfbug/concept/querydata.js");
loadScript("resource://qpfbug/concept/trace.js");
loadScript("resource://qpfbug/concept/tracepoint.js");
loadScript("resource://qpfbug/concept/tracedata.js");
loadScript("resource://qpfbug/concept/tracescope.js");
loadScript("resource://qpfbug/concept/traceframe.js");
loadScript("resource://qpfbug/concept/debugsession.js");
loadScript("resource://qpfbug/concept/reproduction.js");

loadScript("resource://qpfbug/core/manager.js");
loadScript("resource://qpfbug/core/moduleeventhandler.js");

loadScript("resource://qpfbug/reproducer/reproducer.js");
loadScript("resource://qpfbug/reproducer/localreproducer.js");
loadScript("resource://qpfbug/reproducer/fbtestreproducer.js");
loadScript("resource://qpfbug/reproducer/hardwiredreproducer.js");
loadScript("resource://qpfbug/reproducer/replayreproducer.js");

loadScript("resource://qpfbug/reproducer/record-replay/recordedevent.js");
loadScript("resource://qpfbug/reproducer/record-replay/recorder.js");
loadScript("resource://qpfbug/reproducer/record-replay/recordreplayconstants.js");
loadScript("resource://qpfbug/reproducer/record-replay/replayer.js");
loadScript("resource://qpfbug/reproducer/record-replay/replayutils.js");
loadScript("resource://qpfbug/reproducer/record-replay/userinputhandler.js");

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
loadScript("resource://qpfbug/ui/uiutils.js");

loadScript("resource://qpfbug/dev/doubledebugger.js");

