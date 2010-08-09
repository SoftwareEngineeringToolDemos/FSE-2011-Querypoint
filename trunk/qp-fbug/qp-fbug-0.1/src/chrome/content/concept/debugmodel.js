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
                 this.queryPoints = {};
                 this.nextQueryPointId = 0;
            };

            constructor.prototype = {
                addQueryPoint_Breakpoint : function(url, lineNumber, hitCount){
                    var queryPoint = new QueryPoint(++this.nextQueryPointId, DebugModel.QUERY_TYPES.BREAKPOINT,
                                                    null, null,
                                                    url, lineNumber, hitCount);

                    this.queryPoints[this.nextQueryPointId] = queryPoint;

                    return queryPoint;
                },

                addQueryPoint_LastChange : function(refPoint, valueFrameNo, valueRef){

                    // updates refPoint queryObjects
                    var type = QueryObject.TYPES.PARENT_CREATIONDATA | QueryObject.TYPES.PARENT_VALUE;
                    var queryObject = new QueryObject(type, valueFrameNo, valueRef);
                    refPoint.addQueryObject(queryObject);

                    // makes queryPoint
                    var queryObjectRef = new QueryObjectRef(refPoint, valueFrameNo, valueRef);
                    var queryPoint = new QueryPoint(++this.nextQueryPointId, DebugModel.QUERY_TYPES.LASTCHANGE,
                                                    null, queryObjectRef,
                                                    null, null, null);

                    // updates queryPoint queryObjects
                    type = QueryObject.TYPES.PARENT_CREATIONDATA | QueryObject.TYPES.PARENT_VALUE;
                    queryObject = new QueryObject(type, 0, ".owner" );
                    queryPoint.addQueryObject(queryObject)

                    // add trace point to the list
                    this.queryPoints[this.nextQueryPointId] = queryPoint;

                    return queryPoint;
                },

                addQueryPoint_LastCondition : function(refPoint){
                    var queryPoint = new QueryPoint(++this.nextQueryPointId, DebugModel.QUERY_TYPES.LASTCONDITION,
                                                    refPoint, null,
                                                    null, null, null);

                    this.queryPoints[this.nextQueryPointId] = queryPoint;
                    return queryPoint;
                },

                getLastQueryPoint: function()
                {
                    return this.queryPoints[this.nextQueryPointId - 1];  // TODO The next is one ahead of the current
                },

                getQueryPoints: function()
                {
                    var list = [];
                    for (var p in this.queryPoints)
                    {
                        if (p !== (this.nextQueryPointId - 1) && this.queryPoints.hasOwnProperty(p))
                            list.push(this.queryPoints[p]);
                    }
                    list.push(this.queryPoints[this.nextQueryPointId - 1]);  // I guess this one has to exist ?
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

            return constructor;
        }();

}}

};