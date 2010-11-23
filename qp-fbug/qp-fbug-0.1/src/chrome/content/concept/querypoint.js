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
            var constructor = function(id, queryType, refQuerypoint, refQueryExpr, url, lineNo, hitCount){
                this.id = id;
                this.queryType = queryType;

                //lastCondition && //lastChange
                // ref point object
                this.refQuerypoint = refQuerypoint;

                // lastChange
                // what we are looking for its last change
                this.refQueryExpr = refQueryExpr;
                this.dependentQuerypoints = [];

                // breakpoint
                this.url = url;
                this.lineNo = lineNo;
                this.hitCount = hitCount;

                //obj should be traced at this point
                this.queryExprList = [];   // the list of query expressions (QueryExpr)
                this.queryWatchList = [];  // the list of watch expressions
            };

            constructor.prototype = {
                addQueryExpr : function(queryExpr){
                    this.queryExprList.push(queryExpr);
                    return queryExpr;
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
                        return this.refQueryExpr.expr;
                    }
                },
            };
            return constructor;
        }();
}}

};