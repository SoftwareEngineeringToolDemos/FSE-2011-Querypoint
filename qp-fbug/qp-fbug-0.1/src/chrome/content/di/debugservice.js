var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

    var owner = QPFBUG.Classes;

    //--------------------------- DebugService ----------------------
    owner.DebugService = function(){

        var constructor = function(fbs){
            this.fbs = fbs;
            this.dataStore = new DataStore();
        };

        constructor.prototype =
        {
            // TODO: in cases that owner object created in another context this request
            // will not be effective, we need to consider all contexts to make sure
            // that we don't miss anything.
            //
            // url & lineNo that the object is created there.
            createModificationWatchpointRequest: function(contextTag, ownerCreationURL, 
                                                          ownerCreationLineNo, propertyName){
            },

            createBreakpointRequest: function(contextTag, url, lineNo ){

            },

            onInterrupt: function(frame, type, rv){
                var context = this.getContextFromFrame(this.fbs, frame);
                if (!context || !context.qpfbug.stepping) // it is not in any context that manager knows
                    return false;

                QPFBUG.FBTrace.sysout("******* " + frame.line + "," +frame.pc +  " , " + frame.isConstructing +" , "+ frame.script.functionSource, frame);

                if (context.qpfbug.isStepping)
                {
                    this.inStepping(context, frame, type, rv);
                }
                return false;


            },

            onBreakpoint: function(frame, type, rv){
                return false;
            },

            onFunction: function(frame, type, rv){
                var context = this.getContextFromFrame(this.fbs, frame);
                if (!context || !context.qpfbug.stepping) // it is not in any context that manager knows
                    return false;

                QPFBUG.FBTrace.sysout("******* " + frame.line + "," +frame.pc +  " , " + frame.isConstructing +" , "+ frame.script.functionSource, frame);

                if (context.qpfbug.isStepping)
                {
                    this.inStepping(context, frame, type, rv);
                }
                return false;


            },

            //to find new created objects in a line
            inStepping: function(context, frame, type, rv){
                context.qpfbug.stepping.currentscript;
                context.qpfbug.stepping.assignees;

                var currentScript = context.qpfbug.stepping.currentscript;
                var depth = context.qpfbug.stepping.callstackdepth;
                QPFBUG.FBTrace.sysout('Depth : ' + depth + " " + this.getCallStackDepth(frame));

                if (!currentScript || (frame.script.tag != currentScript.tag))
                {
                    context.qpfbug.isStepping = false;
                    return;
                }
//                if (frame.line != context.qpfbug.stepping.searchLine)
//                {
//                    context.qpfbug.isStepping = false;
//                    return;
//                }


                context.qpfbug.stepping = true;
                context.qpfbug.stepping.stepCount = 0;

                var scriptAnalyzer = context.qpfbug.stepping.scriptAnalyzer;
                var refs = context.qpfbug.stepping.refs;
                var refValues = context.qpfbug.stepping.refValues;
                var result;

                if (!refs)
                {
                    currentScript = frame.script;
                    scriptAnalyzer = context.qpfbug.stepping.scriptAnalyzer =
                        new ScriptAnalyzer(currentScript.functionSource);

                    refs = context.qpfbug.stepping.refs =
                        scriptAnalyzer.getRefsToCreatedObjects(true);

                    QPFBUG.FBTrace.sysout("<<<<<<<<  "+ refs.join(" , "));
                    refValues = context.qpfbug.stepping.refValues = [];

                    for (let k=0 ; k<refs.length ; k++)
                    {
                        QPFBUG.FBTrace.sysout("<<<<<<<<" + refs[k]);
                        refValue = null;
                        result = {};
                        try{
                            frame.eval(ref[k], "", 1, result)
                            refValue = result.value;
                        }catch(e)
                        {
                        }
                        QPFBUG.FBTrace.sysout("<<<<<<<<", refValue);
                        refValues[k] = refValue;
                    }
                }else{
                    for (let k=0 ; k<refs.length ; k++)
                    {
                        QPFBUG.FBTrace.sysout("<<<<<<<<" + refs[k]);
                        refValue = null;
                        result = {};
                        try{
                            frame.eval(ref[k], "", 1, result)
                            refValue = result.value;
                        }catch(e)
                        {
                        }
                        if (refValue && refValues[k] != refValue)
                        {
                            if (typeof(refValue) == "object")
                            {
                                refValue.watch(context.qpfbug.stepping.propertyToWatch,
                                   function (id, oldval, newval) {
                                      QPFBUG.FBTrace.sysout("o." + id + " changed from " + oldval + " to " + newval);
                                      return newval;
                                   });
                            }
                        }
                    }
                }
                //step_into 2
                this.fbs.step(2, context.stoppedFrame, context.qpfbug.firefoxWindow.Firebug.Debugger);
                this.fbs.startStepping();

            },



        };

        constructor.getInstance = function(fbs){
            if (!QPFBUG.debugService)
            {
                QPFBUG.debugService = new DebugService(fbs);
            }
            return QPFBUG.debugService;
        };

        return constructor;
    }();

}}

};
