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

        bind: function(){ // fn, thisObject, args => thisObject.fn(args, arguments);
           var args = this.cloneArray(arguments), fn = args.shift(), object = args.shift();
           return function bind() { return fn.apply(object, arrayInsert(cloneArray(args), 0, arguments)); }
        },

        bindFixed: function(){ // fn, thisObject, args => thisObject.fn(args);
            var args = this.cloneArray(arguments), fn = args.shift(), object = args.shift();
            return function() { return fn.apply(object, args); }
        },

        extend: function(l, r){ //extends one object from another
            var newOb = {};
            for (var n in l)
                newOb[n] = l[n];
            for (var n in r)
                newOb[n] = r[n];
            return newOb;
        },

        trace: function(message, obj)
        {
            QPFBUG.FBTrace.sysout(message, obj);
        },

        cloneArray: function(array, fn)
        {
           var newArray = [];

           if (fn)
               for (var i = 0; i < array.length; ++i)
                   newArray.push(fn(array[i]));
           else
               for (var i = 0; i < array.length; ++i)
                   newArray.push(array[i]);

           return newArray;
        },

        wrapFunctionsWithTryCatch: function(obj)
        {
            for (var p in obj)
            {
                if (typeof(obj[p]) == "function" && obj[p] )
                {
                    QPFBUG.Classes.Lang.trace("+++++++++++++++++");
                    var obj_p = obj[p];           //p & obj_p changes in the loop
                    obj[p] = function(fName, f){ // so by calling another function we fix them for the internal function
                        return function(){
                            try{
                                return f.apply(obj, arguments);
                            }catch(exc){
                                QPFBUG.Classes.Lang.trace("Error : " + exc, exc);
                            }
                        }
                    }(p, obj_p);
                };
            };
        },

    };

}

