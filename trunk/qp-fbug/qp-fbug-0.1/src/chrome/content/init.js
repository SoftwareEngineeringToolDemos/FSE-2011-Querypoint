//This script is executed once per firefox window when the
// qpfbug add-on is loaded.
FBL.ns(function() { with (FBL)
{
    with(QPFBUG.Classes){
        // it keeps qpfbug data for this window
        Firebug.qpfbug = {};

        QPFBUG.windows.push(window);

        var manager = Manager.getInstance();

        var reproducer = Reproducer.getInstance();

        var jsdEventHandler = JSDEventHandler.getInstance();

        // A new Module event handler is created for every new firefox window
        Firebug.registerModule(ModuleEventHandler.getInstance(window));

        // A new UI event handler is created for every new firefox window
//        var uiEventHandler = new UIEventHandler(window);
//        Firebug.qpfbug.uiEventHandler = uiEventHandler;

        // It is not part of functionality, just to make
        // debugging this code possible.
//        var doubleDebugger = new DoubleDebugger(window);
        // should be called after jsdEventHandler getInstance to wrap fbs changes.
//        doubleDebugger.enableDoubleDebugging();
    }
}});



