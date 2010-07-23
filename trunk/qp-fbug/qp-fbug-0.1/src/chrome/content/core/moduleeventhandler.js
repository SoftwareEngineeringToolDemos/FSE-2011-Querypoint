var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{
with (QPFBUG){
with (QPFBUG.Lang){
with (QPFBUG.Classes){

    var owner = QPFBUG.Classes;

    //------------------------------- ModuleEventHandler ----------------------------------
    // An instance of this class is built for every new Firforx window like Firebug
    owner.ModuleEventHandler = function(){

        var constructor = function(win){

            var module = win.FBL.extend(win.Firebug.Module,  //TODO change it to activeModule
            {
                initialize: function(){

                },

                initializeUI: function(){
                    //initialize UIEventHandler for this firefox window
                    this.win.Firebug.qpfbug.uiEventHandler.init();
                },

                initContext: function(context, persistedState)
                {
                    with (this.win){
                        //set qpfbug data holder for the context
                        context.qpfbug = {};
                        context.qpfbug.firefoxWindow = this.win;
                        context.qpfbug.breakpoints = {};
                        context.qpfbug.breakpointURLs = [];
                        context.qpfbug.debugger = {debuggerName:"QPFBUG"}

                        //get reproductionId passed to this tab
                        var tabBrowser = FBL.$("content");
                        var selectedTab = tabBrowser.selectedTab;
                        var reproductionId = selectedTab.getAttribute("reproductionId");

                        //get reproduction for this tab;
                        var reproduction = QPFBUG.manager.getReproduction(context, reproductionId);

                        // set reproduction and debugSession for the context
                        context.qpfbug.reproduction = reproduction;
                        context.qpfbug.debugSession = reproduction.debugSession;
                        context.qpfbug.tab = selectedTab;

                        //to select this context
                        Firebug.selectContext(context);
                    };
                },

                loadedContext: function(context)
                {
                },

                // source file is created or changed
                onSourceFileCreated: function(context, sourceFile)
                {
                    QPFBUG.FBTrace.sysout("<<<<<<<<<<<");
                    var tracePoints = context.qpfbug.debugSession.debugModel.tracePoints;
                    QPFBUG.FBTrace.sysout("tracePoints", tracePoints);

                    //remove all breakpoints for this sourceFile
                    context.qpfbug.breakpoints[sourceFile.href] = [];

                    var breakpoints = context.qpfbug.breakpoints[sourceFile.href];
                    var breakpointURLs = context.qpfbug.breakpointURLs;

                    for (i in tracePoints)
                    {
                        QPFBUG.FBTrace.sysout(i);
                        var tracePoint = tracePoints[i];
                        if (tracePoint.queryType == DebugModel.QUERY_TYPES.BREAKPOINT)
                        {
                            if (tracePoint.url == sourceFile.href)
                            {
                                QPFBUG.FBTrace.sysout(tracePoint.url);
                                var bp = {type: 1, href: sourceFile.href, lineNo: tracePoint.lineNo, disabled: 0,
                                          debuggerName: "QPFBUG",
                                          condition: "", onTrue: true, hitCount: -1, hit: 0};
                                breakpoints.push(bp);
                                breakpointURLs.push(sourceFile.href);
                                context.qpfbug.firefoxWindow.FBL.fbs.setJSDBreakpoint(sourceFile, bp);
                            }
                        }
                    }
//                    this.win.FBL.fbs.resetBreakpoints(sourceFile, context.qpfbug.debugger);
//                    QPFBUG.FBTrace.sysout("++++++++++++");
                },

                destroyContext: function(context, persistedState)
                {
                     delete context.qpfbug;

                    //todo store debugModel in the persistedState
                    // remove all breakpoints
                }

            });

            module.win = win;
            return module;
        };

        return constructor;
    }();

}}}

};