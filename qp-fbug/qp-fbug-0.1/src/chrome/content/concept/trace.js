var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //--------------------------------- Trace --------------------------------
    __owner.Trace =

        function(){

            var constructor = function(){
                this.nextTracepointId = 0;
                this.tracepoints = {}; //<int querypointId, [] tracepoints>
                this.assignedTracepoints = {};
                this.assignedTracepointsSize = 0;
            };

            constructor.prototype = {

                addLastChangeTracepoint: function(querypoint, context, eventId, frame, parent, oldValue, newValue, isObjectCreation){

                    var tracepoint = this.addTracepoint(querypoint, context, eventId, frame, parent, oldValue, newValue);

                    if (isObjectCreation){ //correct last frame line number
                        //todo change it  perhaps you can keep the creation url, line number in querypoint as a traceResult summary itself
                        var traceData = context.qpfbug.debugSession.getLastTraceData(
                                     querypoint.refQuerypoint,
                                     querypoint.refQueryexpr.frameNo,
                                     querypoint.refQueryexpr.expr
                                     );

                        if (traceData){
                            var lineNo = traceData.parentCreatorLine;

                            if (!lineNo){
                                lineNo = traceData.parentConstructorLine;
                            }

                            if (typeof(lineNo) !== "undefined"){
                                tracepoint.traceFrame.stackTraceXB.frames[0].line = lineNo;
                            }
                        }
                    }

                    trace("LastChange Tracepoint", tracepoint);
                    return tracepoint;
                },

                addBreakpointTracepoint: function(querypoint, context, eventId, frame){
                    var tracepoint = this.addTracepoint(querypoint, context, eventId, frame);
                    trace("Breakpoint Tracepoint", tracepoint);
                    return tracepoint;
                },

                addTracepoint: function(querypoint, context, eventId, frame, parent, oldValue, newValue)
                {
                    var dataCollectionDepth = QPFBUG.Conf.DATA_COLLECTION_DEPTH;
                    var querypointId = querypoint.id;
                    if (!this.tracepoints[querypointId]){
                        this.tracepoints[querypointId] = [];
                    }

                    var stackTraceXB = QPFBUG.FBL.getCorrectedStackTrace(frame, context);
                    var traceThis = copyObject(unwrapIValue(frame.thisValue), dataCollectionDepth);
                    var traceFrame = new TraceFrame(stackTraceXB, this.getTraceScope(frame.scope, dataCollectionDepth), traceThis);
                    var traceOldValue = copyObject(oldValue, dataCollectionDepth);
                    var traceNewValue = copyObject(newValue, dataCollectionDepth);
                    var tracepoint = new Tracepoint(++this.nextTracepointId, eventId, querypoint, traceFrame, traceOldValue, traceNewValue);


                    for (var i=0 ; i<querypoint.queryDataList.length ; i++)
                    {
                        var queryData = querypoint.queryDataList[i];
                        var traceData;

                        if (queryData.isSpecial()){
                            //add .owner trace object
                            if (queryData.expr == ".owner"){
                                var traceData = new TraceData(queryData, this.getTraceObject(parent), oldValue);
                            }
                        }
                        if (queryData.isProperty()){
                            //todo find the right frame based on queryData.frameNo
                            var valueRef = queryData.expr;

                            var propertyName = queryData.propertyName;
                            var parentRef = queryData.parentRef;

                            var parent;
                            parent = evalInFrame(frame, parentRef);

                            if (!parent || typeof(parent)!="object") //todo how can it happen?
                                continue;

                            //wrapValue returns the jsd wrapper
                            var parentJSDIValue = QPFBUG.fbs.getJSD().wrapValue(parent);
                            // This one for is a wrapper for security reasons
                            // specially when this object is going to be used
                            // by other modules/extenstions
                            // var xpSafeWrappedValue = XPCSafeJSObjectWrapper(jsValue);

                            // Gecko2 (firefox 4)
                            // var parentId = Object.getProperty(object, "__QPFBUG_ID");
                            traceData = new TraceData(queryData, this.getTraceObject(parent), parent[propertyName])
                        }

                        if (queryData.isVariable()){
                            //find the corresponding scope
//                            var scope
                            
//                            if (!parentRef){//todo parent is a scope
//
//                                parent = this.findScopeForPropertyName(frame.scope, propertyName);
//
//                                //traceData = new TraceData(queryData, null, exprValue)
//                            }else{

                        }


                        tracepoint.addTraceData(traceData);
                    }

                    for (var i=0 ; i<querypoint.queryWatchList.length ; i++)
                    {
                        var queryWatch = querypoint.queryWatchList[i];
                        var evalValue = evalInFrame(frame, queryWatch);
                        tracepoint.addTraceWatch(queryWatch, copyObject(evalValue, 2));
                    }

                    this.tracepoints[querypointId].push(tracepoint);
                    return tracepoint;
                },

                assignTracepoint: function(querypoint, tracepoint)
                {
                    if (!this.assignedTracepoints[querypoint.id])//todo this line is unneccary
                        this.assignedTracepointsSize++;          
                    this.assignedTracepoints[querypoint.id] = tracepoint;

                    this.assignDependentQuerypoints(querypoint, tracepoint);
                },

                assignDependentQuerypoints: function(querypoint, tracepoint){
                    var dependentQuerypoints = querypoint.dependentQuerypoints;
                    var qp, tp;
                    var expr, parentId;
                    for (var i=0 ; i<dependentQuerypoints.length ; i++){
                        qp = dependentQuerypoints[i];
                        var assigned = false;

                        //todo change all these part it is dependent to changes in querydata and tracedata
                        // use object id for comparing parents
                        if (qp.queryType == DebugModel.QUERY_TYPES.LASTCHANGE)
                        {
                            expr = qp.refQueryexpr.expr;
                            for (var j=0 ; j<tracepoint.traceDataList.length ; j++)
                            {
                                if (tracepoint.traceDataList[j].queryData.expr === expr){
                                    parentId = tracepoint.traceDataList[j].parentTraceObject.id
                                    break;
                                }
                            }
                            var qpTracepoints = this.tracepoints[qp.id];
                            if (!qpTracepoints) //if there is not racepoint for this querytype
                                continue;

                            for (var k=qpTracepoints.length-1 ; k>-1 ; k--)
                            {
                                 tp = qpTracepoints[k];
                                 if (tp.eventId >= tracepoint.eventId) //it is lastChange so it should be before this tracepoint
                                    continue;
                                 for (var l=0 ; l<tp.traceDataList.length ; l++){
                                     if (tp.traceDataList[l].queryData.expr===".owner" &&
                                         parentId === tp.traceDataList[l].parentTraceObject.id){
                                        this.assignTracepoint(qp, tp); //todo it is not correct change it
                                        assigned = true;
                                        break;
                                     }
                                 }
                                 if (assigned)
                                    break;
                                 //if (tracepoint.traceData)
                            }
                        }
                    }
                },

                getTraceData: function(pointRef, frameNo, objectRef)
                {
                    var tracepoint = this.assignedTracepoints[pointRef.id];
                    if (tracepoint)
                        return tracepoint.getTraceData(frameNo, objectRef);
                    return null;
                },

                getAssignedTracepointByQuerypoint: function(querypoint)
                {
                    return this.assignedTracepoints[querypoint.id];
//                    var points = this.tracepoints[];
//                    trace("getLastTracepointByQuerypoint "+points, {querypoint: querypoint, tracepoints: this.tracepoints});
//                    if (points && points.length)
//                        return points[points.length - 1];
                },

                findScopeForPropertyName: function(scope, propertyName){
                    if (!scope)
                        return null;

                    if (scope.getProperty(propertyName))
                        return unwrapIValue(scope);

                    return this.findScopeForPropertyName(scope.jsParent, propertyName);
//                    var jsClassName = scope.jsClassName;
//                    var unWrappedScope  = unwrapIValueObject(scope);
//                    for (name in unWrappedScope){
//                        if (name == propertyName){
//                            return unWrappedScope;
//                        }
//                    }

//                        scopeVars = {};
//                        var listValue = {value: null}, lengthValue = {value: 0};
//                        scope.getProperties(listValue, lengthValue);
//
//                        for (var i = 0; i < lengthValue.value; ++i)
//                        {
//                            var prop = listValue.value[i];
//                            var name = FBL.unwrapIValue(prop.name);
//                            if (!FBL.shouldIgnore(name))
//                                scopeVars[name] = FBL.unwrapIValue(prop.value);
//                        }
//                        return scopeVars;
                    
                },

                getTraceScope: function (scope, depth)
                {

                    if (!scope)
                        return null;

                    var parentDepth = 1;
                    if (depth <=0)
                        parentDepth = 0;
                    var parentTraceScope = this.getTraceScope(scope.jsParent, parentDepth);
                    
                    var jsClassName = scope.jsClassName;
                    if (depth <= 0)
                        return  new TraceScope(parentTraceScope, jsClassName, {}); //returns empty scope

                    var traceScope;
                    var parentScope, jsClassName, variables, values;

                    var jsClassName = scope.jsClassName;
                    var unWrappedScope  = unwrapIValueObject(scope);
                    var variableValues = {};

                    for (var prop in unWrappedScope){
                        if (unWrappedScope[prop]){
                                variableValues[prop] = null;
                                variableValues[prop] = copyObject(unWrappedScope[prop], depth-1);
                        }else
                            variableValues[prop] = unWrappedScope[prop];
                    }

                    traceScope = new TraceScope(parentTraceScope, jsClassName, variableValues);

                    return traceScope;
                },

                getTraceObject: function(object){
                    var jsdIValue = QPFBUG.fbs.getJSD().wrapValue(object);
                    var traceObject = new TraceObject();

                    traceObject.id = getObjectId(object);

                    var jsdIObject = jsdIValue.objectValue;
                    if (jsdIObject)
                    {
                        traceObject.creatorURL = jsdIObject.creatorURL;
                        traceObject.creatorLine = jsdIObject.creatorLine;
                        traceObject.constructorURL = jsdIObject.constructorURL;
                        traceObject.constructorLine = jsdIObject.constructorLine;
                    }
                    return traceObject;
                },

            };

            return constructor;
        }();

}}

};