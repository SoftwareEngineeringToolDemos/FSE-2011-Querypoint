/* 
 * Author: Jan Odvarko, www.janodvarko.cz
 */

FBL.ns(function() { with (FBL) { 

var Cc = Components.classes; var Ci = Components.interfaces;

function QueryPointPanel() {}
QueryPointPanel.prototype = extend(Firebug.Panel,
{ 
    name: "QP4FB",
    title: "QP4FB!", 

    initialize: function() {
      Firebug.Panel.initialize.apply(this, arguments);

      Firebug.Console.log("--------------------");
      var panel = this;
//      qp4fbRep.myTag.append(null, panel.panelNode, null);

//      var checkIT = content;

    },
});

/**
 * Model implementation.
 */
Firebug.QP4FBModel = extend(Firebug.Module,
{
    initContext: function(context, persistedState)
    {
       object = context.window;
       if (object.wrappedJSObject)
                object = object.wrappedJSObject;
       alert("Hi!");
//       this.jsd = Cc["@mozilla.org/js/jsd/debugger-service;1"].getService(Ci.jsdIDebuggerService);
//       if (!jsd.isOn)
//        {
//            jsd.on();
//        }
//       jsd.flags=0;
//       alert(jsd.flags);
//       Firebug.Console.log("INTERRUPT_HOOK");
//       alert("interruptHook");
//       Firebug.Console.log("++++++++++++++++++++");

//       var XXXX = 0
//		var filterAll = { //The filter that doesn't allow anything to pass through
//				globalObject: null,
//				flags: Ci.jsdIFilter.FLAG_ENABLED,
//				urlPattern: "*",
//				startLine: 0,
//				endLine: 0
//			};
//		this.jsd.appendFilter(filterAll);
       Firebug.LASTXXXN = 0;
//       this.jsd.interruptHook = {
		var	onExecute: function(frame,type,val) {
//				XXXX++;
//				if (XXXX % 1000 == 0)
//				    Firrebug.Console.log();

                if (frame && frame.functionName!=Firebug.LASTXXX){
//                      Firebug.Console.log(frame.pc);
//                    Firebug.Console.log(frame.isConstructing);
                    Firebug.LASTXXX = frame.functionName;
                    Firebug.LASTXXXN++;

                    if ( frame.thisValue.objectValue.creatorURL &&
                       frame.thisValue.objectValue.creatorURL
                       == "file:///C:/salmir/work/epfl/projects/38_qp4firebug/projects/js-app/test.html"
                       ){
                          //frame.thisValue.objectValue.creatorURL.endsWith('test.html')){
//                        Firebug.Console.log(Firebug.LASTXXXN);

                        this.writeStack = function (x){
                            if (x)
                            {
                                Firebug.Console.log("-------------------");
                                Firebug.Console.log(x.functionName);
                                Firebug.Console.log(x.script.fileName + " (" + x.line + ")");

                                var wrappedJSDValue = jsd.wrapValue(x);
//                                Firebug.Console.log(x.thisValue);
                                Firebug.Console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$444");
                                Firebug.Console.log(wrappedJSDValue);
                                if (wrappedJSDValue && !wrappedJSDValue.isNumber &&
                                    !wrappedJSDValue.isPrimitive)
                                {

                                Firebug.Console.log(wrappedJSDValue.objectValue);
                                Firebug.Console.log(wrappedJSDValue.objectValue.creatorURL);
                                Firebug.Console.log(wrappedJSDValue.objectValue.creatorLine);
                                Firebug.Console.log(wrappedJSDValue.objectValue.constructorURL);
                                }
                                if (x.callingFrame)
                                    this.writeStack(x.callingFrame);
                            }
                        },
                        this.writeStack(frame);

                        this.writeObjectProps = function(o)
                        {
                            var str = "";
                            Firebug.Console.log("(((((((((((((((((");
                            var p;
                            Firebug.Console.log(o);
                            for (p in o){
//                                Firebug.Console.log("1010101010");
                                     str += ", " + p;
                            }
                            Firebug.Console.log("))))))))))))))");
                            Firebug.Console.log(str);
                        },
                        Firebug.Console.log(">>>>>>>>>>>>>>>>>>>>>");
                        win = context.window;
                        if (win.wrappedJSObject)
                            win = win.wrappedJSObject;

                        this.writeObjectProps(win);

                        Firebug.Console.log(">>>>>>>>>>>>>>>>>>>>>2");
                        if (win.myObject){
                            Firebug.Console.log(">>>>>>>>>>>>>>>>>>>>>3");
                            this.writeObjectProps(win.myObject);
                            Firebug.Console.log(win.myObject.first);
                            Firebug.Console.log(">>>>>>>>>>>>>>>>>>>>>4");
//                            Firebug.Console.log.(win.myObject.creatorURL)
//                            Firebug.Console.log.(win.myObject.creatorLine)
//                            Firebug.Console.log.(win.myObject.constructorURL)
                        }
                        Firebug.Console.log("+++++++++++++++++++");
//                        Firebug.Console.log(frame.thisValue);
//                        Firebug.Console.log(frame.thisValue.getWrappedValue());
//                        Firebug.Console.log(frame.thisValue.objectValue);
                    }
//                    if (Firebug.LASTXXX == "changeProperty")
//                        Firebug.Console.log(frame.thisValue);
//                    Firebug.Console.log(frame.thisValue);

                }

//					Firebug.Console.log("exec");
//					if (frame)
//					{
//					    var pc = frame.pc;
//		                var ppLine = frame.script.pcToLine(pc, Ci.jsdIScript.PCMAP_PRETTYPRINT);
//					    if (pc && ppLine)
//					    {
//					        alarm("pc, ppline");
//					        alarm("exec: " + pc + " " + ppLine);
//					    }
//					}
					return Components.interfaces.jsdIExecutionHook.RETURN_CONTINUE;
				};
//			};

//        alert(object.creatorURL);
//        alert(object.creatorLine);
//        alert(object.constructorURL);
//        alert(object.constructorLine);
//        alert(object.value);
//       object.watch("myObject", function handler(prop,oldval, newval){
//            alert("oooooooooooooooo");
//            if (newval)
//            {
//                newval.watch("first", function handler2(prop2, oldval2, newval2){
//                    alert(prop2);
////                    for (x in newval2)
////                    {
////                       if (jsd)
////                            alert("jsd::: "+jsd);
////                       if (x)
////                            for (y in x)
////                               alert(prop2[x]+ "."+x[y]);
////
////                    }
//                    alert(oldval2 + " " + newval2);
//                    return newval2;
//                });
//            }
//            return newval;
//        });
    },

    addWatch : function (context)
    {
        object = context.window
          if (object.wrappedJSObject)
                object = object.wrappedJSObject
          var str = "OOOOOOOOOOOOOOOOOO";

          for (var name in object) // enumeration is safe
          {
//             str = str + " " + name;
             if (name == "myObject")
             {
                alert(name);
                object["myObject"].watch("first", function handler(prop, oldval, newval)
                {
                    // XXXjjb Beware: in playing with this feature I hit too much recursion multiple times with console.log
                    alert(oldval + " " + newval);
//                    // TODO Do something cute in the UI with the error bubble thing
//                    if (self.checked)
//                    {
//                        self.context.breakingCause = {
//                            title: $STR("dom.Break On Property"),
//                            message: cropString(prop, 200),
//                            prevValue: oldval,
//                            newValue: newval
//                        };
//
//                        Firebug.Breakpoint.breakNow(self.context.getPanel("dom", true));
//                    }
//                    return 1000;
                    return newval;
                });
             }
          }
    },

    domChangeListener : function(evt) {
        alert("ooo");
//		alert(event);
		alert(evt.type+ " "+evt.target+ " "+evt.attrName)
	},

//    loadedContext: function(context)
//    {
//           //context.dom.breakpoints.load(context);
//           alert("LoadedContext : ");
//            //+ context.window);
//
//            var doc = context.window.document;
//
//            var doc = context.window;
//            doc.addEventListener("DOMAttrModified", this.domChangeListener, false);
//		    doc.addEventListener("DOMCharacterDataModified", this.domChangeListener, false);
//		    doc.addEventListener("DOMNodeInserted", this.domChangeListener, false);
//		    doc.addEventListener("DOMNodeRemoved", this.domChangeListener, false);
//
//           // addWatch(context)
//
//       },


       destroyContext: function(context, persistedState)
           {
//           alert("DDDDDDDDDDDDDDDDDDD");
//           alert(context.window.myObject);
           },


});

var qp4fbRep = domplate(
{
    date: (new Date()).toGMTString(),

    myTag:
        DIV({class: "MyDiv", onclick: "$onClick"},
            SPAN("OOOOOOOOOOOOOOOOOOO")
        ),

    onClick: function(event)
    {
//        var cont = context.window;
       var x = Firebug.Console;
        alert("OOOOOOOOOOOOOOOOOO");
       Firebug.Console.log("QP4FB");
       Firebug.Console.log(jsd);
       Firebug.Console.log(x);

//        alert(context);
//        alert(getBrowser().selectedTab.linkedBrowser.contentWindow);
//        alert(getBrowser().selectedTab.linkedBrowser.contentWindow.location);
//        alert(getBrowser().selectedTab.linkedBrowser.contentWindow.location.href);
//        alert(getBrowser().selectedTab.linkedBrowser.contentWindow.myObject);
//        alert(getBrowser().selectedTab.linkedBrowser.contentWindow.document);
//        alert(getBrowser().selectedTab.linkedBrowser.contentWindow.document.myObject);
//        alert(getBrowser());
//        alert(win.document.title);
////        alert(cont.document.defaultView);
//        alert(context);
//        alert(context.window);
//        alert(context.window.myObject);
//        alert(context.window.myObject.first);

//        alert(content.document);
//        alert(content.document);
//        alert(content.document.myObject);
//        alert(content.document.myObject.first);

//        alert(win.document.myObject.first+"");
//        alert("Hello World!");
    }
});

Firebug.registerPanel(QueryPointPanel); 
             Firebug.registerModule(Firebug.QP4FBModel); 


}});


