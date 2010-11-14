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
            var constructor = function(id, eventId, querypoint, traceFrame, oldValue, newValue){
                this.id = id;
                this.querypoint = querypoint;
                this.traceFrame = traceFrame;
                this.eventId = eventId;
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

                getTraceData: function(frameNo, ref){
                    for (var i=0; i<this.traceDataList.length ; i++)
                    {
                        if (this.traceDataList[i].queryData.frameNo == frameNo &&
                            this.traceDataList[i].queryData.expr == ref)
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