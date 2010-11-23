var EXPORTED_SYMBOLS = ["QPFBUG"];

QPFBUG = {};

QPFBUG.Classes = {};

//Configuration
QPFBUG.Conf = {};

//Debugging

QPFBUG.DBG = false;

//do not include these classes: LogUtils, Lang, JSDEventHandler, HaltObject, DebugService;
QPFBUG.DBG_Filter = ["Manager", "ModuleEventHandler", "UIEventHandler", // "DebugService", "ExecutionMonitor",
                     "DebugModel", "Trace", "DebugSession", "Reproduction", "Reproducer", "UIUtils"];
