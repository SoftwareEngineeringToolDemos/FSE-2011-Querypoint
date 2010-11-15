var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var __owner = QPFBUG.Classes;

    //--------------------------------- DebugModel --------------------------------
    __owner.DebugModel =
        function(){
            var constructor = function(){
                 this.querypoints = {};
                 this.querypointsSize = 0;
                 this.nextQuerypointId = 0;
            };

            constructor.prototype = {
                addQuerypoint_Breakpoint : function(url, lineNo, hitCount){

                    //if it is already added return that
                    for (var id in this.querypoints){
                         var qp = this.querypoints[id];
                         if (qp.queryType === DebugModel.QUERY_TYPES.BREAKPOINT){
                             if (qp.url === url
                                && qp.lineNo === lineNo
                                && qp.hitCount === hitCount)
                                return qp;
                         }
                    }

                    var id = ++this.nextQuerypointId;
                    var querypoint = new Querypoint(id, DebugModel.QUERY_TYPES.BREAKPOINT,
                                                    null, null,
                                                    url, lineNo, hitCount);

                    this.querypoints[id] = querypoint;
                    this.querypointsSize++;
                    return querypoint;
                },

                addQuerypoint_LastChange : function(refQuerypoint, valueFrameNo, valueRef){

                    //if it is already added return that
                    for (var id in this.querypoints){
                         var qp = this.querypoints[id];
                         if (qp.queryType === DebugModel.QUERY_TYPES.LASTCHANGE){
                             if (qp.refQuerypoint === refQuerypoint
                                && qp.refQueryexpr.frameNo === valueFrameNo
                                && qp.refQueryexpr.expr === valueRef)
                                return qp;
                         }
                    }

                    // makes querypoint
                    var refQueryexpr = new QueryExpr(valueFrameNo, valueRef);
                    var id = ++this.nextQuerypointId;
                    var querypoint = new Querypoint(id, DebugModel.QUERY_TYPES.LASTCHANGE,
                                                    refQuerypoint, refQueryexpr,
                                                    null, null, null);

                    // updates querypoint queryDataList
                    type = QueryData.TYPES.PARENT_CREATIONDATA | QueryData.TYPES.PARENT_VALUE;
                    queryData = new QueryData(type, 0, ".owner" );
                    querypoint.addQueryData(queryData)

                    // add trace point to the list
                    this.querypoints[id] = querypoint;
                    this.querypointsSize++;

                    // updates refQuerypoint queryDataList
                    refQuerypoint.addDependentQuerypoint(querypoint);
                    var type = QueryData.TYPES.PARENT_CREATIONDATA | QueryData.TYPES.PARENT_VALUE;
                    var queryData = new QueryData(type, valueFrameNo, valueRef);
                    refQuerypoint.addQueryData(queryData);

                    return querypoint;
                },

                addQuerypoint_LastCondition : function(refQuerypoint){

                    //if it is already added return that
                    for (var id in this.querypoints){
                         var qp = this.querypoints[id];
                         if (qp.queryType === DebugModel.QUERY_TYPES.LASTCONDITION){
                             if (qp.refQuerypoint === refQuerypoint)
                                return qp;
                         }
                    }

                    var id = ++this.nextQuerypointId;
                    var querypoint = new Querypoint(id, DebugModel.QUERY_TYPES.LASTCONDITION,
                                                    refQuerypoint, null,
                                                    null, null, null);

                    this.querypoints[id] = querypoint;
                    this.querypointsSize++;

                    // updates refQuerypoint queryDataList
                    refQuerypoint.addDependentQuerypoint(querypoint);

                    return querypoint;
                },

                getLastQuerypoint: function()
                {
                    return this.querypoints[this.nextQuerypointId - 1];  // TODO The next is one ahead of the current
                },

                getQuerypoints: function()
                {
                    var list = [];
                    for (var p in this.querypoints)
                    {
                        list.push(this.querypoints[p]);
                    }
//                    var iDontUnderstandThisDataStructure = this.querypoints[this.nextQuerypointId - 1];  // I guess this one has to exist ?
//                    if (iDontUnderstandThisDataStructure)
//                    	list.push(iDontUnderstandThisDataStructure);
//                    trace("getQuerypoints "+list.length, {list: list, list0: list[0], list1: list[1]});
                    return list;
                },

                toString: function()
                {
                    return "[DebugModel]";
                },

            };

            constructor.QUERY_TYPES =
            {
                 BREAKPOINT : 0,
                 LASTCHANGE : 1,
                 LASTCONDITION : 2
            };

            constructor.queryTypes = ["breakpoint", "lastChange", "lastCondition"];

            return constructor;
        }();

}}

};