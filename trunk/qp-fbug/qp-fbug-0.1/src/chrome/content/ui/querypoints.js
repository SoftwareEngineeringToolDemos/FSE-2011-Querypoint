/* See license.txt for terms of usage */

FBL.ns(function() { with (FBL) {


// ************************************************************************************************

/*
 *
 * @panel A Firebug panel that displays and controls Querypoint functionality. It looks like the script panel but act
 * differently.
 *
 * location objects are QPFBUG.Classes.TracePoint objects.
 */


Firebug.Querypoint = {};

Firebug.Querypoint.QPModule = extend(Firebug.ActivableModule,
{
    dispatchName: "qpModule",

    initContext: function(context, persistedState)
    {
        context.querypoint = {reproducer: "local"};
        context.Firebug = Firebug; // I guess.
        Firebug.Debugger.addListener(this);
    },

    //********** Firebug.Debugger Listener *************************

    onStartDebugging: function(context)
    {
    	if (context.inQuery)
    		Firebug.chrome.selectSupportingPanel(context.qpfbug.debugSession.debugModel, context, true);
    },


});

Firebug.Querypoint.QPSourceViewPanel = function QPSourceViewPanel() {};

// Instance definition
Firebug.Querypoint.QPSourceViewPanel.prototype = extend(Firebug.SourceBoxPanel,
{
    name: "querypoints",
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
        if( object instanceof QPFBUG.Classes.DebugModel)
            return 10;
        if( object instanceof QPFBUG.Classes.TracePoint)
            return 10;
        else return 0;
    },

    updateSelection: function(object)
    {
    	FBTrace.sysout("queryPoints.updateSelection "+object, object);
    	if( object instanceof QPFBUG.Classes.DebugModel)
    		this.showDebugModel(object);
    		
    	if( object instanceof QPFBUG.Classes.TracePoint)
    		this.navigate(object);    		
    },
    
    showDebugModel: function(debugModel)
    {
    	if (debugModel !== this.context.qpfbug.debugSession.debugModel)
    		FBTrace.sysout("querypoints.showDebugModel OUT OF SYNC ");
    	
    	this.navigate(this.getDefaultLocation()); 
    },
    // ***********************************************
    // --- Querypoint locations are "TracePoints" ---

    updateLocation: function(tracePoint)
    {
        if (!tracePoint)
        {
            this.showWarningTag();
            return;
        }

        var sourceFile = getSourceFileByHref(tracePoint.url, this.context);
        if (sourceFile)
        {
        	this.showSourceFile(sourceFile);
        	this.scrollToLine(tracePoint.url, tracePoint.lineNo, this.jumpHighlightFactory(tracePoint.lineNo, this.context));
        }

        FBTrace.sysout("queryPoints.updateLocation "+tracePoint, tracePoint);
        var qstate = this.context.getPanel("QueryState", false);
        if (qstate)
        	qstate.updateSelection(tracePoint);
    },
    /*
     * Framework connection
     */
    getSourceType: function()
    {
        return "js";
    },
    
    getObjectLocation: function(tracePoint)
    {
    	FBTrace.sysout("queryPoints.getObjectDescription "+tracePoint, tracePoint);
        return tracePoint.url+"@"+tracePoint.lineNo;
    },

    // return.path: group/category label, return.name: item label
    getObjectDescription: function(tracePoint)
    {
    	FBTrace.sysout("queryPoints.getObjectDescription "+tracePoint, tracePoint);
        return {path: "Last Change", name: this.getObjectLocation(tracePoint)};
    },

    getLocationList: function()
    {
        return this.context.qpfbug.debugSession.debugModel.getTracePoints();
    },

    getDefaultLocation: function()
    {
        var list = this.getLocationList()
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
        var enabled = Firebug.Debugger.isAlwaysEnabled(); // TODO

        // These buttons are visible only if debugger is enabled.
        //this.showToolbarButtons("fbLocationSeparator", enabled);
        this.showToolbarButtons("fbLocationList", enabled);

        // Additional debugger panels are visible only if debugger
        // is enabled.
        this.panelSplitter.collapsed = !enabled;
        this.sidePanelDeck.collapsed = !enabled;

        this.highlight(this.context.stopped);

        if (!this.location)
            this.showWarningTag();
        else
            this.navigate(this.location);
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

});


/*
 * Q-State, shows objects of type QPFBUG.Classes.TraceObjectLog
 */
Firebug.Querypoint.QueryStatePanel = function QueryStatePanel() {}

Firebug.Querypoint.QueryStatePanel.prototype = extend(Firebug.DOMBasePanel.prototype,
{
    tag: Firebug.DOMPanel.DirTable.watchTag,

    rebuild: function()
    {
        this.updateSelection(this.selection);
    },

    updateSelection: function(tracePoint)
    {
    	FBTrace.sysout("QueryStatePanel.updateSelection "+tracePoint, tracePoint);
    	if( ! (tracePoint instanceof QPFBUG.Classes.TracePoint) )
    		return;
    	
    	var newTracePoint = (tracePoint !== this.currentTracePoint);
    	if (newTracePoint)
    	{
    		this.toggles = new ToggleBranch();
    		this.currentTracePoint = tracePoint;
    	}
    	
    	var members = tracePoint.traceObjects;
        this.expandMembers(members, this.toggles, 0, 0, this.context);
        this.showMembers(members, !newTracePoint);
    },

    showEmptyMembers: function()
    {
        this.tag.replace({domPanel: this, toggles: new ToggleBranch()}, this.panelNode);
    },

    addWatch: function(expression)
    {
        if (!this.watches)
            this.watches = [];

        for (var i = 0; i < this.watches.length; i++)
        {
            if (expression == this.watches[i])
                return;
        }

        this.watches.splice(0, 0, expression);
        this.rebuild(true);
    },

    removeWatch: function(expression)
    {
        if (!this.watches)
            return;

        var index = this.watches.indexOf(expression);
        if (index != -1)
            this.watches.splice(index, 1);
    },

    editNewWatch: function(value)
    {
        var watchNewRow = this.panelNode.getElementsByClassName("watchNewRow").item(0);
        if (watchNewRow)
            this.editProperty(watchNewRow, value);
    },

    setWatchValue: function(row, value)
    {
        var rowIndex = getWatchRowIndex(row);
        this.watches[rowIndex] = value;
        this.rebuild(true);
    },

    deleteWatch: function(row)
    {
        var rowIndex = getWatchRowIndex(row);
        this.watches.splice(rowIndex, 1);
        this.rebuild(true);

        this.context.setTimeout(bindFixed(function()
        {
            this.showToolbox(null);
        }, this));
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    showToolbox: function(row)
    {
        var toolbox = this.getToolbox();
        if (row)
        {
            if (hasClass(row, "editing"))
                return;

            toolbox.watchRow = row;

            var offset = getClientOffset(row);
            toolbox.style.top = offset.y + "px";
            this.panelNode.appendChild(toolbox);
        }
        else
        {
            delete toolbox.watchRow;
            if (toolbox.parentNode)
                toolbox.parentNode.removeChild(toolbox);
        }
    },

    getToolbox: function()
    {
        if (!this.toolbox)
            this.toolbox = Firebug.DOMBasePanel.ToolboxPlate.tag.replace({domPanel: this}, this.document);

        return this.toolbox;
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

    onMouseDown: function(event)
    {
        var watchNewRow = getAncestorByClass(event.target, "watchNewRow");
        if (watchNewRow)
        {
            this.editProperty(watchNewRow);
            cancelEvent(event);
        }
    },

    onMouseOver: function(event)
    {
        var watchRow = getAncestorByClass(event.target, "watchRow");
        if (watchRow)
            this.showToolbox(watchRow);
    },

    onMouseOut: function(event)
    {
        if (isAncestor(event.relatedTarget, this.getToolbox()))
            return;

        var watchRow = getAncestorByClass(event.relatedTarget, "watchRow");
        if (!watchRow)
            this.showToolbox(null);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // extends Panel

    name: "QueryState",
    title: "QState",
    order: 0,
    parentPanel: "querypoints",
    enableA11y: true,
    deriveA11yFrom: "console",

    initialize: function()
    {
        this.onMouseDown = bind(this.onMouseDown, this);
        this.onMouseOver = bind(this.onMouseOver, this);
        this.onMouseOut = bind(this.onMouseOut, this);

        Firebug.DOMBasePanel.prototype.initialize.apply(this, arguments);
    },

    destroy: function(state)
    {
        state.watches = this.watches;

        Firebug.DOMBasePanel.prototype.destroy.apply(this, arguments);
    },

    show: function(state)
    {
        if (state && state.qp)
            this.watches = state.watches;
    },

    initializeNode: function(oldPanelNode)
    {
        this.panelNode.addEventListener("mousedown", this.onMouseDown, false);
        this.panelNode.addEventListener("mouseover", this.onMouseOver, false);
        this.panelNode.addEventListener("mouseout", this.onMouseOut, false);

        Firebug.DOMBasePanel.prototype.initializeNode.apply(this, arguments);
    },

    destroyNode: function()
    {
        this.panelNode.removeEventListener("mousedown", this.onMouseDown, false);
        this.panelNode.removeEventListener("mouseover", this.onMouseOver, false);
        this.panelNode.removeEventListener("mouseout", this.onMouseOut, false);

        Firebug.DOMBasePanel.prototype.destroyNode.apply(this, arguments);
    },

    refresh: function()
    {
        this.rebuild(true);
    },

});

Firebug.registerModule(Firebug.Querypoint.QPModule);
Firebug.registerStylesheet("chrome://qpfbug/content/ui/querypoints.css");
Firebug.registerPreference("querypoints.enableSites", false);
Firebug.registerPanel(Firebug.Querypoint.QPSourceViewPanel);
Firebug.registerPanel(Firebug.Querypoint.QueryStatePanel);

}});