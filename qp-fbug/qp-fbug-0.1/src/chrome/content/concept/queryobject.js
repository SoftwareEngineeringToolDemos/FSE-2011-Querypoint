var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){
    var owner = QPFBUG.Classes;

    //------------------------------- QueryObject ----------------------------------
    // This object specifies data should be collect for an object at a point.
    owner.QueryObject =
        function(){
            var constructor = function(type, frameNo, ref){

                this.type = type;
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
            		return "[QueryObject "+this.propertyName+"]";
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