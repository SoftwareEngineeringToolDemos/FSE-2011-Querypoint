// This script should be loaded into QPFBUG.Classes object

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- QpfbugState --------------------------------

owner.QpfbugState = function(){

//            const states = ["not-initialized", "initialized"];
//            const transitions = [
//                    ["initialize", "not-initialized", "not-initialized"]
//                    ];


            var constructor = function(){
//               this.stateMachine = new StateMachine(states, "notstarted", transitions);
               this.nextDebugSessionId = 0;
               this.debugSessions = [];
            }


            constructor.prototype =
            {
               newDebugSession: function(){
                   var id = this.nextDebugSessionId++;
                   var debugSession = new DebugSession(id);
                   this.debugSessions.push(debugSession);
                   return debugSession;
               },

               getDebugSession: function(id){
                   for (i=0 ; i < this.debugSessions.length ; i++)
                   {
                       if (this.debugSessions[i].id == id)
                       {
                           return this.debugSessions[i];
                       }
                   }
                   return null;
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

}}
