var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{
//------------------------------- FBUGModule ----------------------------------
// An instance of this class is built for every new Firforx window like Firebug
with (QPFBUG){
with (QPFBUG.Lang){
with (QPFBUG.Classes){

    var owner = QPFBUG.Classes;

    owner.ModuleEventHandler = function(){

        var constructor = function(win){

            var module = win.FBL.extend(win.Firebug.Module,  //TODO change it to activeModule
            {
//                stateMachine : new StateMachine
//                    (
//                        ["not-initialized", "initialized"],
//                        "not-initialized",
//                        [
//                            ["initialize", "not-initialized", "initialized"]
//                        ]
//                    ),

                initialize: function(){

                },

                initializeUI: function(){
                    this.win.Firebug.qpfbug.uiEventHandler.init();
                },

                initContext: function(context, persistedState)
                {
                    context.qpfbug = {};
                    context.qpfbug.firebugWindow = this.win;
                    manager.initContext(context, persistedState);
                },

                loadedContext: function(context)
                {
                    manager.loadedContext(context);
                }
            });
            module.win = win;
            return module;
        };
        return constructor;
    }();
}}}

};