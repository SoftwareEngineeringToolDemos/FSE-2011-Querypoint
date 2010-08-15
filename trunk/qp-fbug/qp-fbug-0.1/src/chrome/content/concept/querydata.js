var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var owner = QPFBUG.Classes;

    //------------------------------- QueryData ----------------------------------
    // This object specifies data should be collected for an object at a point.
    owner.QueryData =
        function(){
            var constructor = function(type, frameNo, expr){

                this.type = type;
                //frame number
                this.frameNo = frameNo;
                //reference to object or value (in general it can be any expression that can be evaluated)
                this.expr = expr;

                this.propertyName = expr.substring(expr.lastIndexOf(".")+1, expr.length);
                if (expr.lastIndexOf(".") >= 0)
                    this.parentRef = expr.substring(0, expr.lastIndexOf("."));
            };

            constructor.prototype = {
                toString: function()
                {
            		return "[QueryData "+this.propertyName+"]";
                }
            };

            constructor.TYPES = {
                PARENT_NOTHING: 0,
                PARENT_CREATIONDATA: 1,
                PARENT_VALUE: 2,
                PARENT_CREATIONDATA: 4,
                OBJECT_VALUE: 8,
                ALL:127,
            }

            return constructor;
        }();

}}

};