var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //--------------------------- ExecutionMonitor ----------------------
    // an object creation execution monitor
    __owner.ExecutionMonitor = function(){

        var constructor = function(context){
            this.context = context;
            this.isStopped = false;
            this.isMonitoring = false;
        };

        constructor.prototype = {

            start: function(callBack, propertyName, frame, type, rv){
                trace("ExecutionMonitor starts: " + frame.script.fileName + " " + frame.line);
                this.steppingDriver = DebugService.getInstance().getSteppingDriver(this.context);
                this.fileName = frame.script.fileName;
                this.line = frame.line;
                this.startScriptTag = frame.script.tag;
                this.startPC = frame.pc;
                this.startStackFrameDepth = callStackDepth(frame);
                this.callBack = callBack;
                this.propertyName = propertyName;
                this.isStopped = false;

                this.endPC = -1;
//                if (frame.line === frame.script.baseLineNumber +frame.script.lineExtent -1) //it is the last line
//                {
//                    trace("The end line : " + frame.line);
//                }else{
//                    trace("---line--- " + frame.script.pcToLine(frame.pc, Ci.jsdIScript.PCMAP_SOURCETEXT));
//                    var pcToLine_pp = frame.script.pcToLine(frame.pc, Ci.jsdIScript.PCMAP_PRETTYPRINT);
//
//                    //find next executable line in pp
//                    var toAdd = 1;
//                    while (!frame.script.isLineExecutable(pcToLine_pp+toAdd, Ci.jsdIScript.PCMAP_PRETTYPRINT)){
//                        toAdd++;
//                    }
//
//                    var nextLinePC_pp = frame.script.lineToPc(pcToLine_pp + toAdd , Ci.jsdIScript.PCMAP_PRETTYPRINT);
//                    var nextLine = frame.script.pcToLine(nextLinePC_pp , Ci.jsdIScript.PCMAP_SOURCETEXT);
//                    trace("---line--- " + pcToLine_pp + " " + nextLinePC_pp + " " + nextLine);
//
//                    this.endPC = nextLinePC_pp;
//                    this.endPC = 35;
//                }

                trace("--------script ---- \n", frame.script.functionSource);
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
                this.steppingDriver.step(this, 3, this.startScriptTag, this.line, this.startPC); //todo correct line number
            },

            stop: function(){
                this.isStopped = true;
                DebugService.getInstance().releaseSteppingDriver(this.steppingDriver);
                trace("ExecutionMonitor ends: " + this.fileName + " " + this.line);
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
//                    trace("assignee: " + monitorRef);
                    var refValue = evalInFrame(frame, monitorRef);
                    if (refValue != this.monitorRefValues[i]){
                        this.monitorRefValues[i] = refValue;
                        if (typeof(refValue) == "object")
                        {
                            var objectId = refValue["___qpfbug_objectId___"];
                            //JSD doesn't give us the watch call back then we need to keep it here.
                            var watchCallbacks = refValue["___qpfbug_watch___"]; // list of callbacks
                            var watchCallback = bindAtHead(this.callBack, this, refValue);

                            if (!objectId){ //no id for this object
                                objectId = DebugService.getInstance().getNextJSObjectId();
                                // Code for Gecko 2 (fireforx 4)
                                //trace(Object.getOwnPropertyNames(Object).sort().join(","));
                                //Object.defineProperty(refValue, "__QPFBUG_ID", { value: objectId });
                                // code for firefox 3.5+
                                //refValue.__defineGetter__("__QPFBUG_ID", function(){return objectId;})
                                this.monitorRefGotNewValue[i] = true;
    //                            var oldCallBack = refValue.unwatch(this.propertyName);
    //                            if (!!oldCallBack)
    //                                trace("OldCallBack : ", oldCallBack);

                                refValue["___qpfbug_objectId___"] = objectId;
                                watchCallbacks = [watchCallback];
                            }else{ //the object has id and therefore another watch callback
                                watchCallbacks.push(watchCallback);
                            }
                            refValue["___qpfbug_watch___"] = watchCallbacks;
                            refValue.watch(this.propertyName, bindAtHead(callAll, this, watchCallbacks));
                            trace(monitorRef + ".watch(" + this.propertyName + ") is called.");
                        }
                    }
                }

                var shouldContinue = false;
                for (var i=0 ; i<this.monitorRefs.length ; i++){
                    if (!this.monitorRefGotNewValue[i])
                        shouldContinue = true;
                }


//                var nextPCLine = frame.script.pcToLine(frame.pc+1, Ci.jsdIScript.PCMAP_SOURCETEXT);
                //TODO IT is not a complet solution , it should be the last pc//there is no next pc so the current one is the last one //TODO be care full about loops!!!
                if ( frame.line === frame.script.baseLineNumber +frame.script.lineExtent -1 || frame.pc === this.endPC ) //the last line
                    shouldContinue = false
//                trace("shouldContinue: " + shouldContinue + " " + frame.pc + " " + nextPCLine + " " +nextPCLine2+" "+nextPCLine10);

                if (!shouldContinue){
                    this.stop();
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
