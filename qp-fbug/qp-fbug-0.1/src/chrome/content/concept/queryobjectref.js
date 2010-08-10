var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var owner = QPFBUG.Classes;

    //------------------------------- QueryObjectRef ----------------------------------
    // This object uniquely specifies an object at a point.
    owner.QueryObjectRef =
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