var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //------------------------------- TracePoint ----------------------------------
    // trace point is kept in debug model.
    owner.TracePoint =
        function(){
            var constructor = function(id, queryPoint, traceFrame){
                this.id = id;
                this.queryPoint = queryPoint;
                this.traceFrame = traceFrame;
                this.traceObjects = [];
            };

            constructor.prototype = {
                addTraceObject: function(traceObject){
                    this.traceObjects.push(traceObject);
                },

                getTraceObject: function(frameNo, ref){
                    for (let i=0; i<this.traceObjects.length ; i++)
                    {
                        if (this.traceObjects[i].queryObject.frameNo == frameNo &&
                            this.traceObjects[i].queryObject.ref == ref)
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
                    return DebugModel.queryTypes[this.queryPoint.queryType];
                },

                toString: function()
                {
                    return "["+this.getQueryType()+" TracePoint]";
                }
            };

            return constructor;
        }();
}}

};