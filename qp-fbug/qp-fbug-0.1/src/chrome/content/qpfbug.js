//This script is executed once per firefox window when the
// qpfbug add-on is loaded.
FBL.ns(function() { with (FBL)
{
    with(QPFBUG.Classes){
        // it keeps qpfbug data for this window
        Firebug.qpfbug = {};

        QPFBUG.windows = [];
        QPFBUG.windows.push(window);

        manager = Manager.getInstance();
        
        reproducer = Reproducer.getInstance();
        
        jsdEventHandler = JSDEventHandler.getInstance(fbs);

        // A new Module event handler is created for every new firefox window
        moduleEventHandler = new ModuleEventHandler(window);
        Firebug.registerModule(moduleEventHandler);
        Firebug.qpfbug.moduleEventHandler = moduleEventHandler; 
    
        // A new UI event handler is created for every new firefox window
        uiEventHandler = new UIEventHandler(window);
        Firebug.qpfbug.uiEventHandler = uiEventHandler; 
    
        // It is not part of functionality, just to make 
        // debugging this code possible.
        var doubleDebugger = new DoubleDebugger(window);
        // should be called after jsdEventHandler getInstance to wrap fbs changes.
        doubleDebugger.enableDoubleDebugger();
    }
}});



