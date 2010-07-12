// This script should be loaded into QPFBUG.Classes object

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- DebugSession --------------------------------
owner.DebugSession = function(id){
   this.id = id;
   this.debugModel = new DebugModel();
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
