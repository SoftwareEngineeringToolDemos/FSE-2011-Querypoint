// This script should be loaded into QPFBUG.Classes object

with (FBL) {
with (QPFBUG){
with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- Manager --------------------------------

owner.Manager = function(){

            var constructor = function(){
               this.dataStore = new DataStore();
            }

            constructor.prototype =
            {
               //events
                initContext: function(){
                    var debugSession;
                    var reproduction;

                    var tabBrowser = $("content");
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

                },

                loadedContext: function(){

                }
             }
             return constructor;
         }();

//--------------------------------- DebugSession --------------------------------
owner.DebugSession = function(id){
   this.id = id;
}

owner.DebugSession.prototype = {

}

//--------------------------------- Reproduction --------------------------------
owner.Reproduction = function(id){
   this.id = id;
}

owner.Reproduction.prototype = {

}

}}}}
