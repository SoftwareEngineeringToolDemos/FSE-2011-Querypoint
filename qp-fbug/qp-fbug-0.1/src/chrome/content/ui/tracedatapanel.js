var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{
with (QPFBUG.FBL){
with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //------------------------------- SourceViewPanel ----------------------------------
    __owner.TraceDataPanel = function(){

        var constructor = function(){

            extendFromParent(this, FB.SourceBoxPanel);
        };

        constructor.prototype = {

            tag: Firebug.DOMPanel.DirTable.watchTag,

            rebuild: function()
            {


            },

            // called by panel selection
            updateSelection: function(object)
            {
                var tracepoint = object;

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
                FBTrace.sysout("TraceDataPanel.rebuild traceData: "+members.length, members);

                this.expandMembers(members, this.toggles, 0, 0, this.context);
                this.showMembers(members, !newTracepoint);
            },

            onPanelNavigate: function(object, panel)
            {
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
                            FBTrace.sysout("dom .generateScopeChain: bad scopeVars");
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
                 FBTrace.sysout("TraceData show", this);
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