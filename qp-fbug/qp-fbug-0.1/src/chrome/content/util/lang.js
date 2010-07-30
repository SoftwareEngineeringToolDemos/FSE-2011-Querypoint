var EXPORTED_SYMBOLS = ["loadModule"];

loadModule = function(QPFBUG)
{
    QPFBUG.FBTrace = QPFBUG.traceConsoleService.getTracer("extensions.firebug");

    //--------------------------------- Lang --------------------------------
    //this class contains basic needed functions at language level

    QPFBUG.Lang = {

        Cc : Components.classes,
        Ci : Components.interfaces,
        jsdIStackFrame : Components.interfaces.jsdIStackFrame,

        assert : function(bool, object){
            if (!bool){
                throw (" Assertion Error : " + assert + ", " + object);// +  this.printStackTrace());//( + object);
            }
        },

        currentTimeMillis : function(){
            return (new Date()).getTime();
        },

    };
}

