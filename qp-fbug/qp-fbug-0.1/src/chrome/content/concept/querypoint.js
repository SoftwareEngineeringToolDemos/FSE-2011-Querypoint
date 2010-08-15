var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var owner = QPFBUG.Classes;

    //------------------------------- Querypoint ----------------------------------
    // trace point is kept in debug model.
    owner.Querypoint =
        function(){
            var constructor = function(id, queryType, refQuerypoint, refQueryobject, url, lineNo, hitCount){
                this.id = id;
                this.queryType = queryType;

                //lastCondition && //lastChange
                // ref point object
                this.refQuerypoint = refQuerypoint;

                // lastChange
                // what we are looking for its last change
                this.refQueryobject = refQueryobject;

                // breakpoint
                this.url = url;
                this.lineNo = lineNo;
                this.hitCount = hitCount;

                //obj should be traced at this point
                this.queryDatas = [];
            };

            constructor.prototype = {
                addQueryData : function(queryData){
                    this.queryDatas.push(queryData);
                    return queryData;
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
                        return this.refQueryobject.expr;
                    }
                },
            };
            return constructor;
        }();
}}

};