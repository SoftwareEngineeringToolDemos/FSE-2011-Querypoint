var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- EventRequest --------------------------------
owner.EventRequest = function(){

        var constructor = function(type, callBack, context, bp_url, bp_lineNo,
                                         w_ownerCreationUrl, w_ownerCreationLineNo, w_propertyName){
            this.type = type;
            this.callBack = callBack;
            this.context = context;
            this.bp_url = bp_url;
            this.bp_lineNo = bp_lineNo;
            this.w_ownerCreationUrl = w_ownerCreationUrl;
            this.w_ownerCreationLineNo = w_ownerCreationLineNo;
            this.w_propertyName = w_propertyName;

            // This variable is used for the internal functionality of debugservice.
            // For both types, only one bp is kept in this variable.
            this.breakpoints = [];

        };

        constructor.prototype =
        {
            isBreakpoint: function(){
                return (this.type == EventRequest.TYPES.BREAKPOINT);
            },

            isWatchPoint: function(){
                return (this.type == EventRequest.TYPES.WATCHPOINT);
            },

        };

        constructor.TYPES = {
            BREAKPOINT : 0,
            WATHPOINT : 1,
        };

        return constructor;
    }();
}}
};