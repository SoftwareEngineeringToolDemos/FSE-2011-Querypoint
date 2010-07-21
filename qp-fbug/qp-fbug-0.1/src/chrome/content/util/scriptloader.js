// Although this file may be for every new window
// the js files are loaded only once fore thw whole firefox process.

var tmp = {};

//qpfbug basic
Components.utils.import("resource://qpfbug/util/lang.js");

// firebug
//Components.utils.import("resource://firebug/firebug-service.js", QPFBUG);

//QPFBUG.FBL = FBL;

//adding firebug classes

// other scripts
Components.utils.import("resource://qpfbug/util/statemachine.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/util/timer.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/util/doubledebugger.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/concept/debugmodel.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/concept/debugsession.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/concept/reproduction.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/core/datastore.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/core/debuginterface.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/core/manager.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/core/view.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/core/reproducer.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/core/jsdeventhandler.js", tmp);
tmp.loadModule(QPFBUG);

Components.utils.import("resource://qpfbug/core/qpfbugmodule.js", tmp);
tmp.loadModule(QPFBUG);


delete tmp;