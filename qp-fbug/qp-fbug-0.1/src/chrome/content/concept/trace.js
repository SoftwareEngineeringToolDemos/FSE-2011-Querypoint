var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //--------------------------------- Trace --------------------------------
    owner.Trace =

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

                    for (let i=0 ; i<queryPoint.queryObjects.length ; i++)
                    {
                        var queryObject = queryPoint.queryObjects[i];
                        var result;
                        if (queryObject.ref == ".owner")
                        {

                            // add it later
                        }else
                        {
                            //todo find the right frame based on queryObject.frameNo
                            var valueRef = queryObject.ref;

                            var propertyName = queryObject.propertyName;
                            var parentRef = queryObject.parentRef;

                            //parent
                            result = {};
                            frame.eval(parentRef, "", 1, result)
                            var parentJSDIValue = result.value;
                            var parentJSValue = parentJSDIValue.getWrappedValue();
                            // This one for is a wrapper for security reasons
                            // specially when this object is going to be used
                            // by other modules/extenstions
                            // var xpSafeWrappedValue = XPCSafeJSObjectWrapper(jsValue);

                            var traceObject = new TraceObject(queryObject, parentJSValue, parentJSValue[propertyName])

                            var parentJSDIObject = parentJSDIValue.objectValue;
                            if (parentJSDIObject)
                            {
                                traceObject.parentCreatorURL = parentJSDIObject.creatorURL;
                                traceObject.parentCreatorLine = parentJSDIObject.creatorLine;
                                traceObject.parentConstructorURL = parentJSDIObject.constructorURL;
                                traceObject.parentConstructorLine = parentJSDIObject.constructorLine;
                            }

                            tracePoint.addTraceObject(traceObject);
                        }

                    }

                    this.tracePoints[queryPointId].push(tracePoint);
                    return tracePoint;
                },

                assignTracePoint: function(queryPoint, tracePoint)
                {
                    this.queryPointId_tracePoint[queryPoint.id] = tracePoint;
                },

                getTraceObject: function(pointRef, frameNo, objectRef)
                {
                    var tracePoint = this.queryPointId_tracePoint[pointRef.id];
                    if (tracePoint)
                        return tracePoint.getTraceObject(frameNo, objectRef);
                    return null;
                }

            };

            return constructor;
        }();

}}

};