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
                this.addLastChangeMenuItem();
            },
            //----------------------- Changes getContextMenuItems --------------
            // Adds "lastChange" menuItem to popup menu
            // There is also another strategy. We could change Firebug.reps
            // to change "getContextMenuItems", However, due to a bug we change
            // panels.
            //
            // paramters: window: the global object
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
                        // for example if a fram is shown in dom panel it accepts but it shouldn't

                        if (domPanel && row){

                            var propertyPath = domPanel.getPropertyPath(row).join("");
                            if (propertyPath.match(/^scopeChain\[/) != null) //startsWith scopeChain[
                            {
                                propertyPath = propertyPath.substring(propertyPath.indexOf("].")+2, propertyPath.length);
                            }

                            if (propertyPath.match(/^\[/) != null) //startsWith ["[object Window]"] //todo
                            {
                                propertyPath = propertyPath.substring(propertyPath.indexOf("].")+2, propertyPath.length);
                            }

                            if (propertyPath.match(/^Window/) != null) //startsWith Window //todo it is only for datatrace
                            {
                                propertyPath = propertyPath.substring(propertyPath.indexOf(".")+1, propertyPath.length);
                            }

                            if (domPanel.selection instanceof JSDConstants.jsdIStackFrame){ //watches panel
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
                            }else
//                            if (domPanel.selection != domPanel.context.window){ //dom panel
//                                if (domPanel.context.stopped){
//
//                                }
//                            }else
//                            if (domPanel.selection instanceof DebugModel){  //tracedata //todo correct it

                                items.push({label: "Last Change",  id: "lastChange",
                                            command: bindFixed(uiEventHandler.lastChangeOnQuerypointyAction,
                                            uiEventHandler, domPanel.context,
                                            domPanel.currentTracepoint.querypoint,
                                            propertyPath)
                                          });
//                            }
                        }

                        return items;
                    };

                      // change domPanels
                    panelType_Dom.prototype.getContextMenuItems = new_GetContextMenuItems;
                    panelType_DomSide.prototype.getContextMenuItems = new_GetContextMenuItems;
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
                with(this.win){
                with(FBL){
//                    //--------------- local functions --------------------------------
//                     // We have to define these functions because they are kind of private
//                     // in dom.js .
//
//                    var getRowValue = function(row)
//                    {
//                        var valueNode = row.getElementsByClassName("memberValueCell").item(0);
//                        return valueNode.firstChild.repObject;
//                    };
//
//                    //It goes up until reaches the parent row
//                    var getParentRow = function(row)
//                    {
//                        var level = parseInt(row.getAttribute("level"))-1;
//                        // If it's top level object the level is now set to -1, is that a problem?
//                        for (var row = row.previousSibling; row; row = row.previousSibling)
//                        {
//                            if (parseInt(row.getAttribute("level")) == level)
//                                return row;
//                        }
//                    };
//
//                    var getRowOwnerObject = function (row)
//                    {
//                        var parentRow = getParentRow(row);
//                        if (parentRow)
//                            return getRowValue(parentRow);
//                    };
//
//                    // the value of row, object or primitive
//                    var rowValue = getRowValue(row);
//
//                    // getting the owner;
//                    var rowOwnerObject;
//
//                    var rowOwnerObject = getRowOwnerObject(row);
//
//                    //domPanel.selection is the whole object which is shown in the dom panel
//                    // so if row is at top level the rowOwnerObject will be the whole object of
//                    // dom panel.
//                    rowOwnerObject = rowOwnerObject ? rowOwnerObject : domPanel.selection;
//
//                    var propertyPath = domPanel.getPropertyPath(row).join("");
//                    var propertyName = domPanel.getRowPathName(row);
//
//                    // value is something like  [., name] so we ignore the separator(dot).
//                    propertyName = propertyName[1];

                    Manager.getInstance().findLastChangeFromBreakpoint(context, propertyPath);

                }}

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
         //"this" which is passed to this object is a dom panel
         return constructor;
    }();
}}

};