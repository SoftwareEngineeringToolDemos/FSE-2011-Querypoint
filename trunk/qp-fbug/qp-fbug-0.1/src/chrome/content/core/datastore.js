// This script should be loaded into QPFBUG.Classes object

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- DataStore --------------------------------

owner.DataStore = function(){

        var constructor = function(){
           this.nextDebugSessionId = 0;
           this.nextReproductionId = 0;
           this.debugSessions = [];
           this.reproductions = [];
        };


        constructor.prototype =
        {
           newDebugSession : function(){
               var id = this.nextDebugSessionId++;
               var debugSession = new DebugSession(id);
               this.debugSessions.push(debugSession);
               return debugSession;
           },

           getDebugSession : function(id){
               for (i=0 ; i < this.debugSessions.length ; i++)
               {
                   if (this.debugSessions[i].id == id)
                   {
                       return this.debugSessions[i];
                   }
               }
               return null;
           },

           getDebugSessionForReproduction : function(reproductionId){
               var reproduction = this.getReproduction(reproductionId);
               return reproduction.getDebugSession();
           },

           newReproduction : function(debugSession){
               var id = this.nextReproductionId++;
               var reproduction = new Reproduction(id, debugSession);
               this.reproductions.push(reproduction);
               return reproduction;
           },

           getReproduction : function(id){
               for (i=0 ; i < this.reproductions.length ; i++)
               {
                   if (this.reproductions[i].id == id)
                   {
                       return this.reproductions[i];
                   }
               }
               return null;
           }
        };
        return constructor;
    }();
}}
