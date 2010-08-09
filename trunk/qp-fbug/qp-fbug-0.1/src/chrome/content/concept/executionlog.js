var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //--------------------------------- ExecutionLog --------------------------------
    owner.ExecutionLog =

        function(){

            var constructor = function(){
                this.nextTracePointId = 0;
                this.tracePoints = {}; //<int queryPointId, [] tracePoints>
                this.queryPointId_tracePoint = {};
            };

            constructor.prototype = {
                addTracePoint: function(queryPoint, frame)
                {
                    var queryPointId = queryPoint.id;
                    if (!this.tracePoints[queryPointId]){
                        this.tracePoints[queryPointId] = [];
                    }

                    var stackFrameLog = new StackFrameLog(frame);
                    var tracePoint = new TracePoint(++this.nextTracePointId, queryPoint, stackFrameLog);

                    for (let i=0 ; i<queryPoint.traceObjects.length ; i++)
                    {
                        var traceObject = queryPoint.traceObjects[i];
                        var result;
                        if (traceObject.ref == ".owner")
                        {

                            // add it later
                        }else
                        {
                            //todo find the right frame based on traceObject.frameNo
                            var valueRef = traceObject.ref;

                            var propertyName = traceObject.propertyName;
                            var parentRef = traceObject.parentRef;

                            //parent
                            result = {};
                            frame.eval(parentRef, "", 1, result)
                            var parentJSDIValue = result.value;
                            var parentJSValue = parentJSDIValue.getWrappedValue();
                            // This one for is a wrapper for security reasons
                            // specially when this object is going to be used
                            // by other modules/extenstions
                            // var xpSafeWrappedValue = XPCSafeJSObjectWrapper(jsValue);

                            var traceObjectLog = new TraceObjectLog(traceObject, parentJSValue, parentJSValue[propertyName])

                            var parentJSDIObject = parentJSDIValue.objectValue;
                            if (parentJSDIObject)
                            {
                                traceObjectLog.parentCreatorURL = parentJSDIObject.creatorURL;
                                traceObjectLog.parentCreatorLine = parentJSDIObject.creatorLine;
                                traceObjectLog.parentConstructorURL = parentJSDIObject.constructorURL;
                                traceObjectLog.parentConstructorLine = parentJSDIObject.constructorLine;
                            }

                            tracePoint.addTraceObjectLog(traceObjectLog);
                        }

                    }

                    this.tracePoints[queryPointId].push(tracePoint);
                    return tracePoint;
                },

                assignTracePoint: function(queryPoint, tracePoint)
                {
                    this.queryPointId_tracePoint[queryPoint.id] = tracePoint;
                },

                getTraceObjectLog: function(pointRef, frameNo, objectRef)
                {
                    var tracePoint = this.queryPointId_tracePoint[pointRef.id];
                    if (tracePoint)
                        return tracePoint.getTraceObjectLog(frameNo, objectRef);
                    return null;
                }

            };

            return constructor;
        }();


    //------------------------------- TracePoint ----------------------------------
    // trace point is kept in debug model.
    owner.TracePoint =
        function(){
            var constructor = function(id, queryPoint, stackFrameLog){
                this.id = id;
                this.queryPoint = queryPoint;
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
    // This object keeps collected data from an objects.

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