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
                this.results_queryPointId_tracePoint = {};
            };

            constructor.prototype = {

                addLastChangeTracePoint: function(queryPoint, context, frame, parent, oldValue, newValue){

                    var tracePoint = this.addTracePoint(queryPoint, context, frame);



                    //add .owner trace object
                    var queryObject;
                    for (let i=0 ; i<queryPoint.queryObjects.length ; i++){
                        if (queryPoint.queryObjects[i].ref == ".owner"){
                            queryObject = queryPoint.queryObjects[i];
                            break;
                        }
                    }

                    var parentJSDIValue = QPFBUG.fbs.getJSD().wrapValue(parent);
                    var traceObject = new TraceObject(queryObject, parent, oldValue);

                    var parentJSDIObject = parentJSDIValue.objectValue;
                    if (parentJSDIObject)
                    {
                        traceObject.parentCreatorURL = parentJSDIObject.creatorURL;
                        traceObject.parentCreatorLine = parentJSDIObject.creatorLine;
                        traceObject.parentConstructorURL = parentJSDIObject.constructorURL;
                        traceObject.parentConstructorLine = parentJSDIObject.constructorLine;
                    }

                    tracePoint.addTraceObject(traceObject);
                    trace("LastChange TracePoint", tracePoint);
                    return tracePoint;
                },

                addBreakpointTracePoint: function(queryPoint, context, frame){
                    var tracePoint = this.addTracePoint(queryPoint, context, frame);
                    trace("Breakpoint TracePoint", tracePoint);
                    return tracePoint;
                },

                addTracePoint: function(queryPoint, context, frame)
                {
                    var queryPointId = queryPoint.id;
                    if (!this.tracePoints[queryPointId]){
                        this.tracePoints[queryPointId] = [];
                    }

                    var stackTraceXB = QPFBUG.FBL.getCorrectedStackTrace(frame, context);
                    var traceFrame = new TraceFrame(stackTraceXB, this.getTraceScope(frame.scope));
                    var tracePoint = new TracePoint(++this.nextTracePointId, queryPoint, traceFrame);

                    for (let i=0 ; i<queryPoint.queryObjects.length ; i++)
                    {
                        var queryObject = queryPoint.queryObjects[i];

                        //todo find the right frame based on queryObject.frameNo
                        var valueRef = queryObject.ref;

                        var propertyName = queryObject.propertyName;
                        var parentRef = queryObject.parentRef;

                        var parent = evalInFrame(frame, parentRef);

                        if (!parent)
                            continue;

                        //wrapValue returns the jsd wrapper
                        var parentJSDIValue = QPFBUG.fbs.getJSD().wrapValue(parent);
                        // This one for is a wrapper for security reasons
                        // specially when this object is going to be used
                        // by other modules/extenstions
                        // var xpSafeWrappedValue = XPCSafeJSObjectWrapper(jsValue);

                        // Gecko2 (firefox 4)
                        // var parentId = Object.getProperty(object, "__QPFBUG_ID");
                        var traceObject = new TraceObject(queryObject, parent, parent[propertyName])

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
                },

                getLastTracePointByQueryPoint: function(queryPoint)
                {
                    var points = this.tracePoints[queryPoint.id];
                    FBTrace.sysout("getLastTracePointByQueryPoint "+points, {queryPoint: queryPoint, tracePoints: this.tracePoints});
                    if (points && points.length)
                        return points[points.length - 1];
                },

                getTraceScope: function (scope)
                {
                    if (!scope)
                        return null;

                    var traceScope;
                    var parentScope, jsClassName, variables, values;

                    var unWrapped;
                    parentTraceScope = this.getTraceScope(scope.jsParent);
                    jsClassName = scope.jsClassName;
                    unWrapped  = unwrapIValueObject(scope);
                    variables = [];
                    values = [];
                    for (var prop in unWrapped){
                        variables.push(prop);
                        if (unWrapped[prop])
                            values.push(unWrapped[prop].toSource());
                        else
                            values.push(null);
                    }
                    traceScope = new TraceScope(parentTraceScope, jsClassName, variables, values);

                    return traceScope;
                },

            };

            return constructor;
        }();

}}

};