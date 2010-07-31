var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

    //--------------------------------- DebugSession --------------------------------
    owner.DebugSession = function(id){
        this.id = id;
        this.reproductions = [];
        this.debugModel = new DebugModel();
    }

    owner.DebugSession.prototype = {
        getLastTraceObjectLog: function(pointRef, frameNo, objRef)
        {
            var reproductions = this.reproductions;
            if (reproductions.length > 1)
                return reproductions[reproductions.length - 2].executionLog.getTraceObjectLog(pointRef, frameNo, objRef);
            return null;
        }

    }

}}

};