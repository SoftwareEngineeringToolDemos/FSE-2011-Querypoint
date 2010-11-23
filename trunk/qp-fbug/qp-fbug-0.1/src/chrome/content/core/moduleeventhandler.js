var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{
with (QPFBUG){
with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //------------------------------- ModuleEventHandler ----------------------------------
    // An instance of this class is built for every new Firforx window like Firebug
    __owner.ModuleEventHandler = function(){

        var constructor = function(win){
            extendFromParent(this, win.Firebug.ActivableModule); 
            this.win = win;
//            this.dispatchName = "qpfbugModule";
//            win.Firebug.Debugger.addListener(this);
        };

        constructor.prototype = {

            initialize: function(){
            },

            initializeUI: function(){
                //initialize UIEventHandler for this firefox window
                UIEventHandler.getInstance(this.win).init();
            },

            initContext: function(context, persistedState)
            {
                Manager.getInstance().initContext(this.win, context, persistedState);
            },

            loadedContext: function(context)
            {
                Manager.getInstance().loadedContext(this.win, context);
            },

            // source file is created or changed
            onSourceFileCreated: function(context, sourceFile)
            {
                DebugService.getInstance().onSourceFileCreated(context, sourceFile);
            },

//            //todo change it
//            onStartDebugging: function(context)
//            {
//                log("onStartDebugging tracepoints.show "+context.qpfbug.inQuery);
//                if (context.qpfbug.newResults)
//                {
//                    context.qpfbug.firefoxWindow.Firebug.chrome.selectSupportingPanel(UIUtils.getDebugModel(context), context, true);
//                    delete context.qpfbug.newResults;
//                }
//
//            },


            destroyContext: function(context, persistedState)
            {
                Manager.getInstance().destroyContext(this.win, context);
            }

        };

        constructor.getInstance = function(win){
            if (!win.Firebug.qpfbug.moduleEventHandler)
            {
                var moduleEventHandler = new ModuleEventHandler(win);
                Lang.wrapFunctionsWithTryCatch(moduleEventHandler);
                win.Firebug.qpfbug.moduleEventHandler = moduleEventHandler;
            }
            return win.Firebug.qpfbug.moduleEventHandler;
        };

        return constructor;
    }();

}}}

};