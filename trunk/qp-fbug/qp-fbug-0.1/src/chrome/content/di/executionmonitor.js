var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //--------------------------- ExecutionMonitor ----------------------
    // an object creation execution monitor
    owner.ExecutionMonitor = function(){

        var constructor = function(context){
            this.context = context;
            this.isStopped = false;
            this.isMonitoring = false;
        };

        constructor.prototype = {

            start: function(callback, propertyName, frame, type, rv){
                this.steppingDriver = DebugService.getInstance().getSteppingDriver(this, this.context);
                this.startScriptTag = frame.script.tag;
                this.startPC = frame.pc;
                this.scriptAnalyzer = new ScriptAnalyzer(frame.script.functionSource);
                var refs = this.scriptAnalyzer.getRefsToCreatedObjects(true);
                this.callback = callback;
                this.propertyName = propertyName;
                debugger;
                if (!refs[0])
                    trace("Error");
                this.monitorRef = refs[0];
                this.isStopped = false;
                trace("-----------------------------------" + this.monitorRef +" "+this.propertyName);
                this.steppingDriver.step(3, this.startScriptTag, frame.line, this.startPC); //todo correct line number
            },

            stop: function(){
                this.isStopped = true;
                DebugService.getInstance().releaseSteppingDriver(this.steppingDriver);
            },

            onStep: function(frame, type, rv)
            {
                trace(this.isStopped + " -+-+-+" + frame.script.fileName + " " +  frame.script.pcToLine(frame.pc, Ci.jsdIScript.PCMAP_SOURCETEXT) + " " + frame.pc + "------- " + this.context.uid);
                var refValue = null;
                var result = {};
                try{
                    frame.eval(this.monitorRef, "", 1, result)
                    refValue = result.value;
                }catch(e)
                {
                }
                if (refValue){
                    if (refValue instanceof Error){
                        trace("Error!" , refValue)
                    }else{
                        trace("<<<<<<<<", refValue.getWrappedValue());
                        refValue.getWrappedValue().watch(this.propertyName, this.callback);
                    }
                }

                if (frame.script.pcToLine(frame.pc, Ci.jsdIScript.PCMAP_SOURCETEXT) == 19 && frame.pc == 35)
                {
                    this.stop();
                }
                this.lastScriptTag = frame.script.tag;
                this.lastPC = frame.pc;
                if (!this.isStopped){
                    this.steppingDriver.step(3, this.lastScriptTag, 0, this.lastPC );
                }
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
