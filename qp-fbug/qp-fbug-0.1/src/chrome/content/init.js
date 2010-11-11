//This script is executed once per firefox window when the
// qpfbug add-on is loaded.
FBL.ns(function() { with (FBL)
{
    with(QPFBUG.Classes){

        if (QPFBUG.DBG)
            TraceUtils.traceClassesFunctionCalls(QPFBUG.DBG_Filter);

        //store firebug classes

        //initializes JSDEventHandler
        JSDEventHandler.getInstance();

        // it keeps qpfbug data for this window
        Firebug.qpfbug = {};

        // A new Module event handler is created for every new firefox window
        Firebug.registerModule(ModuleEventHandler.getInstance(window));

        FBTrace.DBG_QUERYPOINT = true;

    }
}});



