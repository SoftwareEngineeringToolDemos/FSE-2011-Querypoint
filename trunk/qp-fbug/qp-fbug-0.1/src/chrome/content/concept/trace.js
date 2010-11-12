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

                addLastChangeTracepoint: function(querypoint, context, eventId, frame, parent, oldValue, newValue){

                    var tracepoint = this.addTracepoint(querypoint, context, eventId, frame);

                    //add .owner trace object
                    var queryData;
                    for (var i=0 ; i<querypoint.queryDataList.length ; i++){
                        if (querypoint.queryDataList[i].expr == ".owner"){
                            queryData = querypoint.queryDataList[i];
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

                addBreakpointTracepoint: function(querypoint, context, eventId, frame){
                    var tracepoint = this.addTracepoint(querypoint, context, eventId, frame);
                    trace("Breakpoint Tracepoint", tracepoint);
                    return tracepoint;
                },

                addTracepoint: function(querypoint, context, eventId, frame)
                {
                    var querypointId = querypoint.id;
                    if (!this.tracepoints[querypointId]){
                        this.tracepoints[querypointId] = [];
                    }

                    var stackTraceXB = QPFBUG.FBL.getCorrectedStackTrace(frame, context);
                    var traceFrame = new TraceFrame(stackTraceXB, this.getTraceScope(frame.scope, 2));
                    var traceThis = copyObject(unwrapIValueObject(frame.thisValue), 2);
                    var tracepoint = new Tracepoint(++this.nextTracepointId, eventId, querypoint, traceFrame, traceThis);


                    for (var i=0 ; i<querypoint.queryDataList.length ; i++)
                    {
                        var queryData = querypoint.queryDataList[i];

                        //todo find the right frame based on queryData.frameNo
                        var valueRef = queryData.expr;

                        var propertyName = queryData.propertyName;
                        var parentRef = queryData.parentRef;

                        //var exprValue;
                        var parentValue;

                        var traceData;
                        var parent;
                        if (!parentRef){//todo parent is a scope

                            parent = this.findScopeForPropertyName(frame.scope, propertyName);

                            //traceData = new TraceData(queryData, null, exprValue)
                        }else{
                            parent = evalInFrame(frame, parentRef);
                        }

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
                        traceData = new TraceData(queryData, parent, parent[propertyName])

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
                    var expr, parent;
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
                                    parent = tracepoint.traceDataList[j].parentValue
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
                                         parent === tp.traceDataList[l].parentValue){
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

                    if (!QPFBUG.Conf.COLLECT_DATA)
                        return  new TraceScope(null, "", {}); //returns empty scope

                    var traceScope;
                    var parentScope, jsClassName, variables, values;

                    var jsClassName = scope.jsClassName;
                    var unWrappedScope  = unwrapIValueObject(scope);
                    var variableValues = {};
                    for (var prop in unWrappedScope){
                        if (unWrappedScope[prop])
                            try{
//                                variableValues[prop] = JSON.parse(JSON.stringify(unWrappedScope[prop]));
                                variableValues[prop] = null;
                                variableValues[prop] = copyObject(unWrappedScope[prop], depth);
                            }catch(exc){
                                trace("Error in copyObject(): " + exc.message, exc);
                            }
                        else
                            variableValues[prop] = unWrappedScope[prop];
                    }

//                    if (depth>0)
//                        depth--;
//                    depth = 0;
                    var parentTraceScope = this.getTraceScope(scope.jsParent, depth);
                    traceScope = new TraceScope(parentTraceScope, jsClassName, variableValues);

                    return traceScope;
                },

            };

            return constructor;
        }();

}}

};