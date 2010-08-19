var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{
with (QPFBUG.FBL){
with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //------------------------------- SourceViewPanel ----------------------------------
    __owner.SourceViewPanel = function(){

        var constructor = function(){

            extendFromParent(this, FB.SourceBoxPanel);

            this.decorator = extend(new FB.SourceBoxDecorator,
            {                                   
                setPanel: function(panel)
                {
                    this.panel = panel;
                    return this;
                },

                decorate: function(sourceBox, sourceFile)
                {
                    trace("qp.decorator called for "+sourceFile.href);
                    UIUtils.eachTracepoint(this.panel.context, function decorateTracepoint(tp)
                    {
                        var frameXB = UIUtils.getFrameByTracepoint(tp);
                        trace("qp.decorateTracepoint frameXB "+frameXB, {tp:tp, frameXB:frameXB});
                        if (frameXB.href === sourceFile.href)
                        {
                            trace("qp.decorator found match "+sourceFile.href);
                            var lineNo = frameXB.line;
                            if (lineNo >= sourceBox.firstViewableLine && lineNo <= sourceBox.lastViewableLine)
                            {
                                var row = sourceBox.getLineNode(lineNo);
                                trace("qp.decorator found line "+row);
                                if (row) // we *should* only be called for lines in the viewport...
                                    row.setAttribute("tracepoint", "true");
                            }
                        }
                    });

                },
            });

            this.warningTag=
                DIV({"class": "disabledPanelBox"},
                    H1({"class": "disabledPanelHead"},
                        SPAN("$pageTitle")
                    ),
                    P({"class": "disabledPanelDescription", style: "margin-top: 15px;"},
                        SPAN("$suggestion")
                    )
                );


        };

        constructor.prototype = {

            name: "tracepoints",
            title: "QP",
            parentPanel: null,
            breakable: false,
            enableA11y: true,
            deriveA11yFrom: "script",
            activable: false,  // work around

            initialize: function(context, doc)
            {
                this.win = context.qpfbug.firefoxWindow;

                this.panelSplitter = $("fbPanelSplitter");
                this.sidePanelDeck = $("fbSidePanelDeck");
        
                this.win.Firebug.SourceBoxPanel.initialize.apply(this, arguments);
            },
        
            supportsObject: function(object, type)
            {
                if( object instanceof DebugModel)
                    return 10;
                if( object instanceof DebugSession)
                    return 10;
                if( object instanceof Tracepoint)
                    return 10;
                else return 0;
            },
        
            updateSelection: function(object)
            {
                trace("QPSourceViewPanel.updateSelection "+object, object);
                if( object instanceof DebugSession)
                    this.showDebugModel(object.debugModel);
        
                if( object instanceof DebugModel)
                    this.showDebugModel(object);
        
                if( object instanceof Tracepoint)
                    this.navigate(object);
            },
        
            showDebugModel: function(debugModel)
            {
                if (debugModel !== UIUtils.getDebugModel(this.context))
                    trace("QPSourceViewPanel.showDebugModel OUT OF SYNC ");
        
                this.navigate(this.getDefaultLocation());
            },
            // ***********************************************
            // --- Querypoint locations are "Tracepoint" objects ---
        
            updateLocation: function(tracepoint)
            {
                if (!tracepoint)
                {
                    this.showWarningTag();
                    return;
                }
        
                if (this.activeWarningTag)
                {
                    clearNode(this.panelNode);
                    delete this.activeWarningTag;
        
                    // The user was seeing the warning, but selected a file to show in the script panel.
                    // The removal of the warning leaves the panel without a clientHeight, so
                    //  the old sourcebox will be out of sync. Just remove it and start over.
                    this.removeAllSourceBoxes();
                }
        
                var frame = UIUtils.getFrameByTracepoint(tracepoint);
                trace("querypoints frame "+frame, frame);
                this.showSourceFile(frame.sourceFile);
        
                var lineNumber = frame.line;
                this.scrollToLine(null, lineNumber, bind(this.highlightExecutionLine, this, lineNumber, "tracepoint_line"));
        
                trace("QPSourceViewPanel.updateLocation "+tracepoint, tracepoint);
            },
        
            /*
             * Framework connection
             */
            getSourceType: function()
            {
                return "js";
            },
        
            showSourceLink: function(sourceLink)
            {
                // HACK
            },
        
            getObjectLocation: function(tracepoint)
            {
                trace("QPSourceViewPanel.getObjectDescription from tracepoint "+tracepoint, tracepoint);
                try
                {
                    var frameXBs =  tracepoint.getStackFrames();
                    trace("querypoints.getObjectDescription frame "+frameXBs, frameXBs);
                    return frameXBs[0].href;
                }
                catch(exc)
                {
                    trace("QPSourceViewPanel.getObjectDescription FAILS "+exc, exc);
                }
            },
        
            // return.path: group/category label, return.name: item label
            getObjectDescription: function(tracepoint)
            {
                trace("QPSourceViewPanel.getObjectDescription "+tracepoint, tracepoint);
                var rep = this.win.Firebug.getRep(tracepoint);
        
                var locationInfo = rep.getLocationContent(tracepoint);
                return {path:"", name: locationInfo};
            },
        
            getLocationList: function()
            {
                var tps = UIUtils.getTracepoints(this.context);
                if (tps)
                    return tps;
                else
                    this.showWarningTag();
            },
        
            getDefaultLocation: function()
            {
                var list = this.getLocationList()
                trace("getDefaultLocation "+list, list);
                if (list)
                    return list.pop();
            },
        
            getLocationContent: function(objects, popup)
            {
                for (var i = 0; i < objects.length; i++)
                {
                    var tracepoint = objects[i];
                    var description = this.getObjectDescription(tracepoint);
                    var menuInfo = {label: description.name, nol10n: true};
                    if (tracepoint === this.location)
                    {
                        menuInfo.type = "checkbox";
                        menuInfo.checked = true;
                    }
                    var menuItem = createMenuItem(popup, menuInfo);
                    menuItem.repObject = tracepoint;
                    setClass(menuItem, "fbURLMenuItem");
                }
            },
        
            getDefaultSelection: function()
            {
                return this.getDefaultLocation();
            },
        
            getDecorator: function(sourceBox)
            {
                return this.decorator.setPanel(this);
            },
        
            // ****************************************************************************

            showWarningTag: function()
            {
                var args = {
                        pageTitle: $STR("Querypoint, Debugging Evolved"),
                        suggestion: $STR("Set a breakpoint, hit it, then use Last Change from the context menu on the Watch panel")
                }
                this.activeWarningTag = this.warningTag.replace(args, this.panelNode, this);
            },

            show: function(state)
            {
                trace("*****************************####");
                var enabled = (UIUtils.getDebugSession(this.context).getNumberOfQuerypoints() > 0);
                trace("tracepoints.show "+enabled, this.context);
                // These buttons are visible only if debugger is enabled.
                //this.showToolbarButtons("fbLocationSeparator", enabled);
                this.showToolbarButtons("fbLocationList", enabled);
        
                // Additional debugger panels are visible only if debugger
                // is enabled.
                this.panelSplitter.collapsed = !enabled;
                this.sidePanelDeck.collapsed = !enabled;
        
                if (enabled)
                {
                    this.highlight(this.context.stopped);
                    this.navigate(this.location);
                }
                else
                    this.showWarningTag();
            },
        
            hide: function(state)
            {
                if (this.context)
                    this.highlight(this.context.stopped);
        
                this.showToolbarButtons("fbLocationList", false);
                var panelStatus = this.win.Firebug.chrome.getPanelStatusElements();
                hide(panelStatus, false);
        
                delete this.infoTipExpr;
            },
        
            //***************************************************************************
            getOptionsMenuItems: function()
            {
                var items = [];
        
                items.push(
                        {label: "Callstack Reproducer", command: bindFixed(this.selectReproducer, this, "local") },
                        {label: "Scripted Reproducer", command: bindFixed(this.selectReproducer, this, "hardwired") },
                        {label: "Replay Reproducer", command: bindFixed(this.selectReproducer, this, "replay") },
                        {label: "FBTest Reproducer", command: bindFixed(this.selectReproducer, this, "fbtest") }
                    );
                return items;
            },
        
            selectReproducer: function(name)
            {
                Reproducer.getInstance().select(name);
            },

        };

        constructor.getInstance = function(win){
            if (!win.Firebug.qpfbug.sourceViewPanel)
            {
                var sourceViewPanel = new SourceViewPanel(win);
                Lang.wrapFunctionsWithTryCatch(sourceViewPanel);
                win.Firebug.qpfbug.sourceViewPanel = sourceViewPanel;
            }
            return win.Firebug.qpfbug.sourceViewPanel;
        };

        return constructor;
    }();

}}}

};