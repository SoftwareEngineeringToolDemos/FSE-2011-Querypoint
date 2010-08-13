var EXPORTED_SYMBOLS = ["loadModule"];

loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    //--------------------------------- TraceUtils --------------------------------

    QPFBUG.Classes.TraceUtils = {

        traceClassFunctionCalls: function(className)
        {
            var class = QPFBUG.Classes[className];
            if (!class){
                trace("there is no class with this name : " + className);
                return;
            }

            TraceUtils.traceObjectFunctionCalls(className, class.prototype);
        },

        traceObjectFunctionCalls: function(objName, obj, functionName) //todo instead of getting one function name get a list
        {
            for (var p in obj)
            {
                if (typeof(obj[p]) == "function" && obj[p] )
                {
                    var obj_p = obj[p];           //p & obj_p changes in the loop
                    if (!functionName || functionName == p)
                        obj[p] = function(fName, f){ // so by calling another function we fix them for the internal function
                            return function(){
                                    var caller = arguments.callee.caller;
                                    var thread = TraceUtils.enterThread(caller, f);
                                    var space = TraceUtils.getPre(thread);
                                    QPFBUG.Classes.Lang.trace(space + objName + " - " + fName , arguments);
                                    return f.apply(this, arguments);
                                    TraceUtils.exitThread(thread, caller);
                            }
                        }(p, obj_p);
                };
            };
        },

        threads : [],

        //todo there is one assumption which is not always true
        // That is the currentObject is not the same in two threads

        getThread: function(callee){
            for (var i=0 ; i<TraceUtils.threads.length ; i++){
                var thread = TraceUtils.threads[i];
                if (thread.lastCallee == callee){
                    return thread;
                }
            }
            return null;
        },

        enterThread: function(caller, callee){
            var thread = TraceUtils.getThread(caller);
            if (thread){
                thread.lastCallee = callee;
                thread.depth++;
                thread.messageNo++;
                return thread;
            }
            thread = {lastCallee: callee, depth: 1, messageNo: 1};
            TraceUtils.threads.push(thread);
            return thread;
        },

        exitThread: function(thread, caller){
            thread.depth --;
            if (depth == 0 || !caller)
            {
                arrayRemoveObject(TraceUtils.threads, thread);
                return;
            }
            thread.lastCallee = caller;
        },


        spaces: {},
        
        getPre: function(thread){
            var depth = thread.depth;
            if (depth>100)  //larger spaces won't be useful
                depth = 100;
            if (!TraceUtils.spaces[depth]){
                var space = "";
                for (var i=0 ; i<depth ; i++){
                    space +="----";
                }
                TraceUtils.spaces[depth] = space;
            }

            var messageNo = thread.messageNo;
            return TraceUtils.spaces[depth] + "[" + messageNo + "]";
        },

        trace: function(caller, message, obj)
        {

            var thread = TraceUtils.getThread(caller);
            var pre = "";
            if (thread){
                thread.messageNo++;
                pre = TraceUtils.getPre(thread);
            }

            var message = pre + message;

            FBTrace.sysout(message, obj);
        },




    };

}}

}

