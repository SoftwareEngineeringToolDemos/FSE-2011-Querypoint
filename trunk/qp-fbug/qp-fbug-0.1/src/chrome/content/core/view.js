var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Lang){
with (QPFBUG.Classes){

var owner = QPFBUG.Classes;

//--------------------------------- View --------------------------------

owner.View = function(){

        var constructor = function(manager){
            this.manager = manager;
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
                  with(this.manager.win){
                  with(FBL){
                      var old_GetContextMenuItems = Firebug.getPanelType("dom").prototype.getContextMenuItems;

                      var manager = this.manager;
                      //'this': is one of the dom panels
                      var new_GetContextMenuItems = function(sourceLink, target)
                      {
                            var items = old_GetContextMenuItems.apply(this, arguments);
                            var panel = target ? Firebug.getElementPanel(target) : null;
                            if (!panel) // the event must be on our chrome not inside the panel
                                return items;

                            var row = getAncestorByClass(target, "memberRow");
                            if (row)
                            {
                                var rowName;
                                // = getRowName(row);
                                var labelNode = row.getElementsByClassName("memberLabelCell").item(0);
                                rowName = labelNode.textContent;

                                var rowObject = this.getRowObject(row);
                                var rowValue = this.getRowPropertyValue(row);

                                var isWatch = hasClass(row, "watchRow");
                                var isStackFrame = rowObject instanceof jsdIStackFrame;

                            items.push(
                                {label: "Last Change", command: bindFixed(manager.view.lastChange, this, row)});
                            }
                            return items;
                       };

                      // change panels
                      Firebug.getPanelType("dom").prototype.getContextMenuItems = new_GetContextMenuItems;
                      Firebug.getPanelType("domSide").prototype.getContextMenuItems = new_GetContextMenuItems;
                      Firebug.getPanelType("watches").prototype.getContextMenuItems = new_GetContextMenuItems;
                  }};
            },

             lastChange : function(row)
             {
                 //--------------- local functions --------------------------------
                 // We have to define these functions because they are kind of private
                 // in dom.js .
                 var getRowValue = function(row)
                 {
                     var valueNode = row.getElementsByClassName("memberValueCell").item(0);
                     return valueNode.firstChild.repObject;
                 }

                 var getRowOwnerObject = function (row)
                 {
                     var parentRow = getParentRow(row);
                     if (parentRow)
                         return getRowValue(parentRow);
                 };

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

                // ----------------------------------------------------------------

                 var value = this.getRowPathName(row);
                 value = value[1]; //don't want the separator
                 Firebug.Console.log(value);

                 var object = getRowOwnerObject(row);


                 object = object ? object : this.selection;
                 //getRealObject
                 object = unwrapObject(object)

                 var propertyValue = this.getObjectPropertyValue(object, row.domObject.name);

                 Firebug.Console.log(propertyValue);
                 Firebug.Console.log(typeof(propertyValue));

                 var objectToDebug = value;

                 var wrappedJSDValue = jsd.wrapValue(propertyValue);

                 // NO good reason for getting js parent only because it works
                 wrappedJSDValue = wrappedJSDValue.jsParent;
                 propertyValue.newProp = 29;


                 Firebug.Console.log(wrappedJSDValue.objectValue);
                 Firebug.Console.log(wrappedJSDValue.objectValue.creatorURL);
                 Firebug.Console.log(wrappedJSDValue.objectValue.creatorLine);
                 Firebug.Console.log(wrappedJSDValue.objectValue.constructorURL);

         //		Components.utils.import("resource://qp4fb/concept/tracepoint.js", this);

         //        var point = new this.TracePointFactory(wrappedJSDValue.objectValue.creatorURL,
         //                                          wrappedJSDValue.objectValue.creatorLine,
         //                                          value);
         //        Firebug.Console.log("Point : "+ point.toString());


                 var sourceFile = this.context.sourceFileMap[wrappedJSDValue.objectValue.creatorURL];
         //        var sourceFile = FirebugContext[wrappedJSDValue.objectValue.creatorURL];
         //        sourceFile.href = wrappedJSDValue.objectValue.creatorURL;
                 Firebug.Debugger.setBreakpoint(sourceFile, wrappedJSDValue.objectValue.creatorLine);
         //          fbs.setBreakpoint(//,
         //                            wrappedJSDValue.objectValue.creatorLine, null, Firebug.Debugger);


                 Firebug.Console.log(this.context.stopped);
                 if (this.context.stopped)
                 { //get info about bp
                   // get breakpoin for url and line no and see if it is active or not.
                   Firebug.Console.log("debugFrame");
         //          Firebug.Console.log(this.context.debugFrame);
                   Firebug.Console.log(this.context.debugFrame.script.fileName);
                   Firebug.Console.log(this.context.debugFrame.line);
                   Firebug.Console.log(this.context.executingSourceFile.href);
                   var bp = fbs.findBreakpoint(this.context.executingSourceFile.href, this.context.debugFrame.line);
                   if (bp)
                     Firebug.Console.log(bp);
                 }

                 QPFBUG.manager.reproducer.reproduce(10,10); //TODO changeit
             }

         };

         //"this" which is passed to this object is a dom panel

         return constructor;


    }();
}}

};