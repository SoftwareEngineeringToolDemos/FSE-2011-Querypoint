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
            var constructor = function(id, queryPoint, stackFrameLog){
                this.id = id;
                this.queryPoint = queryPoint;
                this.stackFrameLog = stackFrameLog;
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
                    return this.stackFrameLog.stackTraceXB;
                },

                toString: function()
                {
                    return "["+DebugModel.queryTypes[this.queryPoint.queryType]+" TracePoint]";
                }
            };

            return constructor;
        }();
}}

};