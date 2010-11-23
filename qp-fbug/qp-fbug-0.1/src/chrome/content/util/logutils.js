var EXPORTED_SYMBOLS = ["loadModule"];

loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    //--------------------------------- LogUtils --------------------------------

    QPFBUG.Classes.LogUtils = {

        wrappedClasses : [],

        logClassesFunctionCalls: function(list){
            for (var i=0 ; i<list.length ; i++){
                    LogUtils.logClassFunctionCalls(list[i]);
            }
        },

        logClassFunctionCalls: function(className)
        {
            if (arrayContainsObject(LogUtils.wrappedClasses, className))
                return;
            var class = QPFBUG.Classes[className];
            if (!class){
                log("there is no class with this name : " + className);
                return;
            }

            LogUtils.logDataFunctionCalls(className, class);
            if (class.prototype)
                LogUtils.logDataFunctionCalls(className, class.prototype);

            LogUtils.wrappedClasses.push(className);
        },

        logDataFunctionCalls: function(objName, obj, functionName) //todo instead of getting one function name get a list
        {
            for (var p in obj)
            {
                if (typeof(obj[p]) == "function" && obj[p] )
                {
                    var obj_p = obj[p];           //p & obj_p changes in the loop
                    if (!functionName || functionName == p)
                        obj[p] = function(fName, f){ // so by calling another function we fix them for the internal function
                                                     //todo parse f.toSource() and pass arguments names
                            return function(){
                                    var caller = arguments.callee.caller;
                                    var thread = LogUtils.enterThread(caller, f);
                                    var space = LogUtils.getPre(thread);
                                    var argumentsCopy = cloneArray(arguments); //because "arguments" is not longer available when function returns
                                    QPFBUG.Classes.Lang.log(space + objName + " - " + fName , {object:this, arguments:argumentsCopy});
                                    var rv = f.apply(this, arguments);
                                    if (rv)
                                        QPFBUG.Classes.Lang.log(space + objName + " - " + fName + " returns." , rv);
                                    LogUtils.exitThread(thread, caller);
                                    return rv;
                            }
                        }(p, obj_p);
                };
            };
        },

        threads : [],

        //todo there is one assumption which is not always true
        // That is the currentObject is not the same in two threads

        getThread: function(callee){
            for (var i=0 ; i<LogUtils.threads.length ; i++){
                var thread = LogUtils.threads[i];
                if (thread.lastCallee == callee){
                    return thread;
                }
            }
            return null;
        },

        enterThread: function(caller, callee){
            var thread = LogUtils.getThread(caller);
            if (thread){
                thread.lastCallee = callee;
                thread.depth++;
                thread.messageNo++;
                return thread;
            }
            thread = {lastCallee: callee, depth: 1, messageNo: 1};
            LogUtils.threads.push(thread);
            return thread;
        },

        exitThread: function(thread, caller){
            thread.depth --;
            if (thread.depth == 0 || !caller)
            {
                arrayRemoveObject(LogUtils.threads, thread);
                return;
            }
            thread.lastCallee = caller;
        },


        spaces: {},
        
        getPre: function(thread){
            var depth = thread.depth;
            if (depth>100)  //larger spaces won't be useful
                depth = 100;

            if (thread.messageNo == 1)
                return "->[1]";
            if (!LogUtils.spaces[depth]){
                var space = "";
                for (var i=0 ; i<depth-1 ; i++){
                    space +="---|";
                }
                LogUtils.spaces[depth] = space;
            }

            var messageNo = thread.messageNo;
            return LogUtils.spaces[depth] + "[" + messageNo + "]";
        },

        log: function(caller, message, obj)
        {

            var thread = LogUtils.getThread(caller);
            var pre = "";
            if (thread){
                thread.messageNo++;
                pre = LogUtils.getPre(thread);
            }

            var message = pre + message;

            FBTrace.sysout(message, obj);
        },




    };

}}

}

