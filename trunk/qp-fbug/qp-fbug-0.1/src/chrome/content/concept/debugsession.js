// This script should be loaded into QPFBUG.Classes object

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- DebugSession --------------------------------
owner.DebugSession = function(id){
   this.id = id;
   this.reproductions = [];
   this.debugModel = new DebugModel();
}

owner.DebugSession.prototype = {
}

}}
