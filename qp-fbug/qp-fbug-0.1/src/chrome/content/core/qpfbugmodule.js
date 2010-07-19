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

                    this.win.Firebug.qpfbug = {};

                    this.manager = new Manager(this.win);
                    this.win.Firebug.qpfbug.manager = this.manager;
                    this.manager.initialize();
                    this.stateMachine.endTransit();
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