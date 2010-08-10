function runTest()
{
    var DBG = true;
    var win = FBTest.FirebugWindow;
    var QPFBUG = win.QPFBUG;
    var Firebug = win.Firebug;
    var qpfbug = Firebug.qpfbug;
    var context;
    with (QPFBUG.Classes){
    with (Lang){
        var tabLoaded = function(window)
        {
            FBTestFirebug.openFirebug();
            FBTestFirebug.selectPanel("script");
            FBTestFirebug.enableScriptPanel(startTest);
        };

        var stepHandler_Min;
        var stepHandler_Line;
        var stepHandler_In;
        var stepHandler_Over;
        var stepHandler_Out;

        var startTest = function(window){
            if (DBG)
                trace("Creates and Starts step handlers.")
            context = win.TabWatcher.getContextByWindow(window);

            context.qpfbug.enabled = true;

            stepHandler_Min = new StepHandler();
            stepHandler_Line = new StepHandler();
            stepHandler_In = new StepHandler();
            stepHandler_Over = new StepHandler();
            stepHandler_Out = new StepHandler();

            var startCountingLine = context.window.startCountingLine;
            var endCountingLine = context.window.endCountingLine;
            stepHandler_Min.start(0, startCountingLine, endCountingLine);
            stepHandler_Line.start(1, startCountingLine, endCountingLine);
            stepHandler_In.start(2, startCountingLine, endCountingLine);
            stepHandler_Over.start(3, startCountingLine, endCountingLine);
            stepHandler_Out.start(4, startCountingLine, endCountingLine);

            FBTest.compare(5, DebugService.getInstance().listeningToInterrupts, "Number of interrupt listeners.")
            FBTest.compare(5, DebugService.getInstance().listeningToFunctions, "Number of interrupt functions.")
            FBTest.compare(true, !!QPFBUG.fbs.getJSD().interruptHook, "JSD interrupt hook")
            FBTest.compare(true, !!QPFBUG.fbs.getJSD().functionHook, "JSD function hook")

            if (DBG)
                trace("Step handlers started.")

            // click on the page
            var node = context.window.document.getElementById("myBody");
            FBTest.click(node);

            setTimeout(endTest, 200);
        }

        var endTest = function(){

            stepHandler_Min.stop();
            stepHandler_Line.stop();
            stepHandler_In.stop();
            stepHandler_Over.stop();
            stepHandler_Out.stop();

            FBTest.compare(context.window.stepMin, stepHandler_Min.stepCount, "StepMin count")
            FBTest.compare(context.window.stepLine, stepHandler_Line.stepCount, "StepLine count")
            FBTest.compare(context.window.stepIn, stepHandler_In.stepCount, "StepIn count")
            FBTest.compare(context.window.stepOver, stepHandler_Over.stepCount, "StepOver count")
            FBTest.compare(context.window.stepOut, stepHandler_Out.stepCount, "StepOut count")

            FBTest.compare(0, DebugService.getInstance().listeningToInterrupts, "Number of interrupt listeners.")
            FBTest.compare(0, DebugService.getInstance().listeningToFunctions, "Number of interrupt functions.")
            FBTest.compare(null, QPFBUG.fbs.getJSD().interruptHook, "JSD interrupt hook")
            FBTest.compare(null, QPFBUG.fbs.getJSD().functionHook, "JSD function hook")

            FBTest.testDone();
        }

        //step handler class

        var StepHandler = function(){
        };

        StepHandler.prototype = {
            start: function(steppingMode, startCountingLine, endCountingLine){
                this.stepCount = 0;
                this.steppingMode = steppingMode;
                this.startCountingLine = startCountingLine;
                this.endCountingLine = endCountingLine;
                this.steppingDriver = DebugService.getInstance().getSteppingDriver(this, context);
                this.countingStarted = false;
                this.steppingDriver.start();
            },

            stop: function(){
                if (DBG)
                    trace("Step handler step count " + this.steppingMode + " : " + this.stepCount);
                DebugService.getInstance().releaseSteppingDriver(this.steppingDriver);
            },

            onStep: function(frame, type, rv, stackDepthChange){
                if (DBG)
                    trace("onStep : " + this.steppingMode + " : " + frame.script.fileName + ":  " +frame.line + " type: " + type + " stackDepthChange: " + stackDepthChange + " "+this.getFrameDepth(frame), frame);
                if (!this.countingStarted){
                    if (frame.line == this.startCountingLine){
                        this.countingStarted = true;
                        this.stepCount++;
                        this.steppingDriver.step(this.steppingMode, frame.script.tag, frame.line, frame.pc);
                    }else{
                        this.steppingDriver.step(0, frame.script.tag, frame.line, frame.pc);
                    }
                }else{
                    if (frame.line == this.endCountingLine){
                        this.steppingDriver.stop();
                        return;
                    }
                    this.stepCount++;
                    this.steppingDriver.step(this.steppingMode, frame.script.tag, frame.line, frame.pc);
                }
            },

            getFrameDepth: function(frame){
                var depth = 0;
                while (frame){
                    depth++;
                    frame = frame.callingFrame;
                }
                return depth;
            },
        };

        if (DBG)
            trace("Opens the page ...")
        FBTestFirebug.openNewTab(basePath + "test/di/page_steppingdriver.html", tabLoaded);
    }}

};
