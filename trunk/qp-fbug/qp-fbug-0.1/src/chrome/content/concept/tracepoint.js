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
                this.traceDatas = [];
            };

            constructor.prototype = {
                addTraceData: function(traceData){
                    this.traceDatas.push(traceData);
                },

                getTraceData: function(frameNo, ref){
                    for (var i=0; i<this.traceDatas.length ; i++)
                    {
                        if (this.traceDatas[i].queryData.frameNo == frameNo &&
                            this.traceDatas[i].queryData.expr == ref)
                            return this.traceDatas[i];
                    }
                    return null;
                },

                getTraceDatas: function()
                {
                    return this.traceDatas;
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