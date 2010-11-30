var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- UIEventHandler --------------------------------

__owner.UIEventHandler = function(){

        var constructor = function(win){
            this.win = win;
        };

        constructor.prototype =
        {

            init : function()
            {
                this.updateScriptPanel();
                this.addLastChangeMenuItem();
            },

            updateScriptPanel: function(){
                with(this.win){
                    Firebug.Debugger.localRerun = Firebug.Debugger.rerun;
                    Firebug.Debugger.rerun = bind(Manager.getInstance().replay,Manager.getInstance());

                    var old_SyncCommands = Firebug.Debugger.syncCommands;
                    Firebug.Debugger.syncCommands = function(context){
                        old_SyncCommands.apply(Firebug.Debugger, arguments);
                        var chrome = Firebug.chrome;
                        if (!chrome)
                            return;
                        chrome.setGlobalAttribute("cmd_rerun", "disabled", "false"); //enable re_run again
                    }
                }
            },
            //----------------------- Changes getContextMenuItems --------------
            // Adds "lastChange" menuItem to popup menu
            // There is also another strategy. We could change Firebug.reps
            // to change "getContextMenuItems", However, due to a bug we change
            // panels.
            //
            // 'this': is not specified
            addLastChangeMenuItem : function()
            {
                with(this.win){
                with(FBL){

                    var panelType_Dom = Firebug.getPanelType("dom");
                    var panelType_DomSide = Firebug.getPanelType("domSide");
                    var panelType_Watches = Firebug.getPanelType("watches");
                    var panelType_TraceData = Firebug.getPanelType("TraceData");

                    var old_GetContextMenuItems = panelType_Dom.prototype.getContextMenuItems;

                      //'this': is one of the dom panels
                    var new_GetContextMenuItems = function(sourceLink, target)
                    {
                        var uiEventHandler = Firebug.qpfbug.uiEventHandler;

                        var items = old_GetContextMenuItems.apply(this, arguments);

                        var domPanel = target ? Firebug.getElementPanel(target) : null;

                        var row = getAncestorByClass(target, "memberRow");


                        //todo conditions should be based on panel
                        // for example if a frame is shown in dom panel it accepts but it shouldn't

                        if (domPanel && row){

                            var propertyPath = UIUtils.getPropertyPath(domPanel,row).join("");

                            if (UIUtils.isResultRow(row)) // no lastChange for the result rows
                                return items;

                            if (propertyPath == "this") // no lastChange for "this"
                                return items;

                            if (domPanel.selection instanceof JSDConstants.jsdIStackFrame) { //watches panel
                                if (domPanel.context.stopped){
                                    var isWatch = false;
                                    isWatch = hasClass(row, "watchRow");
                                    if (!isWatch){
                                        items.push({label: "Last Change",  id: "lastChange",
                                                    command: bindFixed(uiEventHandler.lastChangeOnBreakpointAction,
                                                    uiEventHandler, domPanel.context,
                                                    propertyPath)
                                                  });
                                    }
                                }
                            } else {
                                var previousQP = domPanel.currentTracepoint ? domPanel.currentTracepoint.querypoint : null;
                                items.push({label: "Last Change",  id: "lastChange",
                                            command: bindFixed(uiEventHandler.lastChangeOnQuerypointyAction,
                                            uiEventHandler, domPanel.context,
                                            previousQP,
                                            propertyPath)
                                          });
                            }
                        }

                        return items;
                    };

                    // change domPanels
                    //panelType_Dom.prototype.getContextMenuItems = new_GetContextMenuItems;
                    //panelType_DomSide.prototype.getContextMenuItems = new_GetContextMenuItems;
                    panelType_Watches.prototype.getContextMenuItems = new_GetContextMenuItems;
                    panelType_TraceData.prototype.getContextMenuItems = new_GetContextMenuItems;
                }};
            },

            //this : is a uiEventHandler object as expected.
            lastChangeOnQuerypointyAction : function(context, querypoint, propertyPath){
                Manager.getInstance().findLastChangeFromQuerypoint(context, querypoint, propertyPath);
            },
            //this : is a uiEventHandler object as expected.
            lastChangeOnBreakpointAction : function(context, propertyPath){
                    Manager.getInstance().findLastChangeFromBreakpoint(context, propertyPath);
            }

        };

        constructor.getInstance = function(win){
            if (!win.Firebug.qpfbug.uiEventHandler)
            {
                var uiEventHandler = new UIEventHandler(win);
                Lang.wrapFunctionsWithTryCatch(uiEventHandler);
                win.Firebug.qpfbug.uiEventHandler = uiEventHandler;
            }
            return win.Firebug.qpfbug.uiEventHandler;
        };

        return constructor;
    }();
}}

};