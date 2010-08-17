var EXPORTED_SYMBOLS = ["QPFBUG"];

QPFBUG = {};

QPFBUG.Classes = {};

QPFBUG.contexts = {}; // a map(context.uid, context)

QPFBUG.DBG = true;

//do not include these classes: TraceUtils, Lang, JSDEventHandler, HaltObject, DebugService;
QPFBUG.DBG_Filter = ["Manager", "ModuleEventHandler", "UIEventHandler",// "DebugService",
                     "DebugModel", "Trace", "DebugSession", "Reproduction", "Reproducer", "UIUtils"];


