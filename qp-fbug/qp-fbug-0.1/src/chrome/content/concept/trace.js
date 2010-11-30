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
                this.assignedBreakpointTracepointsSize = 0;
            };

            constructor.prototype = {

                addLastChangeTracepoint: function(querypoint, context, eventId, frame, parent, oldValue, newValue, isObjectCreation){
                    var tracepoint = this.addTracepoint(querypoint, context, eventId, frame, parent, oldValue, newValue);

                    if (isObjectCreation){ //correct last frame line number
                        //todo change it  perhaps you can keep the creation url, line number in querypoint as a traceResult summary itself
                        var traceData = context.qpfbug.debugSession.getLastTraceData(
                                     querypoint.refQuerypoint,
                                     querypoint.refQueryExpr.frameNo,
                                     querypoint.refQueryExpr.expr
                                     );

                        if (traceData){
                            var lineNo = traceData.parentTrace.creatorLine;

                            if (!lineNo){
                                lineNo = traceData.parentTrace.constructorLine;
                            }

                            if (typeof(lineNo) !== "undefined"){
                                tracepoint.traceFrame.stackTraceXB.frames[0].line = lineNo;
                            }
                        }
                    }

                    return tracepoint;
                },

                addBreakpointTracepoint: function(querypoint, context, eventId, frame){
                    var tracepoint = this.addTracepoint(querypoint, context, eventId, frame);
                    return tracepoint;
                },

                addTracepoint: function(querypoint, context, eventId, frame, parent, oldValue, newValue)
                {
                    var querypointId = querypoint.id;
                    if (!this.tracepoints[querypointId]){
                        this.tracepoints[querypointId] = [];
                    }

                    var index = this.tracepoints[querypointId].length;

                    var dataCollectionDepth = QPFBUG.Conf.DATA_COLLECTION_DEPTH;
                    if (querypoint.breakable){
                        if (querypoint.stopIndex == index)
                            dataCollectionDepth = QPFBUG.Conf.DATA_COLLECTION_DEPTH;
                        else
                            dataCollectionDepth = 0;
                    } else {
                        dataCollectionDepth = QPFBUG.Conf.DATA_COLLECTION_DEPTH;
                    }

                    var stackTraceXB = QPFBUG.FBL.getCorrectedStackTrace(frame, context);
                    var traceThis = copyObject(unwrapIValue(frame.thisValue), dataCollectionDepth);
                    var traceFrame = new TraceFrame(stackTraceXB, this.getTraceScope(context, frame, frame.scope, true, dataCollectionDepth), traceThis);
                    var traceOldValue = copyObject(oldValue, dataCollectionDepth);
                    var traceNewValue = copyObject(newValue, dataCollectionDepth);
                    var tracepoint = new Tracepoint(++this.nextTracepointId, eventId, index, querypoint, traceFrame, traceOldValue, traceNewValue);


                    for (var i=0 ; i<querypoint.queryExprList.length ; i++)
                    {
                        var queryExpr = querypoint.queryExprList[i];
                        var traceData;

                        if (queryExpr.isSpecial() && queryExpr.expr == ".parent"){
                            //add .parent trace object
                            var traceData = new TraceData(queryExpr, oldValue);
                            if (querypoint.refQueryExpr.isProperty()){
                                var parentJSDIValue = QPFBUG.fbs.getJSD().wrapValue(parent);
                                traceData.parentTrace = this.getTraceObject(parentJSDIValue);
                            }else if (querypoint.refQueryExpr.isVariable()){ //&& with
                                var parentJSDIValue = QPFBUG.fbs.getJSD().wrapValue(parent);
                                traceData.parentTrace = this.getTraceObject(parentJSDIValue);
                            }
                        }
                        if (queryExpr.isProperty()){
                            //todo find the right frame based on queryExpr.frameNo
                            var valueRef = queryExpr.expr;

                            var propertyName = queryExpr.propertyName;
                            var parentRef = queryExpr.parentRef;

                            var parent;
                            var parentJSDIValue

                            parent = evalInFrame(frame, parentRef);
                            //wrapValue returns the jsd wrapper
                            parentJSDIValue = QPFBUG.fbs.getJSD().wrapValue(unwrapObject(parent));

                            if (!parent || typeof(parent)!="object") //todo how can it happen?
                                continue;

                            // This one for is a wrapper for security reasons
                            // specially when this object is going to be used
                            // by other modules/extenstions
                            // var xpSafeWrappedValue = XPCSafeJSObjectWrapper(jsValue);

                            // Gecko2 (firefox 4)
                            // var parentId = Object.getProperty(object, "__QPFBUG_ID");
                            traceData = new TraceData(queryExpr, parent[propertyName]);
                            traceData.parentTrace = this.getTraceObject(parentJSDIValue);
                        }

                        if (queryExpr.isVariable()){
                            var scope = this.findScopeForVariableName(frame.scope, queryExpr.variableName);
//                            log("++++++++context" ,context);
//                            log("++++++++fileName: " + frame.script.fileName);
                            var fileName = normalizeURL(frame.script.fileName);
                            var sourceFile = context.sourceFileMap[fileName];
                            
//                            script.tag;

                            var traceScope = this.getTraceScope(context, frame, scope, false, 0);
                            traceData = new TraceData(queryExpr, scope.getProperty(queryExpr.variableName));
                            traceData.parentTrace = traceScope;
                        }


                        tracepoint.addTraceData(traceData);
                    }

                    for (var i=0 ; i<querypoint.queryWatchList.length ; i++)
                    {
                        var queryWatch = querypoint.queryWatchList[i];
                        var evalValue = evalInFrame(frame, queryWatch);
                        tracepoint.addTraceWatch(queryWatch, copyObject(evalValue, dataCollectionDepth));
                    }

                    this.tracepoints[querypointId].push(tracepoint);
                    return tracepoint;
                },

                assignTracepoint: function(querypoint, tracepoint)
                {
                    if (!this.assignedTracepoints[querypoint.id]){//todo this line is unneccary
                        if (querypoint.queryType === 0)//breakpoint
                            this.assignedBreakpointTracepointsSize++;
                        this.assignedTracepointsSize++;
                    }
                    this.assignedTracepoints[querypoint.id] = tracepoint;

                    if (!tracepoint.querypoint.nonDeterminismInStopIndex)
                        if (tracepoint.querypoint.stopIndex != -1)
                            if (tracepoint.index == tracepoint.querypoint.stopIndex){
                               tracepoint.querypoint.breakable = true;
                            }else{
                               tracepoint.querypoint.nonDeterminismInStopIndex = true;
                               tracepoint.querypoint.breakable = false; 
                            }
                    tracepoint.querypoint.stopIndex = tracepoint.index;

                    this.assignDependentQuerypoints(querypoint, tracepoint);
                },

                assignDependentQuerypoints: function(querypoint, tracepoint){
                    var qp, tp, td; //querypoint, tracepoint, tracedata
                    var refQueryExpr;
                    var parentId;

                    var dependentQuerypoints = querypoint.dependentQuerypoints;
                    for (var i=0 ; i<dependentQuerypoints.length ; i++){
                        qp = dependentQuerypoints[i];
                        var assigned = false;

                        //todo change all these part it is dependent to changes in queryexpr and tracedata
                        // use object id for comparing parents
                        if (qp.queryType == DebugModel.QUERY_TYPES.LASTCHANGE)
                        {
                            var traceData = tracepoint.getTraceData(qp.refQueryExpr.frameNo, qp.refQueryExpr.expr);

                            if (!traceData)
                                continue;

//                            if (qp.refQueryExpr.isProperty()){
                                parentId = traceData.parentTrace.id;

                                var qpTracepoints = this.tracepoints[qp.id];
                                if (!qpTracepoints) //if there is no tracepoint for this querytype
                                    continue;

                                for (var k=qpTracepoints.length-1 ; k>-1 ; k--)
                                {
                                     tp = qpTracepoints[k];
                                     if (tp.eventId >= tracepoint.eventId) //it is lastChange so it should be before this tracepoint
                                         continue;
                                     var td = tp.getTraceData(0, ".parent");

                                     if (parentId === td.parentTrace.id){
                                        this.assignTracepoint(qp, tp); //todo it is not correct change it
                                        assigned = true;
                                        break;
                                     }
                                     if (assigned)
                                        break;
                                }
//                            }else if (qp.refQueryExpr.isVariable()){
//
//                            }

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
                },

                findScopeForVariableName: function(scope, variableName){
                    if (!scope)
                        return null;

                    if (scope.getProperty(variableName))
                        return scope;

                    return this.findScopeForVariableName(scope.jsParent, variableName);
                },

                getTraceScope: function (context, frame, scope, linkParent, depth) //scope is a JSDIValue
                {
                    if (!scope)
                        return null;

                    var parentTrace = null;

                    if (linkParent){
                        var parentDepth = 1;
                        if (depth <=0)
                            parentDepth = 0;
                        parentTrace = this.getTraceScope(context, frame, scope.jsParent, true, parentDepth);
                    }
                    
                    var jsClassName = scope.jsClassName;
                    var unWrappedScope  = unwrapIValueObject(scope);
                    var variableValues = {};
                    var traceScope = new TraceScope(parentTrace, jsClassName, variableValues); //returns empty scope

                    var id;

                    if (jsClassName == "Call"){
                        var id = DebugService.getInstance().getScopeId(scope);
//                        log("::::::::::::::::::::::",scope);
//                        log("----------------------",unWrappedScope);
                    }else if (jsClassName =="Window"){
                        var traceObject = this.getTraceObject(scope);
                        traceScope.id = traceObject.id;
                        traceScope.creatorURL = traceObject.creatorURL;
                        traceScope.creatorLine = traceObject.creatorLine;
                        traceScope.constructorURL = traceObject.constructorURL;
                        traceScope.constructorLine = traceObject.constructorLine;
                    }else if (jsClassName == "With"){
                        var traceObject = this.getTraceObject(scope.jsPrototype); //it seems that the real "with" object is kept as a prototype
                        traceScope.id = traceObject.id;
                        traceScope.creatorURL = traceObject.creatorURL;
                        traceScope.creatorLine = traceObject.creatorLine;
                        traceScope.constructorURL = traceObject.constructorURL;
                        traceScope.constructorLine = traceObject.constructorLine;
                    } else if (jsClassName =="Block"){}//todo add "catch" scope

                    if (depth <= 0)
                        return  traceScope; //returns empty scope


                    //fills variableValues
                    for (var prop in unWrappedScope){
                        if (unWrappedScope[prop]){
                                variableValues[prop] = null;
                                variableValues[prop] = copyObject(unWrappedScope[prop], depth-1);
                        }else
                            variableValues[prop] = unWrappedScope[prop];
                    }

                    return traceScope;
                },

                getTraceObject: function(jsdIValue){  //gets a JSDIValue

                    //workaround for strange wrappers that unwrapObject() doesn't work
                    // https://developer.mozilla.org/en/XPConnect_wrappers
                    if (jsdIValue.jsClassName == "XPCCrossOriginWrapper")
                        jsdIValue = jsdIValue.jsParent; //todo I'm not sure that it is the right way to unwrap

                    var traceObject = new TraceObject();
                    var object = unwrapIValueObject(jsdIValue);
                    traceObject.id = DebugService.getInstance().getObjectId(object, false);


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