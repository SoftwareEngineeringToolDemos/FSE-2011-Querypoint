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
                this.traceData = [];
            };

            constructor.prototype = {
                addTraceData: function(traceData){
                    this.traceData.push(traceData);
                },

                getTraceData: function(frameNo, ref){
                    for (var i=0; i<this.traceData.length ; i++)
                    {
                        if (this.traceData[i].queryData.frameNo == frameNo &&
                            this.traceData[i].queryData.expr == ref)
                            return this.traceData[i];
                    }
                    return null;
                },

                getTraceData: function()
                {
                    return this.traceData;
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