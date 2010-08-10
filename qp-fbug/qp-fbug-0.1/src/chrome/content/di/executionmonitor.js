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

            start: function(callBack, propertyName, frame, type, rv){
                this.steppingDriver = DebugService.getInstance().getSteppingDriver(this, this.context);
                this.startScriptTag = frame.script.tag;
                this.startPC = frame.pc;
                this.startStackFrameDepth = callStackDepth(frame);
                this.callBack = callBack;
                this.propertyName = propertyName;
                this.isStopped = false;

                trace("source: " + frame.script.functionSource);
                this.scriptAnalyzer = new ScriptAnalyzer(frame.script.functionSource);
                this.monitorRefs = this.scriptAnalyzer.getRefsToCreatedObjects(true);

                this.monitorRefValues = [];
                this.monitorRefGotNewValue = [];
                for (var i=0 ; i<this.monitorRefs.length ; i++){
                    var monitorRef = this.monitorRefs[i];
                    this.monitorRefGotNewValue.push(false);
                    var refValue = evalInFrame(frame, monitorRef);
                    this.monitorRefValues.push(refValue);
                }
                this.steppingDriver.step(3, this.startScriptTag, frame.line, this.startPC); //todo correct line number
            },

            stop: function(){
                this.isStopped = true;
                DebugService.getInstance().releaseSteppingDriver(this.steppingDriver);
            },

            //todo
            // First: In this version execution monitor may not stop!
            // in cases that the execution goes out of the context, and there
            // are still some remained items in the monitorRef list, the stepping
            // driver won't be stopped.
            //
            // Second: some cases that a variable gets new value more than once
            // in the creation line are not supported.
            onStep: function(frame, type, rv, stackDepthChange)
            {
                //trace(this.isStopped + " -+-+-+" + frame.script.fileName + " " +  frame.script.pcToLine(frame.pc, Ci.jsdIScript.PCMAP_SOURCETEXT) + " " + frame.pc + "------- " + this.context.uid +"----" + "  "+ stackDepthChange + " "+ callStackDepth(frame));
                if (stackDepthChange<0){
                    this.stop();
                    return;
                }

                for (var i=0 ; i<this.monitorRefs.length ; i++){
                    var monitorRef = this.monitorRefs[i];
                    var refValue = evalInFrame(frame, monitorRef);
                    if (refValue != this.monitorRefValues[i]){
                        this.monitorRefValues[i] = refValue;
                        if (typeof(refValue) == "object")
                        {
                            var objectId = DebugService.getInstance().getNextJSObjectId();
                            // Code for Gecko 2 (fireforx 4)
                            //trace(Object.getOwnPropertyNames(Object).sort().join(","));
                            //Object.defineProperty(refValue, "__QPFBUG_ID", { value: objectId });
                            // code for firefox 3.5+
                            //refValue.__defineGetter__("__QPFBUG_ID", function(){return objectId;})
                            this.monitorRefGotNewValue[i] = true;
                            refValue.watch(this.propertyName, bind(this.callBack, this, refValue));
                        }
                    }
                }
                var shouldContinue = false;
                for (var i=0 ; i<this.monitorRefs.length ; i++){
                    if (!this.monitorRefGotNewValue[i])
                        shouldContinue = true;
                }
                //trace("()()()()()() " + shouldContinue, this.monitorRefGotNewValue);
                if (!shouldContinue){
                    this.stop();
                    return;
                }

                this.lastScriptTag = frame.script.tag;
                this.lastPC = frame.pc;
                if (!this.isStopped){ //is this check necessary?
                    this.steppingDriver.step(3, this.lastScriptTag, 0, this.lastPC );
                }
            },

        };

        return constructor;
    }();

}}

};
