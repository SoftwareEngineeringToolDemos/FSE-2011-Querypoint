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
        getLastTraceObject: function(pointRef, frameNo, objRef)
        {
            var reproductions = this.reproductions;
            if (reproductions.length > 1)
                return reproductions[reproductions.length - 2].trace.getTraceObject(pointRef, frameNo, objRef);
            return null;
        },

        getNewestTrace: function()
        {
            if (this.reproductions.length > 1) // What is reproductions[0]?
                return this.reproductions[this.reproductions.length - 2].trace;
        },

    }

}}

};