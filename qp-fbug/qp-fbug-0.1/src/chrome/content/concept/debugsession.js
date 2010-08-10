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
        this.nextReproductionId = 0;
        this.debugModel = new DebugModel();
    }

    owner.DebugSession.prototype = {

        newReproduction : function(){
            var id = this.nextReproductionId++;
            var reproduction = new Reproduction(id, this);
            this.reproductions.push(reproduction);
            return reproduction;
        },

        getReproduction : function(id){
            if (!id)
                return this.newReproduction();
            for (i=0 ; i < this.reproductions.length ; i++)
            {
                if (this.reproductions[i].id == id)
                {
                    return this.reproductions[i];
                }
            }
            return null;
        },


        getLastTraceObject: function(pointRef, frameNo, objRef)
        {
            var reproductions = this.reproductions;
            if (reproductions.length > 1)
                return reproductions[reproductions.length - 2].trace.getTraceObject(pointRef, frameNo, objRef);
            return null;
        },

        getNewestTrace: function()
        {
            var reproductions = this.reproductions;
        	if (reproductions.length > 1) // What is reproductions[0]?
        		return reproductions[reproductions.length - 2].trace; 
        },

    }

}}

};