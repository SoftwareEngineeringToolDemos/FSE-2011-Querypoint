var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{
with (QPFBUG){
with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //------------------------------- ModuleEventHandler ----------------------------------
    // An instance of this class is built for every new Firforx window like Firebug
    owner.ModuleEventHandler = function(){

        var constructor = function(win){

            var module = win.FBL.extend(win.Firebug.Module,  //TODO change it to activeModule
            {
                initialize: function(){

                },

                initializeUI: function(){
                    //initialize UIEventHandler for this firefox window
                    with (this.win){
                        Firebug.qpfbug.uiEventHandler.init();
                    }
                },

                initContext: function(context, persistedState)
                {
                    Manager.getInstance().initContext(this.win, context, persistedState);
                },

                loadedContext: function(context)
                {
                },

                // source file is created or changed
                onSourceFileCreated: function(context, sourceFile)
                {
                    DebugService.getInstance().onSourceFileCreated(context, sourceFile);
                },

                destroyContext: function(context, persistedState)
                {
                    QPFBUG.manager.destroyContext(this.win, context, sourceFile);
                }

            });

            module.win = win;
            return module;
        };

        return constructor;
    }();

}}}

};