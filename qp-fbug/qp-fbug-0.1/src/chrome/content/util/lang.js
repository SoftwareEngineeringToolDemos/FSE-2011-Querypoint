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
           var args = cloneArray(arguments), fn = args.shift(), object = args.shift();
           return function bind() { return fn.apply(object, arrayInsert(cloneArray(args), 0, arguments)); }
        },

        bindFixed: function(){ // fn, thisObject, args => thisObject.fn(args);
            var args = cloneArray(arguments), fn = args.shift(), object = args.shift();
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

    };
}

