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
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("onStartDebugging tracepoints.show "+context.qpfbug.newResults);
        if (context.qpfbug.newResults)
        {
//            context.qpfbug.inSession = true;  // I don't know how we will get out of this state
            Firebug.chrome.selectSupportingPanel(UIUtils.getDebugModel(context), context, true);
            delete context.qpfbug.newResults;
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
        this.location = null;
        this.panelSplitter = $("fbPanelSplitter");
        this.sidePanelDeck = $("fbSidePanelDeck");
        this.onScroll = bind(this.onScroll, this);

        Firebug.SourceBoxPanel.initialize.apply(this, arguments);
    },

    onScroll: function(event)
    {
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("onScroll "+this.name, event);
        var scrollingElement = event.target;
        this.reView(scrollingElement);
    },

    initializeNode: function(oldPanelNode)
    {
        this.tooltip = this.document.createElement("div");
        setClass(this.tooltip, "scriptTooltip");
        this.tooltip.setAttribute('aria-live', 'polite')
        obscure(this.tooltip, true);
        this.panelNode.appendChild(this.tooltip);

        //this.panelNode.addEventListener("mousedown", this.onMouseDown, true);
        //this.panelNode.addEventListener("contextmenu", this.onContextMenu, false);
        //this.panelNode.addEventListener("mouseover", this.onMouseOver, false);
        //this.panelNode.addEventListener("mouseout", this.onMouseOut, false);
        this.panelNode.addEventListener("scroll", this.onScroll, true);

        Firebug.SourceBoxPanel.initializeNode.apply(this, arguments);
    },

    destroyNode: function()
    {
        if (this.tooltipTimeout)
            clearTimeout(this.tooltipTimeout);

        //this.panelNode.removeEventListener("mousedown", this.onMouseDown, true);
        //this.panelNode.removeEventListener("contextmenu", this.onContextMenu, false);
        //this.panelNode.removeEventListener("mouseover", this.onMouseOver, false);
        //this.panelNode.removeEventListener("mouseout", this.onMouseOut, false);
        this.panelNode.removeEventListener("scroll", this.onScroll, true);

        Firebug.SourceBoxPanel.destroyNode.apply(this, arguments);
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
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("QPSourceViewPanel.updateSelection "+object, object);
        if( object instanceof DebugSession)
            this.showDebugModel(object.debugModel);

        if( object instanceof DebugModel)
            this.showDebugModel(object);

        if( object instanceof Tracepoint)
            this.navigate(object);
    },

    refresh: function()
    {
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("tracepoints refresh");
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
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("querypoints frame "+frame, frame);
        this.showSourceFile(frame.sourceFile);

        var lineNumber = frame.line;
        this.scrollToLine(null, lineNumber, bind(this.highlightExecutionLine, this, lineNumber, "tracepoint_line"));

        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("QPSourceViewPanel.updateLocation "+tracepoint, tracepoint);
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
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("QPSourceViewPanel.getObjectDescription from tracepoint "+tracepoint, tracepoint);
        try
        {
            var frameXBs =  tracepoint.getStackFrames();
            if (FBTrace.DBG_QUERYPOINT)
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
        if (FBTrace.DBG_QUERYPOINT)
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
        if (FBTrace.DBG_QUERYPOINT)
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
                if (FBTrace.DBG_QUERYPOINT)
                    FBTrace.sysout("qp.decorator called for "+sourceFile.href);
                UIUtils.eachTracepoint(this.panel.context, function decorateTracepoint(tp)
                {
                    var frameXB = UIUtils.getFrameByTracepoint(tp);
                    if (FBTrace.DBG_QUERYPOINT)
                        FBTrace.sysout("qp.decorateTracepoint frameXB "+frameXB, {tp:tp, frameXB:frameXB});
                    if (frameXB.href === sourceFile.href)
                    {
                        if (FBTrace.DBG_QUERYPOINT)
                            FBTrace.sysout("qp.decorator found match "+sourceFile.href);
                        var lineNo = frameXB.line;
                        if (lineNo >= sourceBox.firstViewableLine && lineNo <= sourceBox.lastViewableLine)
                        {
                            var row = sourceBox.getLineNode(lineNo);
                            if (FBTrace.DBG_QUERYPOINT)
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
        var enabled = (UIUtils.getDebugSession(this.context).getNumberOfQuerypoints() > 0);
        if (FBTrace.DBG_QUERYPOINT)
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

Firebug.Querypoint.TraceDataPanel.prototype = extend(Firebug.WatchPanel.prototype,
{
    tag: Firebug.DOMPanel.DirTable.watchTag,

    rebuild: function()
    {


    },

    // called by panel selection
    updateSelection: function(object)
    {
        var tracepoint = object;

        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("TraceDataPanel.updateSelection "+tracepoint, tracepoint);
        if( ! (tracepoint instanceof Tracepoint) )
            return;

        var newTracepoint = (tracepoint !== this.currentTracepoint);
        if (newTracepoint)
        {
            this.toggles = new ToggleBranch();
            this.currentTracepoint = tracepoint;
        }

        var traceMembers = [];
        if (tracepoint.getQueryType() === "lastChange")
        {
            var expr =  tracepoint.querypoint.getQueryObjectExpression();
            var traceData = UIUtils.getTraceData(tracepoint);
            this.addMember(traceData, "query", traceMembers, traceData.expr, traceData.traceData, 0);
        }

        var members = this.generateScopeChain(tracepoint.traceFrame.traceScope, traceMembers);
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("TraceDataPanel.rebuild traceData: "+members.length, members);

        this.expandMembers(members, this.toggles, 0, 0, this.context);
        this.showMembers(members, !newTracepoint);
    },

    onPanelNavigate: function(object, panel)
    {
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("TraceData onPanelNavigate "+panel.name)
        if (panel !== this.mainPanel)
            return;

        if (object instanceof Tracepoint)
            this.select(this.mainPanel.location, true);
    },

    showEmptyMembers: function()
    {
        FirebugReps.Warning.tag.replace({object: "NoMembersWarning"}, this.panelNode);
    },

    generateScopeChain: function (scope, members)
    {
        while (scope) {
            var scopeVars;
            // getWrappedValue will not contain any variables for closure
            // scopes, so we want to special case this to get all variables
            // in all cases.
            if (scope.jsClassName == "Call") {
                var scopeVars = scope.variableValues;
                scopeVars.toString = function() {return "Closure Scope";}
            } else {
                scopeVars = scope.variableValues;
            }

            if (scopeVars && scopeVars.hasOwnProperty)
            {
                if (!scopeVars.hasOwnProperty("toString")) {
                    (function() {
                        var className = scope.jsClassName;
                        scopeVars.toString = function() {
                            return $STR(className + " Scope");
                        };
                    })();
                }

                this.addMember(scopeVars, "scopes", members, scopeVars.toString(), scopeVars, 0);
            }
            else
            {
                if (FBTrace.DBG_ERRORS)
                    FBTrace.sysout("tracedata.generateScopeChain: bad scopeVars");
            }
            scope = scope.parentScope;
        }

        return members;
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
        this.mainPanel =  this.context.getPanel("tracepoints", false);
        Firebug.registerUIListener(this);
    },

    destroy: function(state)
    {
        Firebug.DOMBasePanel.prototype.destroy.apply(this, arguments);
    },

    show: function(state)
    {
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("TraceData show ", this);
         if (this.mainPanel.location)
             this.updateSelection(this.mainPanel.location);
    },

    initializeNode: function(oldPanelNode)
    {
        Firebug.DOMBasePanel.prototype.initializeNode.apply(this, arguments);
    },

    destroyNode: function()
    {
        Firebug.DOMBasePanel.prototype.destroyNode.apply(this, arguments);
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
    if (FBTrace.DBG_QUERYPOINT)
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

Firebug.Querypoint.ReproductionsRep = domplate(Firebug.Rep,
{
    tag: DIV({"class":"reproductionSelector"},
            FirebugReps.OBJECTLINK({"class":"previousReproduction"}, "$object|getPreviousReproduction"),
            SPAN({"class":"currentReproduction"}, "$object|getTitle"),
            FirebugReps.OBJECTLINK({"class":"previousReproduction"}, "$object|getNextReproduction"),
            TAG(Firebug.Querypoint.TracepointsTag.tag, {object: "$object|getTracepoints"})
            ),

    getTitle: function(object)
    {
        return object.id;
    },

    getPreviousReproduction: function(object)
    {
        return "< " + (object.id - 1);
    },

    getNextReproduction: function(object)
    {
        return (object.id + 1) +">"
    },

    getTracepoints: function(reproduction)
    {
        return reproduction.trace.tracepoints;
    },

    className: "QuerypointReprodution",

    supportsObject: function(object, type)
    {
        return (object instanceof QPFBUG.Classes.Reproduction);
    },

});


/*
 * Reproductions, shows objects of type QPFBUG.Classes.Reproduction
 */
Firebug.Querypoint.ReproductionsPanel = function ReproductionsPanel() {}

Firebug.Querypoint.ReproductionsPanel.prototype = extend(Firebug.DOMBasePanel.prototype,
{

    // called by navigate when object != this.location
    updateLocation: function(object)
    {
        if (object instanceof Tracepoint)
        {
            var reproduction = UIUtils.getReproduction(this.context);  // WRONG need reproduction by tracepoint
            this.select(reproduction);
        }
    },

    syncToMainPanel: function()
    {
        var mainPanel =  this.context.getPanel("tracepoints", false);
        this.navigate(mainPanel.location);
    },

    // called by select when object != this.selection
    updateSelection: function(object)
    {
        if (object instanceof Reproduction)
        {
            if (FBTrace.DBG_QUERYPOINT)
                FBTrace.sysout("ReproductionsPanel.updateLocation "+object, object);
            Firebug.Querypoint.ReproductionsRep.tag.replace({object:object}, this.panelNode, Firebug.Querypoint.ReproductionsRep);
        }
    },

    showEmptyMembers: function()
    {
        FirebugReps.Warning.tag.replace({object: "NoMembersWarning"}, this.panelNode);
    },



    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // extends Panel

    name: "Reproductions",
    title: "Reproductions",
    order: 2,
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
        this.syncToMainPanel();
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
    order: 1,
    enableA11y: true,
    deriveA11yFrom: "console",

    rebuild: function()
    {
        var mainPanel =  this.context.getPanel("tracepoints", false);

        this.location = new StackTrace(mainPanel.location.getStackFrames());

        this.updateLocation(this.location);

        if ( !(this.selection instanceof StackFrame) )
            this.selection = this.getDefaultSelection();

        this.updateSelection(this.selection);
    },

    updateLocation: function(object)
    {
        Firebug.CallstackPanel.prototype.updateLocation.apply(this, arguments);
    },

    updateSelection: function(object)
    {
        if (FBTrace.DBG_QUERYPOINT)
            FBTrace.sysout("TraceStack.updateSelection ", object);

        Firebug.CallstackPanel.prototype.updateSelection.apply(this, arguments);

    },

    getDefaultSelection: function()
    {
        return this.location && this.location.frames[0];
    },

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