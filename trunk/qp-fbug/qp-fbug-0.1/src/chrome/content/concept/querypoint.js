var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var __owner = QPFBUG.Classes;

    //------------------------------- Querypoint ----------------------------------
    // trace point is kept in debug model.
    __owner.Querypoint =
        function(){
            var constructor = function(id, queryType, refQuerypoint, refQueryexpr, url, lineNo, hitCount){
                this.id = id;
                this.queryType = queryType;

                //lastCondition && //lastChange
                // ref point object
                this.refQuerypoint = refQuerypoint;

                // lastChange
                // what we are looking for its last change
                this.refQueryexpr = refQueryexpr;
                this.dependentQuerypoints = [];

                // breakpoint
                this.url = url;
                this.lineNo = lineNo;
                this.hitCount = hitCount;

                //obj should be traced at this point
                this.queryDataList = [];   // the list of query expressions (QueryExpr) 
                this.queryWatchList = [];  // the list of watch expressions
            };

            constructor.prototype = {
                addQueryData : function(queryData){
                    this.queryDataList.push(queryData);
                    return queryData;
                },

                addQueryWatch : function(expr){
                    this.queryWatchList.push(expr);
                },

                addDependentQuerypoint : function(querypoint){
                    this.dependentQuerypoints.push(querypoint);
                    return querypoint;
                },

                toString: function()
                {
                    return "["+this.getQueryType()+" Querypoint "+this.url+"@"+this.lineNo+"]";
                },

                getQueryType: function()
                {
                    return DebugModel.queryTypes[this.queryType];
                },

                getQueryObjectExpression: function()
                {
                    if (this.getQueryType() === "lastChange")
                    {
                        return this.refQueryexpr.expr;
                    }
                },
            };
            return constructor;
        }();
}}

};