var EXPORTED_SYMBOLS = ["QPFBUG"];

QPFBUG = {};

QPFBUG.Classes = {};

QPFBUG.DBG = true;

//do not include these classes: TraceUtils, Lang, JSDEventHandler, HaltObject, DebugService;
QPFBUG.DBG_Filter = ["Manager", "ModuleEventHandler", "UIEventHandler", // "DebugService", "ExecutionMonitor",
                     "DebugModel", "Trace", "DebugSession", "Reproduction", "Reproducer", "UIUtils"];


