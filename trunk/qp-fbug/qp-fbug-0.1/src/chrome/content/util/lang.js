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
                throw (" Assertion Error : " + bool + ", " + object);// +  this.printStackTrace());//( + object);
            }
        },

        currentTimeMillis : function(){
            return (new Date()).getTime();
        },

        log: function(message, obj)
        {
            if (FBTrace.DBG_QUERYPOINT)
                LogUtils.log(arguments.callee.caller, message, obj);
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
                                Lang.log("Error : " + exc, exc);
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
            if ( array.indexOf ) {
			    if (array.indexOf(object)>=0)
			        return true;
			    return false;
            }

            for (var i=0 ; i<array.length ; i++){
                if (array[i] == object){
                    return true;
                }
            }
            return false;
        },

        cloneObject: function(object){
            ///todo consider the case where object is an array
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

        //bind function adds the args at the end or function args but bindFirst insert them at the head.
        bindAtHead: function()  // fn, thisObject, args => thisObject.fn(arguments, args);
        {
           var args = Lang.cloneArray(arguments), fn = args.shift(), object = args.shift();
           return function bind() { return fn.apply(object, Lang.arrayInsert(Lang.cloneArray(args), args.length, arguments)); }
        },


        callAll: function(functions){     //arguments -: [functions, args]
            var args = Lang.cloneArray(arguments);
            var functions = args.shift();
            if (!functions || !functions.length)
                return;
            var returnValue;
            for (var i=0 ; i<functions.length ; i++){
                returnValue = functions[i].apply(this, args);  //"this" is not necessary!
            }
            return returnValue;
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
            if (!value)
                return value;
            if (value.stack && value.message && (value.name=="ReferenceError" || value.name=="TypeError")){ //Exception
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

        notCollected: {value: "[NOT_COLLECTED]"},

        copyObject: function(object, depth){
            Monitor.getInstance().counterCopyObject++;
            if (object === null)
                return null;
            if (object === undefined)
                return undefined;

            var type = typeof(object);

            if (type !== "object")
                return object;
            else {
                if (depth <= 0)
                    return this.notCollected;

                var copy = {};
                for (p in object){
                    if (p === "___qpfbug_objectId___" || p === "___qpfbug_watchRequests___")  //ignore these variables
                        continue;
                    try {
                        type = typeof(object[p]);
                        copy[p] = this.copyObject(object[p], depth-1);
                    } catch(exc) {
                        // Access to some objects will fail, that's life in Mozilla land
                        // Lang.log("Error in copyObject(): " + type + " - " + exc.message, exc);
                        // break;
                    }
                }
                return copy;
            }
            return object; 
        },

        wait: function(millis)
        {
            var time = Lang.currentTimeMillis();
            var curDate = null;

            do {
                curDate = Lang.currentTimeMillis();
            }while(curDate-time < millis);
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

        clearNode : QPFBUG.FBL.clearNode,

        hasClass : QPFBUG.FBL.hasClass,

        createMenuItem : QPFBUG.FBL.createMenuItem,

        $ : QPFBUG.FBL.$,

        FBTrace: QPFBUG.traceConsoleService.getTracer("extensions.firebug"),
    };
}
}

