var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var owner = QPFBUG.Classes;

    //--------------------------------- DebugModel --------------------------------
    owner.DebugModel =
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

                addQuerypoint_LastChange : function(refPoint, valueFrameNo, valueRef){

                    // updates refPoint queryObjects
                    var type = QueryObject.TYPES.PARENT_CREATIONDATA | QueryObject.TYPES.PARENT_VALUE;
                    var queryObject = new QueryObject(type, valueFrameNo, valueRef);
                    refPoint.addQueryObject(queryObject);

                    // makes querypoint
                    var queryObjectRef = new QueryObjectRef(refPoint, valueFrameNo, valueRef);
                    var querypoint = new Querypoint(++this.nextQuerypointId, DebugModel.QUERY_TYPES.LASTCHANGE,
                                                    null, queryObjectRef,
                                                    null, null, null);

                    // updates querypoint queryObjects
                    type = QueryObject.TYPES.PARENT_CREATIONDATA | QueryObject.TYPES.PARENT_VALUE;
                    queryObject = new QueryObject(type, 0, ".owner" );
                    querypoint.addQueryObject(queryObject)

                    // add trace point to the list
                    this.querypoints[this.nextQuerypointId] = querypoint;

                    return querypoint;
                },

                addQuerypoint_LastCondition : function(refPoint){
                    var querypoint = new Querypoint(++this.nextQuerypointId, DebugModel.QUERY_TYPES.LASTCONDITION,
                                                    refPoint, null,
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