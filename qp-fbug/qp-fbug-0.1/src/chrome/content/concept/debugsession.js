var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

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

};