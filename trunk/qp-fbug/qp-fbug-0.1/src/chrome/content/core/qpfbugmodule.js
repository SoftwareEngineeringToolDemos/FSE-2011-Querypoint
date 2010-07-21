var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{
//------------------------------- FBUGModule ------------------------------

with (QPFBUG.Lang){
with (QPFBUG.Classes){

    var owner = QPFBUG.Classes;

    owner.QPFBUGModule = function(){

        var constructor = function(win){

            var module = win.FBL.extend(win.Firebug.Module,  //TODO change it to activeModule
            {
                stateMachine : new StateMachine
                    (
                        ["not-initialized", "initialized"],
                        "not-initialized",
                        [
                            ["initialize", "not-initialized", "initialized"]
                        ]
                    ),

                initialize: function(){
                    this.stateMachine.startTransit("initialize");

                    this.manager = new Manager(this.win);
                    this.manager.initialize();

                    this.stateMachine.endTransit();

                    // it is not part of functionality, just to make debugging this code possible
                    var doubleDebugger = new DoubleDebugger(this.win)
                    // should be called after manager.initialize to wrap fbs changes by manager
                    doubleDebugger.enableDoubleDebugger();
                },

                initializeUI: function()
                {
                    this.manager.initializeUI();
                },

                initContext: function(context, persistedState)
                {
                    this.manager.initContext(context, persistedState);
                },

                loadedContext: function(context)
                {
                    this.manager.loadedContext(context);
                }
            });
            module.win = win;
            return module;
        };
        return constructor;
    }();
}}

};