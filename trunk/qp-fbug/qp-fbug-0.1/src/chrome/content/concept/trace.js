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
                this.nextTracepointId = 0;
                this.tracepoints = {}; //<int querypointId, [] tracepoints>
                this.querypointId_tracepoint = {};
                this.results_querypointId_tracepoint = {};
            };

            constructor.prototype = {

                addLastChangeTracepoint: function(querypoint, context, frame, parent, oldValue, newValue){

                    var tracepoint = this.addTracepoint(querypoint, context, frame);



                    //add .owner trace object
                    var queryObject;
                    for (var i=0 ; i<querypoint.queryObjects.length ; i++){
                        if (querypoint.queryObjects[i].ref == ".owner"){
                            queryObject = querypoint.queryObjects[i];
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

                    tracepoint.addTraceObject(traceObject);
                    trace("LastChange Tracepoint", tracepoint);
                    return tracepoint;
                },

                addBreakpointTracepoint: function(querypoint, context, frame){
                    var tracepoint = this.addTracepoint(querypoint, context, frame);
                    trace("Breakpoint Tracepoint", tracepoint);
                    return tracepoint;
                },

                addTracepoint: function(querypoint, context, frame)
                {
                    var querypointId = querypoint.id;
                    if (!this.tracepoints[querypointId]){
                        this.tracepoints[querypointId] = [];
                    }

                    var stackTraceXB = QPFBUG.FBL.getCorrectedStackTrace(frame, context);
                    var traceFrame = new TraceFrame(stackTraceXB, this.getTraceScope(frame.scope));
                    var tracepoint = new Tracepoint(++this.nextTracepointId, querypoint, traceFrame);

                    for (var i=0 ; i<querypoint.queryObjects.length ; i++)
                    {
                        var queryObject = querypoint.queryObjects[i];

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

                        tracepoint.addTraceObject(traceObject);

                    }

                    this.tracepoints[querypointId].push(tracepoint);
                    return tracepoint;
                },

                assignTracepoint: function(querypoint, tracepoint)
                {
                    this.querypointId_tracepoint[querypoint.id] = tracepoint;
                },

                getTraceObject: function(pointRef, frameNo, objectRef)
                {
                    var tracepoint = this.querypointId_tracepoint[pointRef.id];
                    if (tracepoint)
                        return tracepoint.getTraceObject(frameNo, objectRef);
                    return null;
                },

                getLastTracepointByQuerypoint: function(querypoint)
                {
                    var points = this.tracepoints[querypoint.id];
                    trace("getLastTracepointByQuerypoint "+points, {querypoint: querypoint, tracepoints: this.tracepoints});
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
                    variableValues = {};
                    for (var prop in unWrapped){
                        if (unWrapped[prop])
                            variableValues[prop] = unWrapped[prop].toSource();
                        else
                            variableValues[prop] = unWrapped[prop];
                    }
                    traceScope = new TraceScope(parentTraceScope, jsClassName, variableValues);

                    return traceScope;
                },

            };

            return constructor;
        }();

}}

};