var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //Note: There is one assumption behind current Stepping Driver implementation:
    //  It supports only one thread's interrupts/functions during one step.
    //  Considering restricting events to a context if we assume that
    //  a context only has one running thread, we can have the above assumption.
    //
    //--------------------------- Stepping Driver ----------------------
    __owner.SteppingDriver = function(){

        var constructor = function(id, context){
            this.id = id;
            this.steppingMode = SteppingDriver.STEP_MODES.STEP_MIN; //default
            this.debugService = DebugService.getInstance();
            this.context = context;
            this.registeredForInterrupts = false;
            this.registeredForFunctions = false;
            this.stepRecursion = 0;
            this.stackDepthChange = 0;
            this.isStopped = true;
        };

        constructor.prototype = {

            //stops at the first interrupt in this context
            stepSoon: function(stepHandler){
                this.stepHandler = stepHandler;
                this.isStopped = false;
                this.steppingMode = SteppingDriver.STEP_MODES.STEP_MIN; 
                this.registerAsInterruptListener();
                this.registerAsFunctionListener();
                this.startScriptTag = null;
                this.startLineNo = -1;
                this.startPC = -1;
                this.stepRecursion = 0;
                this.stackDepthChange = 0;
            },

            step: function(stepHandler, steppingMode, startScriptTag, startLineNo, startPC){
                this.stepHandler = stepHandler;
                this.isStopped = false;
                this.steppingMode = steppingMode;
                this.startScriptTag = startScriptTag;
                this.startLineNo = startLineNo;
                this.startPC = startPC;

                this.stepRecursion = 0;
                this.stackDepthChange = 0;

                with(SteppingDriver.STEP_MODES){
                switch (this.steppingMode){
                    case STEP_MIN:
                    case STEP_LINE:
                    case STEP_INTO:
                    case STEP_OVER: {
                        this.registerAsInterruptListener();
                        this.registerAsFunctionListener();
                        break;
                    }
                    case STEP_OUT: {
                        this.unRegisterAsInterruptListener();
                        this.registerAsFunctionListener();
                        break;
                    }
                }}
            },

            stop: function(){
                this.isStopped = true;
                this.unRegisterAsInterruptListener();
                this.unRegisterAsFunctionListener();
            },

            // -------------------------------- internal local functions --------------------
            registerAsInterruptListener: function(){
                if (this.isStopped)
                    return;
                if (!this.registeredForInterrupts){
                    this.debugService.registerInterruptListener(this);
                    this.registeredForInterrupts = true;
                }
            },

            registerAsFunctionListener: function(){
                if (this.isStopped)
                    return;
                if (!this.registeredForFunctions){
                    this.debugService.registerFunctionListener(this);
                    this.registeredForFunctions = true;
                }
            },

            unRegisterAsInterruptListener: function(){
                if (this.registeredForInterrupts){
                    this.debugService.unRegisterInterruptListener(this);
                    this.registeredForInterrupts = false;
                }
            },

            unRegisterAsFunctionListener: function(){
                if (this.registeredForFunctions){
                    this.debugService.unRegisterFunctionListener(this);
                    this.registeredForFunctions = false;
                }
            },
            
            onStep: function(context, frame, type, rv){
                this.stop();
                this.stepHandler.onStep(frame, type, rv, this.stackDepthChange);
            },

            // ------------------------------ functions called by debug service -------------
            onInterrupt: function(context, frame, type, rv){
//                log("steppingDriver : onInterrupt " + type + " " + frame.line+ " " +frame.pc + " "+ frame.script.baseLineNumber + " " +frame.script.lineExtent);
                if (context != this.context)
                    return;
                with(SteppingDriver.STEP_MODES){
                switch (this.steppingMode){
                    case STEP_MIN: {
                        this.onStep(context, frame, type, rv);
                        break;
                    }
                    //todo change it. It should check and if we are still in the same line just let the execution continue
                    case STEP_LINE: {
                        if (frame.line != this.startLineNo){ //only if it is a new line
                            this.onStep(context, frame, type, rv);
                        }
                        break;
                    }
                    case STEP_INTO: {
                        this.onStep(context, frame, type, rv);
                        break;
                    }
                    case STEP_OVER: {
                        this.onStep(context, frame, type, rv);
                        break;
                    }
                    case STEP_OUT: {
                        this.onStep(context, frame, type, rv);
                        break;
                    }

                }}

            },

            onFunction: function(context, frame, type){
//                log("steppingDriver : onFunction " + type + " " + frame.line);
                var rv = null;

                if (context != this.context)
                    return;
                with(SteppingDriver.STEP_MODES){
                with(JSDConstants){
                    switch (type)
                    {
                        case TYPE_TOPLEVEL_START:
                        case TYPE_FUNCTION_CALL:{
                            this.stackDepthChange++;
                            break;
                        }
                        case TYPE_TOPLEVEL_END:
                        case TYPE_FUNCTION_RETURN:{
                            this.stackDepthChange--;
                            break;
                        }
                    }

                    switch (this.steppingMode){
                        case STEP_MIN: {
                            this.onStep(context, frame, type, rv);
                            break;
                        }
                        //todo change it. It should check and if we are still in the same line just let the execution continue
                        case STEP_LINE: {
                            if (frame.line != this.startLineNo){ //only if it is a new line
                                this.onStep(context, frame, type, rv);
                            }
                            break;
                        }
                        case STEP_INTO: {
                            this.onStep(context, frame, type, rv);
                            break;
                        }
                        case STEP_OVER: {
                            switch (type)
                            {
                                case TYPE_TOPLEVEL_START:
                                case TYPE_FUNCTION_CALL:{
                                    if (frame.callingFrame && frame.callingFrame.script.tag === this.startScriptTag)
                                    {
                                        this.stepRecursion++;
                                        if (!this.stepRecursion){
                                            this.onStep(context, frame, type, rv);
                                        }
                                    }
                                    this.unRegisterAsInterruptListener();
                                    break;
                                }
                                case TYPE_TOPLEVEL_END:
                                case TYPE_FUNCTION_RETURN:{
                                    if (!this.stepRecursion){ // then we never hit FUNCTION_CALL or we rolled back after we hit it
                                        if (frame.script.tag === this.startScriptTag){// We are in the stepping frame,
                                            this.onStep(context, frame, type, rv);
                                            this.registerAsInterruptListener();  // so halt on the next PC
                                        }

                                    }else if (frame.callingFrame && frame.callingFrame.script.tag === this.startScriptTag){ //then we could be in the step call
                                        this.stepRecursion--;

                                        if (!this.stepRecursion) // then we've rolled back to the step-call
                                            this.registerAsInterruptListener();  // so halt on the next PC
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                        case STEP_OUT: {
                            switch (type)
                            {
                                case TYPE_TOPLEVEL_START:
                                case TYPE_FUNCTION_CALL:{
                                    if (frame.callingFrame && frame.callingFrame.script.tag === this.startScriptTag)
                                        this.stepRecursion++;
                                    this.unRegisterAsInterruptListener();
                                    break;
                                }
                                case TYPE_TOPLEVEL_END:
                                case TYPE_FUNCTION_RETURN:{
                                    if (!this.stepRecursion){ // then we never hit FUNCTION_CALL or we rolled back after we hit it
                                        if (frame.script.tag === this.startScriptTag){// We are in the stepping frame,
                                            this.onStep(context, frame, type, rv);
                                            this.registerAsInterruptListener();  // so halt on the next PC
                                        }
                                    }else if (frame.callingFrame && frame.callingFrame.script.tag === this.startScriptTag){ //then we could be in the step call
                                        this.stepRecursion--;
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }

                }}

            },

        };

        constructor.STEP_MODES = {
            STEP_MIN : 0,
            STEP_LINE : 1,
            STEP_INTO : 2,
            STEP_OVER : 3,
            STEP_OUT : 4,
        };

        constructor.STEP_TYPE = {
            IN: 1,
            OVER: 0,
            OUT: -1,
        }
        
        return constructor;
    }();

}}

};
