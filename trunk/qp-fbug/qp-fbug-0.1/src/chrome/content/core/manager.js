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
               newContext: function(){
                  var tabBrowser = $("content");
                  var selectedTab = tabBrowser.selectedTab;

                  if (selectedTab.hasAttribute("debugSessionId"))
                  {
                      Firebug.Console.log(selectedTab.getAttribute("debugSessionId")+" ");
                      Firebug.Console.log(selectedTab.getAttribute("reproductionId")+" ");
                  }else{
                      var debugSession = this.dataStore.newDebugSession();
                      if (FBTrace.DBG_QPFBUG)
                            FBTrace.sysout("New debug session was created." , debugSession);
                  }

                  //var debugSession = QPFBUG.qpfbugState.getDebugSession(debugSessionId);
                  // analyze debug model
                  // set breakpoint as javascripts are loaded
                  // store points
                  // find the right one.

                  object = context.window;
                  if (object.wrappedJSObject)
                           object = object.wrappedJSObject;

                   if (FBTrace.DBG_QPFBUG)
                       FBTrace.sysout("... QPFBUG initContext()." , context);
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
