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

            this.debugModel = new DebugModel();

            // It is supposed that there is only one current reproduction.
            // In the future it may support more than on running reproduction at the same
            // time for faster data collection.
            this.reproduction = this.nextReproduction();



        }

        constructor.prototype = {

            nextReproduction : function(){
                //todo end the current reproduction

                var id = this.nextReproductionId++;
                var reproduction = new Reproduction(id, this, this.reproduction);
                this.reproductions[id]= reproduction;

                this.previousReproduction = this.reproduction;
                this.reproduction = reproduction;
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
                if (this.reproduction.previousReproduction)
                    return this.reproduction.previousReproduction.trace.getTraceData(pointRef, frameNo, objRef);
                return null;
            },

            getNewestTrace: function()
            {
                if (this.reproduction)
                    return this.reproduction.trace;
                return null;
            },

            //getTracepoints
            getTracepoints: function(reproductionId)
            {
                var tps = [];
                var trace = this.reproductions[reproductionId].trace;
                Lang.log("getTracepoints "+trace, trace);
                if (trace)
                {
                    var qps = this.debugModel.querypoints;
                    Lang.log("getTracepoints qps "+ this.debugModel.querypointsSize, qps);
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
                return this.debugModel.enabledQuerypointsSize;
            },

            needsAnotherReproduction: function(){
                //todo numberOfQuerypoints is the total number of querypoints. It is only used for recognizing a new querypoint. It should be changed.
                if (this.reproduction.numberOfQuerypoints == this.reproduction.previousReproduction.numberOfQuerypoints) //if there is no new querypoint
                    return false;
                if (this.getNumberOfQuerypoints() === this.reproduction.trace.assignedTracepointsSize)// todo
                    return false;


//                if (this.getNumberOfQuerypoints() > this.reproduction.trace.assignedTracepointsSize){
//                    if (this.reproduction.previousReproduction) //could we find any new tracepoint in the last two reproductions
//                            if (this.reproduction.previousReproduction.previousReproduction)
//                                if (this.reproduction.trace.assignedTracepointsSize == this.reproduction.previousReproduction.previousReproduction.trace.assignedTracepointsSize)
//                                     return false;

                return true;
            },

            moreQuerypointsToFind: function(){
                return (this.debugModel.enabledQuerypointsSize > this.reproduction.trace.assignedTracepointsSize);
            },

            moreReproductionPointsToFind: function(){
                //todo change it to enabled breeakpoint querypoints . Currently all breakpoint querypoints are enabled so it doesn't cause any problem.
                return (this.debugModel.breakpoint_querypointsSize > this.reproduction.trace.assignedBreakpointTracepointsSize);
            },

        }

        return constructor;

    }();

}}

};