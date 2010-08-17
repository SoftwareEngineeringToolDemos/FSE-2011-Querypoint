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
                 this.nextQuerypointId = 0;
            };

            constructor.prototype = {
                addQuerypoint_Breakpoint : function(url, lineNumber, hitCount){
                    var querypoint = new Querypoint(++this.nextQuerypointId, DebugModel.QUERY_TYPES.BREAKPOINT,
                                                    null, null,
                                                    url, lineNumber, hitCount);

                    this.querypoints[this.nextQuerypointId] = querypoint;

                    return querypoint;
                },

                addQuerypoint_LastChange : function(refQuerypoint, valueFrameNo, valueRef){

                    // updates refQuerypoint queryDataList
                    var type = QueryData.TYPES.PARENT_CREATIONDATA | QueryData.TYPES.PARENT_VALUE;
                    var queryData = new QueryData(type, valueFrameNo, valueRef);
                    refQuerypoint.addQueryData(queryData);

                    // makes querypoint
                    var refQueryexpr = new QueryExpr(valueFrameNo, valueRef);
                    var querypoint = new Querypoint(++this.nextQuerypointId, DebugModel.QUERY_TYPES.LASTCHANGE,
                                                    refQuerypoint, refQueryexpr,
                                                    null, null, null);

                    // updates querypoint queryDataList
                    type = QueryData.TYPES.PARENT_CREATIONDATA | QueryData.TYPES.PARENT_VALUE;
                    queryData = new QueryData(type, 0, ".owner" );
                    querypoint.addQueryData(queryData)

                    // add trace point to the list
                    this.querypoints[this.nextQuerypointId] = querypoint;

                    return querypoint;
                },

                addQuerypoint_LastCondition : function(refQuerypoint){
                    var querypoint = new Querypoint(++this.nextQuerypointId, DebugModel.QUERY_TYPES.LASTCONDITION,
                                                    refQuerypoint, null,
                                                    null, null, null);

                    this.querypoints[this.nextQuerypointId] = querypoint;
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
                    trace("getQuerypoints "+list.length, {list: list, list0: list[0], list1: list[1]});
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