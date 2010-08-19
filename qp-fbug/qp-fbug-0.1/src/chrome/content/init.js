//This script is executed once per firefox window when the
// qpfbug add-on is loaded.
FBL.ns(function() { with (FBL)
{
    with(QPFBUG.Classes){

        if (QPFBUG.DBG)
            TraceUtils.traceClassesFunctionCalls(QPFBUG.DBG_Filter);

        //store firebug classes
        QPFBUG.Classes.FB.SourceBoxPanel = Firebug.SourceBoxPanel; //FBL is created once per window, one of them is enough
        QPFBUG.Classes.FB.SourceBoxDecorator = Firebug.SourceBoxDecorator; //FBL is created once per window, one of them is enough
//        QPFBUG.Classes.FB.WatchPanel = Firebug.SourceBoxDecorator; //FBL is created once per window, one of them is enough

        //initializes JSDEventHandler
        JSDEventHandler.getInstance();

        // it keeps qpfbug data for this window
        Firebug.qpfbug = {};

        // A new Module event handler is created for every new firefox window
        Firebug.registerModule(ModuleEventHandler.getInstance(window));

        Firebug.registerStylesheet("chrome://qpfbug/content/ui/querypoints.css");
        Firebug.registerPreference("querypoints.enableSites", false);
        Firebug.registerPreference("querypoints.reproducer", "local");

        Firebug.registerPanel(SourceViewPanel);

    }
}});



