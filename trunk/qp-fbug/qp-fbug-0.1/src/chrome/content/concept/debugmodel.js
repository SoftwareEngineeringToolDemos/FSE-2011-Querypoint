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
                 this.breakpoint_querypointsSize = 0;
                 this.nextQuerypointId = 0;
            };

            constructor.prototype = {
                addQuerypoint_Breakpoint : function(url, lineNo, hitCount){

                    //if it is already added return it
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
                                                    url, lineNo, hitCount,
                                                    true, false);

                    this.querypoints[id] = querypoint;
                    this.querypointsSize++;
                    this.breakpoint_querypointsSize++;
                    return querypoint;
                },

                addQuerypoint_LastChange : function(refQuerypoint, valueFrameNo, valueRef){

                    //if it is already added return that
                    for (var id in this.querypoints){
                         var qp = this.querypoints[id];
                         if (qp.queryType === DebugModel.QUERY_TYPES.LASTCHANGE){
                             if (qp.refQuerypoint === refQuerypoint
                                && qp.refQueryExpr.frameNo === valueFrameNo
                                && qp.refQueryExpr.expr === valueRef)
                                return qp;
                         }
                    }

                    // makes querypoint
                    var refQueryExpr = new QueryExpr(valueFrameNo, valueRef);
                    var id = ++this.nextQuerypointId;
                    var querypoint = new Querypoint(id, DebugModel.QUERY_TYPES.LASTCHANGE,
                                                    refQuerypoint, refQueryExpr,
                                                    null, null, null,
                                                    false, false);

                    // updates querypoint queryExprList
                    var type = 0;
                    var queryExpr = new QueryExpr(0, ".parent" );
                    querypoint.addQueryExpr(queryExpr)

                    // add trace point to the list
                    this.querypoints[id] = querypoint;
                    this.querypointsSize++;

                    // updates refQuerypoint queryExprList
                    refQuerypoint.addDependentQuerypoint(querypoint);

                    refQuerypoint.addQueryExpr(refQueryExpr);

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
                                                    null, null, null,
                                                    false, false);

                    this.querypoints[id] = querypoint;
                    this.querypointsSize++;

                    // updates refQuerypoint queryExprList
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