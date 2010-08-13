/* See license.txt for terms of usage */

FBL.ns(function() { with (FBL)  {with(QPFBUG.Classes){


// ************************************************************************************************

/*
 *
 * @panel A Firebug panel that displays and controls Querypoint functionality. It looks like the script panel but act
 * differently.
 *
 * location objects are QPFBUG.Classes.QueryPoint objects.
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

    onQueryPointHit: function(context)
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
        if( object instanceof TracePoint)
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

        if( object instanceof TracePoint)
            this.navigate(object);
    },

    showDebugModel: function(debugModel)
    {
        if (debugModel !== UIUtils.getDebugModel(this.context))
            FBTrace.sysout("QPSourceViewPanel.showDebugModel OUT OF SYNC ");

        this.navigate(this.getDefaultLocation());
    },
    // ***********************************************
    // --- Querypoint locations are "TracePoint" objects ---

    updateLocation: function(tracePoint)
    {
        if (!tracePoint)
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

        var frame = this.getFrameByTracePoint(tracePoint);
        FBTrace.sysout("querypoints frame"+frame, frame);
        this.showSourceFile(frame.sourceFile);

        var lineNumber = frame.line;
        this.scrollToLine(null, lineNumber, bind(this.highlightExecutionLine, this, lineNumber, "tracepoint_line"));

        FBTrace.sysout("QPSourceViewPanel.updateLocation "+tracePoint, tracePoint);
        var qstate = this.context.getPanel("QueryState", false);
        if (qstate)
            qstate.updateSelection(tracePoint);
    },

    getFrameByTracePoint: function(tracepoint)
    {
        FBTrace.sysout("getSourceLinkByTracePoint "+tracepoint, tracepoint)
        var frame = tracepoint.getStackFrames()[0];
        return frame;
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

    getObjectLocation: function(tracePoint)
    {
        FBTrace.sysout("QPSourceViewPanel.getObjectDescription from tracePoint "+tracePoint, tracePoint);
        try
        {
            var frameXBs =  tracePoint.getStackFrames();
            FBTrace.sysout("queryPoints.getObjectDescription frame "+frameXBs, frameXBs);
            return frameXBs[0].href;
        }
        catch(exc)
        {
            FBTrace.sysout("QPSourceViewPanel.getObjectDescription FAILS "+exc, exc);
        }
    },

    // return.path: group/category label, return.name: item label
    getObjectDescription: function(tracePoint)
    {
        FBTrace.sysout("QPSourceViewPanel.getObjectDescription "+tracePoint, tracePoint);
        if (tracePoint.getQueryType() == 'breakpoint')
        {
            return {path: "Breakpoint", name: this.getObjectLocation(tracePoint)};
        }
        if (tracePoint.getQueryType() == 'lastChange')
        {
            return {path: "Last Change", name: this.getObjectLocation(tracePoint)};
        }
    },

    getLocationList: function()
    {
        var tps = UIUtils.getTracePoints(this.context);
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

    getDefaultSelection: function()
    {
        return this.getDefaultLocation();
    },

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
    },

    selectReproducer: function(name)
    {
        Reproducer.getInstance().select(name);
    },

});

/*
 * Q-State, shows objects of type QPFBUG.Classes.TraceObject
 */
Firebug.Querypoint.QueryStatePanel = function QueryStatePanel() {}

Firebug.Querypoint.QueryStatePanel.prototype = extend(Firebug.DOMBasePanel.prototype,
{
    tag: Firebug.DOMPanel.DirTable.watchTag,

    rebuild: function()
    {
        this.updateSelection(this.selection);
    },

    updateSelection: function(ignore)
    {
        var mainPanel =  this.context.getPanel("tracepoints", false);
        var tracePoint = mainPanel.location;

        FBTrace.sysout("QueryStatePanel.updateSelection "+tracePoint, tracePoint);
        if( ! (tracePoint instanceof TracePoint) )
            return;

        var newTracePoint = (tracePoint !== this.currentTracePoint);
        if (newTracePoint)
        {
            this.toggles = new ToggleBranch();
            this.currentTracePoint = tracePoint;
        }

        var members = tracePoint.getTraceObjects();
        this.expandMembers(members, this.toggles, 0, 0, this.context);
        this.showMembers(members, !newTracePoint);
    },

    showEmptyMembers: function()
    {
        FirebugReps.Warning.tag.replace({object: "NoMembersWarning"}, this.panelNode);
    },


    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // extends Panel

    name: "QueryState",
    title: "QState",
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

Firebug.Querypoint.QuerypointsTag = domplate(Firebug.Rep,
{
    tag: FirebugReps.OBJECTBOX(
            FOR("qp", "$object|iterator",
                TAG("$qp.tag", {object: "$qp.object"})
            )
        ),

    className: "querypoints",

    iterator: function(qps)
    {
        FBTrace.sysout("querypoint.iterator "+qps.length, qps[i]);
        var members = [];

        if (!qps.length)
        {
            this.showEmptyMembers();
            return members;
        }
        for (var i = 0; i < qps.length; i++)
        {
            var rep = Firebug.getRep(qps[i]);
            if (rep)
                members.push({object: qps[i], tag: rep.tag});
            else
                FBTrace.sysout("querypoint.iterator no rep for "+qps[i], qps[i]);
        }
        return members;
    },

});

/*
 * Querypoints, shows objects of type QPFBUG.Classes.Querypoint
 */
Firebug.Querypoint.QueryPointPanel = function QueryPointPanel() {}

Firebug.Querypoint.QueryPointPanel.prototype = extend(Firebug.DOMBasePanel.prototype,
{

    rebuild: function()
    {
        this.updateSelection(this.selection);
    },

    updateSelection: function(ignore)
    {
        var mainPanel =  this.context.getPanel("tracepoints", false);
        var qps = UIUtils.getQueryPoints(this.context);

        FBTrace.sysout("QueryPointPanel.updateSelection "+qps.length, {qps: qps, tag: Firebug.Querypoint.QuerypointsTag});
FBTrace.DBG_DOMPLATE = true;
        Firebug.Querypoint.QuerypointsTag.tag.replace({object:qps}, this.panelNode);
FBTrace.DBG_DOMPLATE = false;
    },

    showEmptyMembers: function()
    {
        FirebugReps.Warning.tag.replace({object: "NoMembersWarning"}, this.panelNode);
    },



    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // extends Panel

    name: "QueryPoints",
    title: "QueryPoints",
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


Firebug.Querypoint.BreakPointRep = domplate(Firebug.Rep,
{
    tag:
        FirebugReps.OBJECTLINK({"class":"querypoint"},
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
        var segments = object.url.split('/');
        var leaf = segments.pop();
        return leaf+"@"+object.lineNo+"*"+object.hitCount;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    className: "QueryPointBreakPoint",

    supportsObject: function(object, type)
    {
        return (object instanceof QueryPoint) && (object.getQueryType() == "breakpoint");
    },

});

Firebug.Querypoint.LastChangeQPRep = domplate(Firebug.Rep,
{
    tag:
        DIV({"class":"querypoint"},
                 SPAN({"class": "userLabel objectTitle"}, "$object|getTitle "),
                 TAG(FirebugReps.String.tag, {object: "$object|getQueryObjectRef"})
            ),

        titleTag:
             SPAN({"class": "objectTitle"}, "$object|getTitle"),

        getTitle: function(object)
        {
            return "Last Change";
        },

        getQueryObjectRef: function (object)
        {
            return object.getQueryObjectExpression();
        },

        // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

        className: "QueryPointLastChange",

        supportsObject: function(object, type)
        {
            return (object instanceof QueryPoint) && (object.getQueryType() == "lastChange");
        },

    });

Firebug.registerModule(Firebug.Querypoint.QPModule);
Firebug.registerStylesheet("chrome://qpfbug/content/ui/querypoints.css");
Firebug.registerPreference("querypoints.enableSites", false);
Firebug.registerPreference("querypoints.reproducer", "local");
Firebug.registerPanel(Firebug.Querypoint.QPSourceViewPanel);
Firebug.registerPanel(Firebug.Querypoint.QueryStatePanel);
Firebug.registerPanel(Firebug.Querypoint.QueryPointPanel);

Firebug.registerRep(Firebug.Querypoint.BreakPointRep);
Firebug.registerRep(Firebug.Querypoint.LastChangeQPRep);

}}});