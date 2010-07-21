var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- DebugInterface --------------------------------

owner.DebugInterface = function(){

        var constructor = function(){
        
        };

        constructor.prototype =
        {
        };
        return constructor;
    }();

//--------------------------------- BreakRequest --------------------------------

owner.BreakRequest = function(){

        var constructor = function(type, bp_url, bp_lineNumber, w_creationUrl, w_creationLine, w_propertyName){
            this.type = type;
            this.bp_url = bp_url;
            this.bp_lineNumber = bp_lineNumber;
            this.w_creationUrl = w_creationUrl;
            this.w_propertyName = w_propertyName;
        };

        constructor.prototype =
        {
            TYPES : {
              BREAKPOINT : 0,
              WATCH : 1
            }
        };
        return constructor;
    }();
}}

};