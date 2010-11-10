var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

    //--------------------------------- DebugSession --------------------------------
    __owner.DebugSession = function(){

        var constructor = function(id){
            this.id = id;

            this.reproductions = {};

            this.nextReproductionId = 0;

            // It is supposed that there is only one current reproduction.
            // In the future it may support more than on running reproduction at the same
            // time for faster data collection.
            this.previousReproduction = null;
            this.currentReproduction = this.nextReproduction();


            this.debugModel = new DebugModel();

        }

        constructor.prototype = {

            nextReproduction : function(){
                //todo end the current reproduction

                var id = this.nextReproductionId++;
                var reproduction = new Reproduction(id, this);
                this.reproductions[id]= reproduction;

                this.previousReproduction = this.currentReproduction;
                this.currentReproduction = reproduction;
                // call produce
                return reproduction;
            },

            getReproduction : function(id){
                if (!id)
                    return null;
                return this.reproductions[id];
            },

            getLastTraceData: function(pointRef, frameNo, objRef)
            {
                if (this.previousReproduction)
                    return this.previousReproduction.trace.getTraceData(pointRef, frameNo, objRef);
                return null;
            },

            getNewestTrace: function()
            {
                if (this.currentReproduction)
                    return this.currentReproduction.trace;
                return null;
            },

            //getTracepoints
            getTracepoints: function(reproductionId)
            {
                var tps = [];
                var trace = this.reproductions[reproductionId].trace;
                Lang.trace("getTracepoints "+trace, trace);
                if (trace)
                {
                    var qps = this.debugModel.querypoints;
                    Lang.trace("getTracepoints qps "+ this.debugModel.querypointsSize, qps);
                    for (var i in qps)
                    {
                        var tp = trace.getAssignedTracepointByQuerypoint(qps[i]);
                        if (tp)
                            tps.push(tp);
                    }
                    return tps;
                }
            },

            getNumberOfQuerypoints: function(){
                return this.debugModel.querypointsSize;
            },

            moreQuerypointsToFind: function(){
               return (this.getNumberOfQuerypoints() > this.currentReproduction.trace.assignedTracepointsSize);
            },

        }

        return constructor;

    }();

}}

};