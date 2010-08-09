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
            var constructor = function(id, queryType, refPoint, globalObjectRef, url, lineNo, hitCount){
                this.id = id;
                this.queryType = queryType;

                //lastCondition
                // ref point object
                this.refPoint = refPoint;

                // lastChange
                // what we are looking for its last change
                this.globalObjectRef = globalObjectRef;

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
                	return "[LastChange QueryPoint "+this.url+"@"+this.lineNo+"]";
                }
            };
            return constructor;
        }();

    //------------------------------- QueryObject ----------------------------------
    // This object uniquely specifies an object at a point.
    owner.GlobalObjectRef =
        function(){
            var constructor = function(refPoint, frameNo, ref){
                this.refPoint = refPoint;
                //frame number
                this.frameNo = frameNo;
                //reference to object or value (in general it can be any expression that can be evaluated)
                this.ref = ref;

                this.propertyName = ref.substring(ref.lastIndexOf(".")+1, ref.length);
                if (ref.lastIndexOf(".") >= 0)
                    this.parentRef = ref.substring(0, ref.lastIndexOf("."));

            };

            constructor.prototype = {
                toString: function()
                {
            		return "[ObjectAtPoint]";
                }
            };

            return constructor;
        }();

}}

};