var EXPORTED_SYMBOLS = ["loadModule"];

loadModule = function(QPFBUG)
{
    QPFBUG.FBTrace = QPFBUG.traceConsoleService.getTracer("extensions.firebug");

    //--------------------------------- Lang --------------------------------
    //this class contains basic needed functions at language level

    QPFBUG.Classes.Lang = {

        Cc : Components.classes,
        Ci : Components.interfaces,

        assert : function(bool, object){
            if (!bool){
                throw (" Assertion Error : " + assert + ", " + object);// +  this.printStackTrace());//( + object);
            }
        },

        currentTimeMillis : function(){
            return (new Date()).getTime();
        },

        trace: function(message, obj)
        {
            QPFBUG.FBTrace.sysout(message, obj);
        },

        wrapFunctionsWithTryCatch: function(obj)
        {
            for (var p in obj)
            {
                if (typeof(obj[p]) == "function" && obj[p] )
                {
                    var obj_p = obj[p];           //p & obj_p changes in the loop
                    obj[p] = function(fName, f){ // so by calling another function we fix them for the internal function
                        return function(){
                            try{
                                return f.apply(this, arguments); //we use "this" instead of "obj" to make sure "this" is the same as normal execution.
                            }catch(exc){
                                QPFBUG.Classes.Lang.trace("Error : " + exc, exc);
                            }
                        }
                    }(p, obj_p);
                };
            };
        },

        traceFunctionCalls: function(objName, obj, functionName) //todo instead of getting one function name get a list
        {
            for (var p in obj)
            {
                if (typeof(obj[p]) == "function" && obj[p] )
                {
                    var obj_p = obj[p];           //p & obj_p changes in the loop
                    if (!functionName || functionName == p)
                        obj[p] = function(fName, f){ // so by calling another function we fix them for the internal function
                            return function(){
                                    QPFBUG.Classes.Lang.trace(objName + "-" + fName , arguments);
                                    return f.apply(this, arguments);
                            }
                        }(p, obj_p);
                };
            };
        },

        arrayRemoveObject: function(array, object)
        {
            for (var i=0 ; i<array.length ; i++){
                if (array[i] == object){
                    array.splice(i, 1);
                    break;
                }
            }
        },

        cloneObject: function(object){
            var copy = {};
            for (var i in object){
                copy[i] = object[i];
            }
            return copy;
        },

        numberOfObjectProperties: function(object){
            if (!object)
                return 0;
            var size = 0;
            for (var i in object){
                size++;
            }
            return size;
        },

        //--------------------------------- from firebug lib.js -----------------------------
        bind: QPFBUG.FBL.bind,

        bindFixed: QPFBUG.FBL.bindFixed,

        extend: QPFBUG.FBL.extend,

        cloneArray: QPFBUG.FBL.cloneArray,

        arrayInsert: QPFBUG.FBL.arrayInsert,

        getRootWindow : QPFBUG.FBL.getRootWindow,

        normalizeURL : QPFBUG.FBL.normalizeURL,
        
        FBTrace: QPFBUG.FBTrace,

    };

}

