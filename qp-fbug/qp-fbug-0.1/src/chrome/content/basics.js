var EXPORTED_SYMBOLS = ["QPFBUG"];

QPFBUG = {};

QPFBUG.Classes = {};

//Configuration
QPFBUG.Conf = {};

//Debugging

QPFBUG.DBG = false;

//do not include these classes: LogUtils, Lang, JSDEventHandler, HaltObject, DebugService, ObjectCreationTracker;
QPFBUG.DBG_LIST = ["Manager", "ModuleEventHandler", "UIEventHandler",
                     "DebugModel", "Trace", "DebugSession", "Reproduction", "Reproducer", "UIUtils"];
