var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- UIEventHandler --------------------------------

owner.UIEventHandler = function(){

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
                      var old_GetContextMenuItems = Firebug.getPanelType("dom").prototype.getContextMenuItems;


                      //'this': is one of the dom panels
                      var new_GetContextMenuItems = function(sourceLink, target)
                      {
                            var items = old_GetContextMenuItems.apply(this, arguments);
                            //todo if !context.stopped return items
                            var panel = target ? Firebug.getElementPanel(target) : null;
                            if (!panel) // the event must be on our chrome not inside the panel
                                return items;

                            var row = getAncestorByClass(target, "memberRow");
                            if (row)
                            {
                                  //todo needs more check for adding this item

//                                var rowName;
//                                // = getRowName(row);
//                                var labelNode = row.getElementsByClassName("memberLabelCell").item(0);
//                                rowName = labelNode.textContent;
//
//                                var rowObject = this.getRowObject(row);
//                                var rowValue = this.getRowPropertyValue(row);
//
//                                var isWatch = hasClass(row, "watchRow");
//                                var isStackFrame = rowObject instanceof jsdIStackFrame;

                                var uiEventHandler = Firebug.qpfbug.uiEventHandler;
                                items.push({label: "Last Change",  id: "lastChange", 
                                            command: bindFixed(uiEventHandler.lastChangeAction, uiEventHandler, this, row)});
                            }
                            return items;
                       };

                      // change panels
                      Firebug.getPanelType("dom").prototype.getContextMenuItems = new_GetContextMenuItems;
                      Firebug.getPanelType("domSide").prototype.getContextMenuItems = new_GetContextMenuItems;
                      Firebug.getPanelType("watches").prototype.getContextMenuItems = new_GetContextMenuItems;
                  }};
            },

             //this : is a uiEventHandler object as expected.
             lastChangeAction : function(domPanel, row)
             {
                  with(this.win){
                  with(FBL){
                     //--------------- local functions --------------------------------
                     // We have to define these functions because they are kind of private
                     // in dom.js .


                     var getRowValue = function(row)
                     {
                         var valueNode = row.getElementsByClassName("memberValueCell").item(0);
                         return valueNode.firstChild.repObject;
                     };

                     //It goes up until reaches the parent row
                     var getParentRow = function(row)
                     {
                         var level = parseInt(row.getAttribute("level"))-1;
                         // If it's top level object the level is now set to -1, is that a problem?
                         for (row = row.previousSibling; row; row = row.previousSibling)
                         {
                             if (parseInt(row.getAttribute("level")) == level)
                                 return row;
                         }
                     };

                     var getRowOwnerObject = function (row)
                     {
                         var parentRow = getParentRow(row);
                         if (parentRow)
                             return getRowValue(parentRow);
                     };
                    // ----------------------------------------------------------------

                     // the value of row, object or primitive
                     var rowValue = getRowValue(row);

                     // getting the owner;
                     var owner;


                     var owner = getRowOwnerObject(row);

                     //domPanel.selection is the whole object which is shown in dom panel
                     // so if row is at top level the owner will be the whole object of
                     // dom panel.
                     owner = owner ? owner : domPanel.selection;

                     var type = typeof(rowValue);

                     if (type == "object")
                     {

                     }else if(type == "string")
                     {

                     }else if(type == "number")
                     {

                     }else if (type == "undefined")
                     {

                     }else if (type == "boolean")
                     {

                     }else if (type == "xml")
                     {

                     }else if (type == "function")
                     {

                     }

                     var propertyPath = domPanel.getPropertyPath(row).join("");
                     var propertyName = domPanel.getRowPathName(row);
                     // value is something like  [., name] so we ignore the separator(dot).
                     propertyName = propertyName[1];

                     if (propertyPath.match(/^scopeChain\[/) != null) //startsWith scopeChain[
                     {
                         propertyPath = propertyPath.substring(valueRef.indexOf("].")+2, propertyPath.length);
                     }

                     //todo move this tag to another place
                     var context = domPanel.context;
                     context.inQuery = true;
                     
                     Manager.getInstance().addLastChange(domPanel.context, owner, propertyPath);
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