//--------------------------------- QpfbugState --------------------------------
this.QpfbugStateFactory = function(){

   this.nextDebugSessionId = 0;
   this.debugSessions = [];
}


this.QpfbugStateFactory.prototype =
{
   newDebugSession: function(){
       var id = this.nextDebugSessionId++;
       var debugSession = new this.DebugSessionFactory(id);
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

//--------------------------------- DebugSession --------------------------------
this.DebugSessionFactory = function(id){
   this.id = id;
}

this.DebugSessionFactory.prototype = {

}

//--------------------------------- Reproduction --------------------------------
this.ReproductionFactory = function(id){
   this.id = id;
}

this.ReproductionFactory.prototype = {

}

