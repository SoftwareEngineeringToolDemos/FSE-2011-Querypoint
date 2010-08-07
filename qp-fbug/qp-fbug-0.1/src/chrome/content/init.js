//This script is executed once per firefox window when the
// qpfbug add-on is loaded.
FBL.ns(function() { with (FBL)
{
    with(QPFBUG.Classes){
        // it keeps qpfbug data for this window
        Firebug.qpfbug = {};

        var manager = Manager.getInstance();

        var reproducer = Reproducer.getInstance();

        var jsdEventHandler = JSDEventHandler.getInstance();

        // A new Module event handler is created for every new firefox window
        Firebug.registerModule(ModuleEventHandler.getInstance(window));
    }
}});



