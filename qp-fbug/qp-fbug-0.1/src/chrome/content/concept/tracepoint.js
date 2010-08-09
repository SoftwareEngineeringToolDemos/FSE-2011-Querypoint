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
                }

            };

            return constructor;
        }();

    //------------------------------- TraceObject ----------------------------------
    // This object keeps collected data from an objects.

    owner.TraceObject =
        function(){
            var constructor = function(queryObject, parentValue, value){
                this.queryObject = queryObject;
                this.parentValue = parentValue ;
                this.value = value;
                this.parentCreatorURL = null;
                this.parentCreatorLine = 0;
                this.parentConstructorURL = null;
                this.parentConstructorLine = 0;
            };

            constructor.prototype = {
                // no fuctions
            };

            return constructor;
        }();

    //------------------------------- StackFrameLog ----------------------------------
    // StackFrameLog
    owner.StackFrameLog =
        function(){
            var constructor = function(frame){
                //init
            };

            constructor.prototype = {
                // no fuctions
            };

            return constructor;
        }();

}}

};