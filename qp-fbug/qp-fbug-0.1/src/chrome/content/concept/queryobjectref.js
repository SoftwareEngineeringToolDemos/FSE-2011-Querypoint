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
                // Salman what is this? Don't you mean "querypoint"?
                this.refPoint = refPoint;
                //frame number << we know that from the property name, but what does the number mean?
                // I guess you mean "stack depth"?
                this.frameNo = frameNo;
                //reference to object or value (in general it can be any expression that can be evaluated)
                // how about calling this "expr" and comment:
                // expression valid in frame scope giving object we are tracking
                this.ref = ref;

                // if these are derived properties we should compute them lazy
                this.propertyName = ref.substring(ref.lastIndexOf(".")+1, ref.length);
                if (ref.lastIndexOf(".") >= 0)
                    this.parentRef = ref.substring(0, ref.lastIndexOf("."));

            };

            constructor.prototype = {
                toString: function()
                {
                    return "[QueryObjectRef]";
                }
            };

            return constructor;
        }();

}}

};