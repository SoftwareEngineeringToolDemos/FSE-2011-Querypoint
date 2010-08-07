var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //--------------------------- Stepping Driver ----------------------
    owner.SteppingDriver = function(){

        var constructor = function(debugService, stepHandler, context){
            this.steppingMode = SteppingDriver.STEP_MODES.STEP_MIN; //default
            this.debugService = debugService;
            this.stepHandler = stepHandler;
            this.context = context;
            this.registeredForInterrupts = false;
            this.registeredForFunctions = false;
            this.stepRecursion = 0;
            this.isStopped = true;
        };

        constructor.prototype = {

            //stops at the first interrupt in this context
            start: function(){
                this.steppingMode = SteppingDriver.STEP_MODES.STEP_MIN; //default
                this.registerAsInterruptListener();
            },

            step: function(steppingMode, startScriptTag, startLineNo, startPC){
                this.steppingMode = steppingMode;
                this.startScriptTag = startScriptTag;
                this.startLineNo = startLineNo;
                this.startPC = startPC;
                this.isStopped = false;

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
                this.stepHandler.onStep(this.steppingMode, this, context, frame, type, rv);
            },

            // ------------------------------ functions called by debug service -------------
            onInterrupt: function(context, frame, type, rv){
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
                        this.onStep(context, frame, type, rv);
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

            onFunction: function(context, frame, type, rv){
                if (context != this.context)
                    return;
                with(SteppingDriver.STEP_MODES){
                with(JSDConstants){
                switch (this.steppingMode){
                    case STEP_MIN: {
                        this.onStep(context, frame, type, rv);
                        break;
                    }
                    //todo change it. It should check and if we are still in the same line just let the execution continue
                    case STEP_LINE: {
                        this.onStep(context, frame, type, rv);
                        break;
                    }
                    case STEP_INTO: {
                        this.onStep(context, frame, type, rv);
                        break;
                    }
                    case STEP_OVER: {
                        trace("/////////////////");
                        switch (type)
                        {
                            case TYPE_TOPLEVEL_START:
                            case TYPE_FUNCTION_CALL:{
                                if (frame.callingFrame && frame.callingFrame.script.tag === this.startScriptTag)
                                {
                                    if (!this.stepRecursion){
                                        this.onStep(context, frame, type, rv);
                                    }
                                    this.stepRecursion++;
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

                                }else if (frame.callingFrame.script.tag === this.startScriptTag){ //then we could be in the step call
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
                                unRegisterAsInterruptListener();
                                break;
                            }
                            case TYPE_TOPLEVEL_END:
                            case TYPE_FUNCTION_RETURN:{
                                if (!this.stepRecursion){ // then we never hit FUNCTION_CALL or we rolled back after we hit it
                                    if (frame.script.tag === this.startScriptTag){// We are in the stepping frame,
                                        this.onStep(context, frame, type, rv);
                                        this.registerAsInterruptListener();  // so halt on the next PC
                                    }
                                }else if (frame.callingFrame.script.tag === this.startScriptTag){ //then we could be in the step call
                                    this.stepRecursion--;
                                }
                                break;
                            }
                        }
                        break;
                    }

                }}}

            },

        };

        constructor.STEP_MODES = {
            STEP_MIN : 0,
            STEP_LINE : 1,
            STEP_INTO : 2,
            STEP_OVER : 3,
            STEP_OUT : 4,
        };
        
        return constructor;
    }();

}}

};
