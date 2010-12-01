var EXPORTED_SYMBOLS = ["QPFBUG"];

QPFBUG = {};

QPFBUG.Classes = {};

//Configuration
QPFBUG.Conf = {};


QPFBUG.Conf.DATA_COLLECTION_DEPTH = 2;

//Debugging
QPFBUG.DBG = false;

//do not include these classes: LogUtils, Lang (might cause loops),
//                              JSDEventHandler (too many calls),
//                              HaltObject (due to changes in call stack by
//                                    LogUtils, code in DebugService which locates the right frame breaks) 
QPFBUG.DBG_LIST = ["Manager", "ModuleEventHandler", "UIEventHandler",  "ObjectCreationTracker", "DebugService", //"SteppingDriver",
                     "DebugModel", "Trace", "DebugSession", "Reproduction", "Reproducer", "UIUtils"];
