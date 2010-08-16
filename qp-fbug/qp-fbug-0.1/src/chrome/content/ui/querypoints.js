/* See license.txt for terms of usage */

FBL.ns(function() { with (FBL)  {with(QPFBUG.Classes){


// ************************************************************************************************

/*
 *
 * @panel A Firebug panel that displays and controls Querypoint functionality. It looks like the script panel but act
 * differently.
 *
 * location objects are QPFBUG.Classes.Querypoint objects.
 */


Firebug.Querypoint = {};

Firebug.Querypoint.QPModule = extend(Firebug.ActivableModule,
{
    dispatchName: "qpModule",

    initContext: function(context, persistedState)
    {
        context.Firebug = Firebug; // I guess.
        Firebug.Debugger.addListener(this);
        context.qpfbug.reproducer = Firebug.getPref("extensions.firebug", "querypoints.reproducer");
        FBTrace.sysout("QPModule initContext context.qpfbug.reproducer "+context.qpfbug.reproducer+' in context '+context.getName());
    },

    onQuerypointHit: function(context)
    {

    },

    //********** Firebug.Debugger Listener *************************

    onStartDebugging: function(context)
    {
        FBTrace.sysout("onStartDebugging tracepoints.show "+context.qpfbug.inQuery);
        if (context.qpfbug.inQuery)
        {
            context.qpfbug.inSession = true;  // I don't know how we will get out of this state
            Firebug.chrome.selectSupportingPanel(UIUtils.getDebugModel(context), context, true);
            delete context.qpfbug.inQuery;
        }

    },


});

Firebug.Querypoint.QPSourceViewPanel = function QPSourceViewPanel() {};

// Instance definition
Firebug.Querypoint.QPSourceViewPanel.prototype = extend(Firebug.SourceBoxPanel,
{
    name: "tracepoints",
    title: "QP",
    parentPanel: null,
    breakable: false,
    enableA11y: true,
    deriveA11yFrom: "script",
    activable: false,  // work around

    initialize: function(context, doc)
    {
        this.panelSplitter = $("fbPanelSplitter");
        this.sidePanelDeck = $("fbSidePanelDeck");

        Firebug.SourceBoxPanel.initialize.apply(this, arguments);
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
        FBTrace.sysout("QPSourceViewPanel.updateSelection "+object, object);
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
            FBTrace.sysout("QPSourceViewPanel.showDebugModel OUT OF SYNC ");

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
        FBTrace.sysout("querypoints frame "+frame, frame);
        this.showSourceFile(frame.sourceFile);

        var lineNumber = frame.line;
        this.scrollToLine(null, lineNumber, bind(this.highlightExecutionLine, this, lineNumber, "tracepoint_line"));

        this.syncSidePanels(); // we should not have to do this?
        FBTrace.sysout("QPSourceViewPanel.updateLocation "+tracepoint, tracepoint);
    },

    syncSidePanels: function()
    {
        var qstate = this.context.getPanel("TraceData", false);
        if (qstate)
            qstate.updateSelection(this.location);
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
        FBTrace.sysout("QPSourceViewPanel.getObjectDescription from tracepoint "+tracepoint, tracepoint);
        try
        {
            var frameXBs =  tracepoint.getStackFrames();
            FBTrace.sysout("querypoints.getObjectDescription frame "+frameXBs, frameXBs);
            return frameXBs[0].href;
        }
        catch(exc)
        {
            FBTrace.sysout("QPSourceViewPanel.getObjectDescription FAILS "+exc, exc);
        }
    },

    // return.path: group/category label, return.name: item label
    getObjectDescription: function(tracepoint)
    {
        FBTrace.sysout("QPSourceViewPanel.getObjectDescription "+tracepoint, tracepoint);
        var rep = Firebug.getRep(tracepoint);

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
        FBTrace.sysout("getDefaultLocation "+list, list);
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
            var menuItem = FBL.createMenuItem(popup, menuInfo);
            menuItem.repObject = tracepoint;
            FBL.setClass(menuItem, "fbURLMenuItem");
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

    decorator: extend(new Firebug.SourceBoxDecorator,
        {
            setPanel: function(panel)
            {
                this.panel = panel;
                return this;
            },

            decorate: function(sourceBox, sourceFile)
            {
                FBTrace.sysout("qp.decorator called for "+sourceFile.href);
                UIUtils.eachTracepoint(this.panel.context, function decorateTracepoint(tp)
                {
                    var frameXB = UIUtils.getFrameByTracepoint(tp);
                    FBTrace.sysout("qp.decorateTracepoint frameXB "+frameXB, {tp:tp, frameXB:frameXB});
                    if (frameXB.href === sourceFile.href)
                    {
                        FBTrace.sysout("qp.decorator found match "+sourceFile.href);
                        var lineNo = frameXB.line;
                        if (lineNo >= sourceBox.firstViewableLine && lineNo <= sourceBox.lastViewableLine)
                        {
                            var row = sourceBox.getLineNode(lineNo);
                            FBTrace.sysout("qp.decorator found line "+row);
                            if (row) // we *should* only be called for lines in the viewport...
                                row.setAttribute("tracepoint", "true");
                        }
                    }
                });;

            },
           }),

    // ****************************************************************************
    warningTag:
        DIV({"class": "disabledPanelBox"},
            H1({"class": "disabledPanelHead"},
                SPAN("$pageTitle")
            ),
            P({"class": "disabledPanelDescription", style: "margin-top: 15px;"},
                SPAN("$suggestion")
            )
        ),

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
        var enabled = this.context.qpfbug.inSession;
        FBTrace.sysout("tracepoints.show "+enabled, this.context);
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
        var panelStatus = Firebug.chrome.getPanelStatusElements();
        FBL.hide(panelStatus, false);

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

});

/*
 * TraceDataPanel, shows objects of type QPFBUG.Classes.TraceData
 */
Firebug.Querypoint.TraceDataPanel = function TraceDataPanel() {}

Firebug.Querypoint.TraceDataPanel.prototype = extend(Firebug.DOMBasePanel.prototype,
{
    tag: Firebug.DOMPanel.DirTable.watchTag,

    rebuild: function()
    {
        this.updateSelection(this.selection);
    },

    updateSelection: function(ignore)
    {
        var mainPanel =  this.context.getPanel("tracepoints", false);
        var tracepoint = mainPanel.location;

        FBTrace.sysout("TraceDataPanel.updateSelection "+tracepoint, tracepoint);
        if( ! (tracepoint instanceof Tracepoint) )
            return;

        var newTracepoint = (tracepoint !== this.currentTracepoint);
        if (newTracepoint)
        {
            this.toggles = new ToggleBranch();
            this.currentTracepoint = tracepoint;
        }

        var members = tracepoint.getTraceDataList();
        FBTrace.sysout("TraceDataPanel.updateSelection traceData: "+members.length, members);
        this.expandMembers(members, this.toggles, 0, 0, this.context);
        this.showMembers(members, !newTracepoint);
    },

    showEmptyMembers: function()
    {
        FirebugReps.Warning.tag.replace({object: "NoMembersWarning"}, this.panelNode);
    },


    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // extends Panel

    name: "TraceData",
    title: "TraceData",
    order: 0,
    parentPanel: "tracepoints",
    enableA11y: true,
    deriveA11yFrom: "console",

    initialize: function()
    {
        Firebug.DOMBasePanel.prototype.initialize.apply(this, arguments);
    },

    destroy: function(state)
    {
        Firebug.DOMBasePanel.prototype.destroy.apply(this, arguments);
    },

    show: function(state)
    {
        this.rebuild();
    },

    initializeNode: function(oldPanelNode)
    {
        Firebug.DOMBasePanel.prototype.initializeNode.apply(this, arguments);
    },

    destroyNode: function()
    {
        Firebug.DOMBasePanel.prototype.destroyNode.apply(this, arguments);
    },

    refresh: function()
    {
        this.rebuild(true);
    },

});

Firebug.Querypoint.TracepointsTag = domplate(Firebug.Rep,
{
    tag: FirebugReps.OBJECTBOX(
            FOR("qp", "$object|iterator",
                TAG("$qp.tag", {object: "$qp.object"})
            )
        ),

    className: "tracepoints",

    iterator: function(qps)
    {
        FBTrace.sysout("tracepoint.iterator "+qps.length, qps[i]);
        var members = [];

        for (var i = 0; i < qps.length; i++)
        {
            var rep = Firebug.getRep(qps[i]);
            if (rep)
                members.push({object: qps[i], tag: rep.tag});
            else
                FBTrace.sysout("tracepoint.iterator no rep for "+qps[i], qps[i]);
        }
        return members;
    },

});

/*
 * Reproductions, shows objects of type QPFBUG.Classes.Reproduction
 */
Firebug.Querypoint.ReproductionsPanel = function ReproductionsPanel() {}

Firebug.Querypoint.ReproductionsPanel.prototype = extend(Firebug.DOMBasePanel.prototype,
{

    rebuild: function()
    {
        this.updateSelection(this.selection);
    },

    updateSelection: function(ignore)
    {
        var mainPanel =  this.context.getPanel("tracepoints", false);
        var tracepoints = UIUtils.getTracepoints(this.context);

        if (!tracepoints.length)
        {
            this.showEmptyMembers();
            return;
        }

        FBTrace.sysout("ReproductionsPanel.updateSelection "+tracepoints.length, {tracepoints: tracepoints, tag: Firebug.Querypoint.TracepointsTag});
        Firebug.Querypoint.TracepointsTag.tag.replace({object:tracepoints}, this.panelNode);
    },

    showEmptyMembers: function()
    {
        FirebugReps.Warning.tag.replace({object: "NoMembersWarning"}, this.panelNode);
    },



    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // extends Panel

    name: "Reproductions",
    title: "Reproductions",
    order: 1,
    parentPanel: "tracepoints",
    enableA11y: true,
    deriveA11yFrom: "console",

    initialize: function()
    {
        Firebug.DOMBasePanel.prototype.initialize.apply(this, arguments);
    },

    destroy: function(state)
    {
        Firebug.DOMBasePanel.prototype.destroy.apply(this, arguments);
    },

    show: function(state)
    {
        this.rebuild();
    },

    initializeNode: function(oldPanelNode)
    {
        Firebug.DOMBasePanel.prototype.initializeNode.apply(this, arguments);
    },

    destroyNode: function()
    {
        Firebug.DOMBasePanel.prototype.destroyNode.apply(this, arguments);
    },

    refresh: function()
    {
        this.rebuild(true);
    },

});

Firebug.Querypoint.TracepointRep = extend(Firebug.Rep,
{
    getLocationName: function(tracepoint)
    {
        var frame = UIUtils.getFrameByTracepoint(tracepoint);
        var url = frame.sourceFile.href;
        var segments = url.split('/');
        var leaf = segments.pop();
        return leaf+"@"+frame.line;
    },

});

Firebug.Querypoint.BreakpointTracepointRep = domplate(Firebug.Querypoint.TracepointRep,
{
    tag:
        FirebugReps.OBJECTLINK({"class":"tracepoint"},
             SPAN({"class": "userLabel objectTitle"}, "$object|getTitle "),
             SPAN({"class": "objectLink-sourceLink objectLink  a11yFocus",
                _repObject: "$object|getSourceLink",
                role: "link"},
                "$object|getSourceLinkTitle")
        ),

    titleTag:
         SPAN({"class": "objectTitle"}, "$object|getTitle"),

    getTitle: function(object)
    {
        return "Breakpoint";
    },

    getSourceLink: function (object)
    {
        return new SourceLink(object.url, object.lineNo, "js");
    },

    getSourceLinkTitle: function(object)
    {
        return this.getLocationName(object);
    },

    getLocationContent: function(object)
    {
        return this.getTitle()+" "+ this.getSourceLinkTitle(object);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    className: "BreakpointTracepoint",

    supportsObject: function(object, type)
    {
        return (object instanceof QPFBUG.Classes.Tracepoint) && (object.getQueryType() == "breakpoint");
    },

});

Firebug.Querypoint.LastChangeTracepointRep = domplate(Firebug.Querypoint.TracepointRep,
{
    tag:
        DIV({"class":"tracepoint"},
                 SPAN({"class": "userLabel objectTitle"}, "$object|getTitle "),
                 TAG(FirebugReps.String.tag, {object: "$object|getQueryExpr"})
            ),

        titleTag:
             SPAN({"class": "objectTitle"}, "$object|getTitle"),

        getTitle: function(object)
        {
            return "Last Change";
        },

        getQueryExpr: function (object)
        {
            return object.querypoint.getQueryObjectExpression();
        },

        getLocationContent: function(object)
        {
            return this.getTitle()+" "+this.getQueryExpr(object)+" "+this.getLocationName(object);
        },
        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

        className: "LastChangeTracepoint",

        supportsObject: function(object, type)
        {
            return (object instanceof QPFBUG.Classes.Tracepoint) && (object.getQueryType() == "lastChange");
        },

    });


/*
 * TraceStackPanel, shows objects of type QPFBUG.Classes.TraceFrame
 */
Firebug.Querypoint.TraceStackPanel = function TraceStackPanel() {}

Firebug.Querypoint.TraceStackPanel.prototype = extend(Firebug.CallstackPanel.prototype,
{
    name: "tracestack",
    title: "Tracestack",
    parentPanel: "tracepoints",
    order: 2,
    enableA11y: true,
    deriveA11yFrom: "console",
});

Firebug.registerModule(Firebug.Querypoint.QPModule);
Firebug.registerStylesheet("chrome://qpfbug/content/ui/querypoints.css");
Firebug.registerPreference("querypoints.enableSites", false);
Firebug.registerPreference("querypoints.reproducer", "local");
Firebug.registerPanel(Firebug.Querypoint.QPSourceViewPanel);
Firebug.registerPanel(Firebug.Querypoint.TraceDataPanel);
Firebug.registerPanel(Firebug.Querypoint.TraceStackPanel);
Firebug.registerPanel(Firebug.Querypoint.ReproductionsPanel);

Firebug.registerRep(Firebug.Querypoint.BreakpointTracepointRep);
Firebug.registerRep(Firebug.Querypoint.LastChangeTracepointRep);

}}});