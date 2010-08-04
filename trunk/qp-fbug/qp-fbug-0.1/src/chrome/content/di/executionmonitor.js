var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //--------------------------- ExecutionMonitor ----------------------
    owner.ExecutionMonitor = function(){

        // state : listens to interrupt
        // state : listens to function events

        var constructor = function(context, frame, type, rv ){
             this.startContext = context;
             this.startScriptTag = frame.script.tag;
             this.startPC = frame.pc;

        };

        constructor.prototype = {

            start: function(){
                this.steppingDriver = new SteppingDriver(DebugService.getInstance(), this);
                this.steppingDriver.step(0, this.startScriptTag, 0, this.startPC); //todo correct line number
            },

            onStep: function(steppingDriver, stepMode, context, frame, type, rv)
            {
                trace("-+-+-+" + frame.script.fileName + " " +  frame.script.pcToLine(frame.pc, Ci.jsdIScript.PCMAP_SOURCETEXT) + " " + frame.pc);
                this.lastScriptTag = frame.script.tag;
                this.lastPC = frame.pc;
                this.steppingDriver.step(0, this.lastScriptTag, 0, this.lastPC );
            },

//            //to find new created objects in a line
//            inStepping: function(context, frame, type, rv){
//                context.qpfbug.stepping.currentscript;
//                context.qpfbug.stepping.assignees;
//
//                var currentScript = context.qpfbug.stepping.currentscript;
//                var depth = context.qpfbug.stepping.callstackdepth;
//                trace('Depth : ' + depth + " " + this.getCallStackDepth(frame));
//
//                if (!currentScript || (frame.script.tag != currentScript.tag))
//                {
//                    context.qpfbug.isStepping = false;
//                    return;
//                }
////                if (frame.line != context.qpfbug.stepping.searchLine)
////                {
////                    context.qpfbug.isStepping = false;
////                    return;
////                }
//
//
//                context.qpfbug.stepping = true;
//                context.qpfbug.stepping.stepCount = 0;
//
//                var scriptAnalyzer = context.qpfbug.stepping.scriptAnalyzer;
//                var refs = context.qpfbug.stepping.refs;
//                var refValues = context.qpfbug.stepping.refValues;
//                var result;
//
//                if (!refs)
//                {
//                    currentScript = frame.script;
//                    scriptAnalyzer = context.qpfbug.stepping.scriptAnalyzer =
//                        new ScriptAnalyzer(currentScript.functionSource);
//
//                    refs = context.qpfbug.stepping.refs =
//                        scriptAnalyzer.getRefsToCreatedObjects(true);
//
//                    trace("<<<<<<<<  "+ refs.join(" , "));
//                    refValues = context.qpfbug.stepping.refValues = [];
//
//                    for (let k=0 ; k<refs.length ; k++)
//                    {
//                        trace("<<<<<<<<" + refs[k]);
//                        refValue = null;
//                        result = {};
//                        try{
//                            frame.eval(ref[k], "", 1, result)
//                            refValue = result.value;
//                        }catch(e)
//                        {
//                        }
//                        trace("<<<<<<<<", refValue);
//                        refValues[k] = refValue;
//                    }
//                }else{
//                    for (let k=0 ; k<refs.length ; k++)
//                    {
//                        trace("<<<<<<<<" + refs[k]);
//                        refValue = null;
//                        result = {};
//                        try{
//                            frame.eval(ref[k], "", 1, result)
//                            refValue = result.value;
//                        }catch(e)
//                        {
//                        }
//                        if (refValue && refValues[k] != refValue)
//                        {
//                            if (typeof(refValue) == "object")
//                            {
//                                refValue.watch(context.qpfbug.stepping.propertyToWatch,
//                                   function (id, oldval, newval) {
//                                      trace("o." + id + " changed from " + oldval + " to " + newval);
//                                      return newval;
//                                   });
//                            }
//                        }
//                    }
//                }
                //step_into 2
//                this.fbs.step(2, context.stoppedFrame, context.qpfbug.firefoxWindow.Firebug.Debugger);
//                this.fbs.startStepping();
//
//            },

        };

        return constructor;
    }();

}}

};
