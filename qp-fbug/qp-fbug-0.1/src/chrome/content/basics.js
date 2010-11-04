var EXPORTED_SYMBOLS = ["QPFBUG"];

QPFBUG = {};

QPFBUG.Classes = {};

//Configuration
QPFBUG.Conf = {};

QPFBUG.Conf.COLLECT_DATA = true;

//Debugging

QPFBUG.DBG = false;

//do not include these classes: TraceUtils, Lang, JSDEventHandler, HaltObject, DebugService;
QPFBUG.DBG_Filter = ["Manager", "ModuleEventHandler", "UIEventHandler", // "DebugService", "ExecutionMonitor",
                     "DebugModel", "Trace", "DebugSession", "Reproduction", "Reproducer", "UIUtils"];
