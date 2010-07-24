var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

    var owner = QPFBUG.Classes;

    //--------------------------------- ExecutionLog --------------------------------
    owner.ExecutionLog =

        function(){

            var constructor = function(){
                this.nextTracePointLogId = 0;
                this.tracePointLogs = {}; //<int tracePointId, [] tracePointLogs>
                this.tracePointId_tracePointLog = {};
            };

            constructor.prototype = {
                addTracePointLog: function(tracePoint, frame)
                {
                    var tracePointId = tracePoint.id;
                    if (!this.tracePointLogs[tracePointId]){
                        this.tracePointLogs[tracePointId] = [];
                    }

                    var stackFrameLog = new StackFrameLog(frame);
                    var tracePointLog = new TracePointLog(++this.nextTracePointLogId, tracePoint, stackFrameLog);

                    for (let i=0 ; i<tracePoint.traceObjects.length ; i++)
                    {
                        var traceObject = tracePoint.traceObjects[i];
                        var result = {};
                        if (traceObject.ref == ".owner")
                        {
                            // add it later
                        }else
                        {
                            //todo find the right frame based on traceObject.frameNo
                            var valueRef = traceObject.ref;
                            var parentRef = valueRef.substring(0, valueRef.lastIndexOf("."));
                            var propertyName = valueRef.substring(valueRef.lastIndexOf(".")+1, valueRef.length);

                            frame.eval(parentRef, "", 1, result)
                            var parentJSDIValue = result.value;

                            var parentJSValue = parentJSDIValue.getWrappedValue();

                            // This one for is a wrapper for security reasons
                            // specially when this object is going to be used
                            // by other modules/extenstions
                            // var xpSafeWrappedValue = XPCSafeJSObjectWrapper(jsValue);

                            var traceObjectLog = new TraceObjectLog(traceObject, parentJSValue, parentJSValue[propertyName])

                            var jsdIObject = parentJSDIValue.objectValue;
                            if (jsdIObject)
                            {
                                traceObjectLog.parentCreatorURL = jsdIObject.creatorURL;
                                traceObjectLog.parentCreatorLine = jsdIObject.creatorLine;
                                traceObjectLog.parentConstructorURL = jsdIObject.constructorURL;
                                traceObjectLog.parentConstructorLine = jsdIObject.constructorLine;
                            }

                            tracePointLog.addTraceObjectLog(traceObjectLog);
                        }

                    }

                    this.tracePointLogs[tracePointId].push(tracePointLog);
                    return tracePointLog;
                },

                assignTracePointLog: function(tracePoint, tracePointLog)
                {
                    this.tracePointId_tracePointLog[tracePoint.id] = tracePointLog;
                },

                getTraceObjectLog: function(pointRef, frameNo, objectRef)
                {
                    var tracePointLog = this.tracePointId_tracePointLog[pointRef.id];
                    if (tracePointLog)
                        return tracePointLog.getTraceObjectLog(frameNo, objectRef);
                    return null;
                }

            };

            return constructor;
        }();


    //------------------------------- TracePointLog ----------------------------------
    // trace point is kept in debug model.
    owner.TracePointLog =
        function(){
            var constructor = function(id, tracePoint, stackFrameLog){
                this.id = id;
                this.tracePoint = tracePoint;
                this.stackFrameLog = stackFrameLog;
                this.traceObjectLogs = [];
            };

            constructor.prototype = {
                addTraceObjectLog: function(traceObjectLog){
                    this.traceObjectLogs.push(traceObjectLog);
                },

                getTraceObjectLog: function(frameNo, ref){
                    for (let i=0; i<this.traceObjectLogs.length ; i++)
                    {
                        if (this.traceObjectLogs[i].traceObject.frameNo == frameNo &&
                            this.traceObjectLogs[i].traceObject.ref == ref)
                            return this.traceObjectLogs[i];
                    }
                    return null;
                }

            };

            return constructor;
        }();

    //------------------------------- TraceObjectLog ----------------------------------
    // This object uniquely specifies an object at a point.

    owner.TraceObjectLog =
        function(){
            var constructor = function(traceObject, parentValue, value){
                this.traceObject = traceObject;
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