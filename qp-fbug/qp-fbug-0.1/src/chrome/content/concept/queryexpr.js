var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var __owner = QPFBUG.Classes;

    //------------------------------- QueryExpr ----------------------------------
    // This object uniquely specifies an object at a point.
    __owner.QueryExpr =
        function(){
            var constructor = function(frameNo, expr){ //TODO for "special" cases frameNo is not required
                //frame number : the frame, ref should be evaluated in. Frame 0 is the top frame in the stack.
                this.frameNo = frameNo;

                //reference to object or value (in general it can be any expression which refers to an object or value)
                // expression valid in frame scope giving object we are tracking
                this.expr = expr;

                // if these are derived properties we should compute them lazy
                if (expr.indexOf(".")=== 0){ //starts with dot
                    this.type = QueryExpr.TYPES.SPECIAL;
                    this.specialRef = expr.substring(1);
                }else if (expr.lastIndexOf(".") >= 0){
                    this.type = QueryExpr.TYPES.PROPERTY;
                    this.propertyName = expr.substring(expr.lastIndexOf(".")+1, expr.length);
                    this.parentRef = expr.substring(0, expr.lastIndexOf("."));
                }else{
                    this.type = QueryExpr.TYPES.VARIABLE;
                    this.variableName = expr;
                }

            };

            constructor.prototype = {
                toString: function()
                {
                    return "[QueryExpr]";
                },

                isSpecial: function(){
                    return this.type === QueryExpr.TYPES.SPECIAL;
                },

                isProperty: function(){
                    return this.type === QueryExpr.TYPES.PROPERTY;
                },

                isVariable: function(){
                    return this.type === QueryExpr.TYPES.VARIABLE;
                },
            };

            constructor.TYPES = {
                SPECIAL: 1,
                PROPERTY: 2,
                VARIABLE: 3,
            };

            return constructor;
        }();

}}

};