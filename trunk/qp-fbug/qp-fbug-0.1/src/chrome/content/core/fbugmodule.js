// This script should be loaded into QPFBUG object
//------------------------------- FBUGModule ------------------------------
with (FBL) {
with (QPFBUG){
with (QPFBUG.Lang){
with (QPFBUG.Classes){

    var owner = QPFBUG.Classes;

    owner.FBUGModuleFactory = function(){
        var module = extend(Firebug.Module,  //TODO change it to activeModule
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

                QPFBUG.manager = new Manager();

                this.stateMachine.endTransit();
            },

            initializeUI: function()
            {
                manager.init();
            },

            initContext: function(context, persistedState)
            {
                manager.initContext(context, persistedState);
            },

            loadedContext: function(context)
            {
                manager.loadedContext(context);
            }
        });
        return module;
    };
}}}};