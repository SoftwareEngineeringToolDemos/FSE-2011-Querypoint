var EXPORTED_SYMBOLS = ["loadModule"];

loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){

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
            TraceUtils.trace(arguments.callee.caller, message, obj);
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

        arrayRemoveObject: function(array, object)
        {
            for (var i=0 ; i<array.length ; i++){
                if (array[i] == object){
                    array.splice(i, 1);
                    break;
                }
            }
        },

        arrayContainsObject: function(array, object)
        {
            for (var i=0 ; i<array.length ; i++){
                if (array[i] == object){
                    return true;
                }
            }
            return false;
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

        evalInFrame: function(frame, expr){
            var value = null;
            var result = {};
            try{
                frame.eval(expr, "", 1, result);
                value = result.value;
            }catch(e){}
            if (!value)
                return null;
            value = value.getWrappedValue();
            if (value.stack && value.message && value.name=="ReferenceError"){ //Exception
                return null;
            }
            return value;
        },

        callStackDepth: function(frame)
        {
            var depth = 0;
            while (frame){
                depth++;
                frame = frame.callingFrame;
            }
            return depth;
        },

        getFirebugService: function(){
            return QPFBUG.fbs;
        },

        extendFromParent : function(object, parent)
        {
            for (var p in parent)
                if (!object[p])
                    object[p] = parent[p];
        },

        copyObject: function(object, depth){
            if (object == null || depth ==0)
                return null;

            if (typeof(object) == "object")
            {
                var copy = {};
                for (p in object){
                    copy[p] = this.copyObject(object[p], depth-1);
                }
                return copy;
            }
            return object;
        },

        //--------------------------------- from firebug lib.js -----------------------------
        bind: QPFBUG.FBL.bind,

        bindFixed: QPFBUG.FBL.bindFixed,

        extend: QPFBUG.FBL.extend,

        cloneArray: QPFBUG.FBL.cloneArray,

        arrayInsert: QPFBUG.FBL.arrayInsert,

        getRootWindow : QPFBUG.FBL.getRootWindow,

        normalizeURL : QPFBUG.FBL.normalizeURL,

        unwrapObject : QPFBUG.FBL.unwrapObject,

        unwrapIValue : QPFBUG.FBL.unwrapIValue,

        unwrapIValueObject : QPFBUG.FBL.unwrapIValueObject,

        getCorrectedStackTrace : QPFBUG.FBL.getCorrectedStackTrace,

        $ : QPFBUG.FBL.$,

        FBTrace: QPFBUG.traceConsoleService.getTracer("extensions.firebug"),        
    };
}
}

