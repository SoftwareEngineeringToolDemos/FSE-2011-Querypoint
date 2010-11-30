var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //--------------------------- ObjectCreationTracker ----------------------
    // an object creation execution monitor
    __owner.ObjectCreationTracker = function(){

        var constructor = function(context){
            this.context = context;
            this.isStopped = false;
            this.isMonitoring = false;
        };

        constructor.prototype = {

            start: function(callBack, eventRequests, frame, type, rv){
                log("ObjectCreationTracker starts : " + frame.script.fileName + "@" + frame.line);
                this.steppingDriver = DebugService.getInstance().getSteppingDriver(this.context);
                this.fileName = frame.script.fileName;
                this.startLine = frame.line;
                this.startScriptTag = frame.script.tag;
                this.startPC = frame.pc;
                this.startStackFrameDepth = callStackDepth(frame);
                this.callBack = callBack;
                this.eventRequests = eventRequests;
                this.isStopped = false;

                this.endPC = -1;

                this.scriptAnalyzer = new ScriptAnalyzer(frame.script.functionSource);
                this.monitorRefs = this.scriptAnalyzer.getRefsToCreatedObjects(true);
                this.monitorRefValues = [];
                this.monitorRefGotNewValue = [];
                for (var i=0 ; i<this.monitorRefs.length ; i++){
                    var monitorRef = this.monitorRefs[i];
                    this.monitorRefGotNewValue.push(false);
                    log("--------monitor ref ---- "+monitorRef);
                    var refValue = evalInFrame(frame, monitorRef);
                    this.monitorRefValues.push(refValue);
                }
                this.steppingDriver.step(this, 3, this.startScriptTag, this.startLine, this.startPC);
            },

            stop: function(frame){
                this.isStopped = true;
                DebugService.getInstance().releaseSteppingDriver(this.steppingDriver);
                if (frame)
                    log("ObjectCreationTracker ends : " + this.fileName + "-" + this.startLine + "@" + frame.line);
                else
                    log("ObjectCreationTracker ends : " + this.fileName + "-" + this.startLine);
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
                if (stackDepthChange<0){
                    this.stop(frame);
                    return;
                }

                for (var i=0 ; i<this.monitorRefs.length ; i++){
                    var monitorRef = this.monitorRefs[i];
                    var refValue = evalInFrame(frame, monitorRef);
                    if (refValue != this.monitorRefValues[i]){
                        this.monitorRefValues[i] = refValue;
                        if (typeof(refValue) == "object")
                        {
                            var objectId = DebugService.getInstance().getObjectId(refValue, true);
                            this.monitorRefGotNewValue[i] = true;
                            log(monitorRef + " with id '" + objectId + "' was created.");
                            this.callBack(this.eventRequests, refValue, frame, type, rv);
                        }
                    }
                }

                var shouldContinue = false;
                for (var i=0 ; i<this.monitorRefs.length ; i++){
                    if (!this.monitorRefGotNewValue[i])
                        shouldContinue = true;
                }

                //TODO IT is not a complete solution , it should be the last pc//there is no next pc so the current one is the last one //TODO be care full about loops!!!
                if ( frame.line === frame.script.baseLineNumber +frame.script.lineExtent -1 || frame.pc === this.endPC || frame.pc < this.startPC ) //the last line  or start of the loop
                    shouldContinue = false

                if (!shouldContinue){
                    this.stop(frame);
                    return;
                }

                this.lastScriptTag = frame.script.tag;
                this.lastPC = frame.pc;
                if (!this.isStopped){ //is this check necessary?
                    this.steppingDriver.step(this, 3, this.lastScriptTag, 0, this.lastPC );
                }
            },

        };

        return constructor;
    }();

}}

};
