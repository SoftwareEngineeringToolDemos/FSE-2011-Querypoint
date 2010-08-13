var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var owner = QPFBUG.Classes;

    //------------------------------- QueryPoint ----------------------------------
    // trace point is kept in debug model.
    owner.QueryPoint =
        function(){
            var constructor = function(id, queryType, refPoint, queryObjectRef, url, lineNo, hitCount){
                this.id = id;
                this.queryType = queryType;

                //lastCondition
                // ref point object
                this.refPoint = refPoint;

                // lastChange
                // what we are looking for its last change
                this.queryObjectRef = queryObjectRef;

                // breakpoint
                this.url = url;
                this.lineNo = lineNo;
                this.hitCount = hitCount;

                //obj should be traced at this point
                this.queryObjects = [];
            };

            constructor.prototype = {
                addQueryObject : function(queryObject){
                    this.queryObjects.push(queryObject);
                    return queryObject;
                },

                toString: function()
                {
                    return "["+this.getQueryType()+" QueryPoint "+this.url+"@"+this.lineNo+"]";
                },
                
                getQueryType: function()
                {
                	return DebugModel.queryTypes[this.queryType];
                }
            };
            return constructor;
        }();
}}

};