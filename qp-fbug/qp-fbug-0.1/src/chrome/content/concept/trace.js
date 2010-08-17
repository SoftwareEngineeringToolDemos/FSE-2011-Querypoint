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
                    var queryData;
                    for (var i=0 ; i<querypoint.queryDatas.length ; i++){
                        if (querypoint.queryDatas[i].expr == ".owner"){
                            queryData = querypoint.queryDatas[i];
                            break;
                        }
                    }

                    var parentJSDIValue = QPFBUG.fbs.getJSD().wrapValue(parent);
                    var traceData = new TraceData(queryData, parent, oldValue);

                    var parentJSDIObject = parentJSDIValue.objectValue;
                    if (parentJSDIObject)
                    {
                        traceData.parentCreatorURL = parentJSDIObject.creatorURL;
                        traceData.parentCreatorLine = parentJSDIObject.creatorLine;
                        traceData.parentConstructorURL = parentJSDIObject.constructorURL;
                        traceData.parentConstructorLine = parentJSDIObject.constructorLine;
                    }

                    tracepoint.addTraceData(traceData);
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

                    for (var i=0 ; i<querypoint.queryDatas.length ; i++)
                    {
                        var queryData = querypoint.queryDatas[i];

                        //todo find the right frame based on queryData.frameNo
                        var valueRef = queryData.expr;

                        var propertyName = queryData.propertyName;
                        var parentRef = queryData.parentRef;

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
                        var traceData = new TraceData(queryData, parent, parent[propertyName])

                        var parentJSDIObject = parentJSDIValue.objectValue;
                        if (parentJSDIObject)
                        {
                            traceData.parentCreatorURL = parentJSDIObject.creatorURL;
                            traceData.parentCreatorLine = parentJSDIObject.creatorLine;
                            traceData.parentConstructorURL = parentJSDIObject.constructorURL;
                            traceData.parentConstructorLine = parentJSDIObject.constructorLine;
                        }

                        tracepoint.addTraceData(traceData);

                    }

                    this.tracepoints[querypointId].push(tracepoint);
                    return tracepoint;
                },

                assignTracepoint: function(querypoint, tracepoint)
                {
                    this.querypointId_tracepoint[querypoint.id] = tracepoint;
                },

                getTraceData: function(pointRef, frameNo, objectRef)
                {
                    var tracepoint = this.querypointId_tracepoint[pointRef.id];
                    if (tracepoint)
                        return tracepoint.getTraceData(frameNo, objectRef);
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
                            try{
                            	var theJSON = JSON.stringify(unWrapped[prop]);
                                variableValues[prop] = JSON.parse(theJSON);
                            }catch(exc){
                            	exc.theJSON = theJSON;
                                trace("Error in getTraceScope: " + exc.message, exc);
                            }
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