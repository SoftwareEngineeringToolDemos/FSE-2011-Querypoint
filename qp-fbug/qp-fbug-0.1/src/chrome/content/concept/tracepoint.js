var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //------------------------------- Tracepoint ----------------------------------
    // trace point is kept in debug model.
    __owner.Tracepoint =
        function(){
            var constructor = function(id, eventId, index, querypoint, traceFrame, oldValue, newValue){
                this.id = id;
                this.eventId = eventId;
                this.index = index;
                this.querypoint = querypoint;
                this.traceFrame = traceFrame;
                this.oldValue = oldValue;
                this.newValue = newValue;
                this.traceDataList = [];
                this.traceWatches = {};
            };

            constructor.prototype = {
                addTraceData: function(traceData){
                    this.traceDataList.push(traceData);
                },

                addTraceWatch: function(watchExpr, value){
                    this.traceWatches[watchExpr] = value;
                },

                getTraceData: function(frameNo, expr){
                    for (var i=0; i<this.traceDataList.length ; i++)
                    {
                        if (this.traceDataList[i].queryExpr.frameNo == frameNo &&
                            this.traceDataList[i].queryExpr.expr == expr)
                            return this.traceDataList[i];
                    }
                    return null;
                },

                getTraceDataList: function()
                {
                    return this.traceDataList;
                },

                getStackFrames: function()
                {
                    return this.traceFrame.getFrames();
                },

                getQueryType: function()
                {
                    return DebugModel.queryTypes[this.querypoint.queryType];
                },

                toString: function()
                {
                    return "["+this.getQueryType()+" Tracepoint]";
                }
            };

            return constructor;
        }();
}}

};