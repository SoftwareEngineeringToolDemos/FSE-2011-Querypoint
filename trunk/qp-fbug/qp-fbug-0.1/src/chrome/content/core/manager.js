var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

    var owner = QPFBUG.Classes;

    //--------------------------- QueryPoint Debugging Manager ----------------------
    owner.Manager = function(){

        var constructor = function(){
           this.dataStore = new DataStore();
        };

        constructor.prototype =
        {
            getReproduction : function(context, reproductionId){
                var debugSession;
                var reproduction;
                if (reproductionId)
                {
                    reproduction = this.dataStore.getReproduction(reproductionId);
                }
                if (!reproduction)
                {
                    debugSession = this.dataStore.newDebugSession();
                    reproduction = this.dataStore.newReproduction(debugSession);
                }
                return reproduction;
            },

            //------------------------- actions ---------------------------------------
            addLastChange : function(context, owner, propertyPath){
                var win = context.qpfbug.firefoxWindow;
                with(win){
                    var debugSession = context.qpfbug.debugSession;
                    var reproduction = context.qpfbug.reproduction;
                    var debugModel = debugSession.debugModel;

                    if (!context.stopped)
                        return;

                    //add current breakpoint as a point
                    // todo breakpoint is not enough, we should get the hit count
                    // we also need the all steps (step in, steps over, steps out)
                    // taken before reaching this point
                    // todo get breakpoint from context

                    var href = context.executingSourceFile.href;
                    var line = context.debugFrame.line;
                    var fileName = context.debugFrame.script.fileName;
                    var bp = FBL.fbs.findBreakpoint(href, line);
                    var tracePointA;
                    if (bp)
                    {
                        //todo set the correct hit count
                        tracePointA = debugModel.addTracePoint_Breakpoint(href, line, 0);

                        //todo set the correct frame number
                        debugModel.addTracePoint_LastChange(tracePointA.id, 0, propertyPath);

                        //todo add current traceobj  data to the tracePointAlog in reproduction
                        // we keep parent creation url as information in traceobjlog
                        //getRealObject
                        owner = FBL.unwrapObject(owner);

                        var wrappedJSDValue = FBL.jsd.wrapValue(owner);
                        // NO good reason for getting js parent only because it works
                        wrappedJSDValue = wrappedJSDValue.jsParent;

                        FBTrace.sysout(wrappedJSDValue.objectValue);
                        FBTrace.sysout(wrappedJSDValue.objectValue.creatorURL);
                        FBTrace.sysout(wrappedJSDValue.objectValue.creatorLine);
                        FBTrace.sysout(wrappedJSDValue.objectValue.constructorURL);

                        var sourceFile = context.sourceFileMap[wrappedJSDValue.objectValue.creatorURL];
//                        FBL.fbs.addBreakpoint(1, sourceFile, wrappedJSDValue.objectValue.creatorLine,
//                                                      null, context.qpfbug.debugger);
                    }

                    Firebug.Debugger.resume(context);
                    var newReproduction = this.dataStore.newReproduction(debugSession);

                    var tabBrowser = win.FBL.$("content");
                    QPFBUG.reproducer.reproduce(win, debugSession.id, newReproduction.id); //TODO changeit
                    tabBrowser.removeTab(context.qpfbug.tab);
                }

            }
            //------------------------- internal functions -----------------------------

        };

        constructor.getInstance = function(){
            if (!QPFBUG.manager)
            {
                QPFBUG.manager = new Manager();
            }
            return QPFBUG.manager;
        };

        return constructor;
    }();

}}

};
