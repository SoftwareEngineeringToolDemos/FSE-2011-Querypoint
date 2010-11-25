//This script is executed once per firefox window when the
// qpfbug add-on is loaded.
FBL.ns(function() { with (FBL)
{
    with(QPFBUG.Classes){

        if (QPFBUG.DBG){
            LogUtils.logClassesFunctionCalls(QPFBUG.DBG_LIST);
            FBTrace.DBG_QUERYPOINT = true;
        }

        //store firebug classes

        //initializes JSDEventHandler
        JSDEventHandler.getInstance();

        // it keeps qpfbug data for this window
        Firebug.qpfbug = {};

        // A new Module event handler is created for every new firefox window
        Firebug.registerModule(ModuleEventHandler.getInstance(window));

        QPFBUG.Conf.DATA_COLLECTION_DEPTH = 2;

    }
}});



