var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //------------------------------- Tracepoint ----------------------------------
    // trace point is kept in debug model.
    owner.Tracepoint =
        function(){
            var constructor = function(id, querypoint, traceFrame){
                this.id = id;
                this.querypoint = querypoint;
                this.traceFrame = traceFrame;
                this.traceDataList = [];
            };

            constructor.prototype = {
                addTraceData: function(traceData){
                    this.traceDataList.push(traceData);
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