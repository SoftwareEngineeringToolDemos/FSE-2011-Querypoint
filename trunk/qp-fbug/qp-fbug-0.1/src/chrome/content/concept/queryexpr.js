var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var owner = QPFBUG.Classes;

    //------------------------------- QueryExpr ----------------------------------
    // This object uniquely specifies an object at a point.
    owner.QueryExpr =
        function(){
            var constructor = function(frameNo, expr){
                //frame number : the frame, ref should be evaluated in. Frame 0 is the top frame in the stack.
                this.frameNo = frameNo;
                //reference to object or value (in general it can be any expression that can be evaluated)
                // expression valid in frame scope giving object we are tracking
                this.expr = expr;

                // if these are derived properties we should compute them lazy
                this.propertyName = expr.substring(expr.lastIndexOf(".")+1, expr.length);
                if (expr.lastIndexOf(".") >= 0)
                    this.parentRef = expr.substring(0, expr.lastIndexOf("."));

            };

            constructor.prototype = {
                toString: function()
                {
                    return "[QueryExpr]";
                }
            };

            return constructor;
        }();

}}

};