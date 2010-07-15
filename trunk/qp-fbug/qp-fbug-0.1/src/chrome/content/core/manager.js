var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{


//with (FBL) {
with (QPFBUG){
with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- Manager --------------------------------

owner.Manager = function(){

            var constructor = function(win){
               this.win = win;
               this.dataStore = new DataStore();
               this.view = new View(this);
               this.reproducer = new Reproducer();
            };

            constructor.prototype =
            {
                //------------------------------ event handling -----------------------------------------
                initialize : function(){

                    //set jsd flags 0
                    //jsd.flags=0;

                    var old_onBreakpoint = fbs.onBreakpoint;
                    fbs.onBreakpoint = function(frame, type, val){
                        FBTrace.sysout("onBreakpoint frame ... ", frame);
                        FBTrace.sysout("onBreakpoint type ... ", type);
                        FBTrace.sysout("onBreakpoint val ... ", val);

                        return old_onBreakpoint.apply(this,arguments);
                    };
                    fbs.hookScripts();
                    //        jsd.breakpointHook = { onExecute: hook(fbs.onBreakpoint, RETURN_CONTINUE) };

                    //update view

//                    this.reproducer.init();

                },

                initializeUI :function(){
                    this.view.init();
                },
                initContext : function(context){
                    with (this.win){
                        var debugSession;
                        var reproduction;

                        var tabBrowser = FBL.$("content");
                        var selectedTab = tabBrowser.selectedTab;

                        var reproductionId = selectedTab.getAttribute("reproductionId");
                        if (reproductionId)
                        {
                            reproduction = this.dataStore.getReproduction(reproductionId);
                            debugSession = this.dataStore.getDebugSessionForReproduction(reproductionId);
                        }

                        if (!debugSession)
                        {
                            debugSession = this.dataStore.newDebugSession();
                            reproduction = this.dataStore.newReproduction(debugSession.id);
                            if (FBTrace.DBG_QPFBUG)
                                  FBTrace.sysout("New debug session was created." , debugSession);
                        }

                        // analyze debug model
                        var debugModel = debugSession.debugModel;

                        debugModel.tracePoints;

                            //set bps

                        // set breakpoint as javascripts are loaded
                        // store points
                        // find the right one.

                        object = context.window;
                        if (object.wrappedJSObject)
                                 object = object.wrappedJSObject;
                    };

                },

                loadedContext: function(context){

                }

                //------------------------- internal functions -----------------------------



             };
             return constructor;
         }();

}}}

};
