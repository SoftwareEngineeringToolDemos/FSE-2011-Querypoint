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
                this.traceObjects = [];
            };

            constructor.prototype = {
                addTraceObject: function(traceObject){
                    this.traceObjects.push(traceObject);
                },

                getTraceObject: function(frameNo, ref){
                    for (var i=0; i<this.traceObjects.length ; i++)
                    {
                        if (this.traceObjects[i].queryData.frameNo == frameNo &&
                            this.traceObjects[i].queryData.expr == ref)
                            return this.traceObjects[i];
                    }
                    return null;
                },

                getTraceObjects: function()
                {
                    return this.traceObjects;
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