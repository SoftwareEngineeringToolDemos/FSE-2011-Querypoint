var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

owner.HardWiredReproducer = function(){

        var constructor = function(){
        };

        constructor.prototype =
        {
                toString: function()
                {
                    return "[HardWiredReproducer]";
                },

                reproduce: function (context, debugSessionId, reproductionId)
                {
                    var  win = context.qpfbug.firefoxWindow;
                    with(win){
                    with(FBL){

                        var url = context.window.location.toString();

                        var tabBrowser = win.FBL.$("content");
                        tabBrowser.removeTab(context.qpfbug.tab);  // this will stop debugging the context for sure


                        var openNewTab = function(url, callback)
                        {
                            var tabbrowser = getBrowser();

                            // Open new tab and mark as 'test' so it can be closed automatically.
                            var newTab = tabbrowser.addTab(url);
                            newTab.setAttribute("debugSessionId", debugSessionId);
                            newTab.setAttribute("reproductionId", reproductionId);
                            tabbrowser.selectedTab = newTab;

                            // Wait till the new window is loaded.
                            var browser = tabbrowser.getBrowserForTab(newTab);
                            waitForWindowLoad(browser, callback);

                            return newTab;
                        }

                        var waitForWindowLoad = function(browser, callback)
                        {
                            // If the callback isn't specified don't watch the window load at all.
                            if (!callback)
                                return;

                            var loaded = false;
                            var painted = false;

                            // Wait for all event that must be fired before the window is loaded.
                            // Any event is missing?
                            // xxxHonza: In case of Firefox 3.7 the new 'content-document-global-created'
                            // (bug549539) could be utilized.
                            var waitForEvents = function(event)
                            {
                                if (event.type == "load")
                                {
                                    browser.removeEventListener("load", waitForEvents, true);
                                    loaded = true;
                                }
                                else if (event.type == "MozAfterPaint")
                                {
                                    browser.removeEventListener("MozAfterPaint", waitForEvents, true);
                                    painted = true;
                                }

                                // Execute callback after 100ms timout (the inspector tests need it for now),
                                // but this shoud be set to 0.
                                if (loaded && painted)
                                    setTimeout(executeCallback, 100);
                            }

                            // All expected events have been fired, execute the callback.
                            var executeCallback = function()
                            {
                                try
                                {
                                    var win = browser.contentWindow;

                                    // This is a workaround for missing wrappedJSObject property,
                                    // if the test case comes from http (and not from chrome)
                                    // xxxHonza: this is rather a hack, it should be removed if possible.
                                    if (!win.wrappedJSObject)
                                        win.wrappedJSObject = win;

                                    // The window is loaded, execute the callback now.
                                    callback(win);
                                }
                                catch (exc)
                                {
                                    FBTest.sysout("runTest FAILS " + exc, exc);
                                    FBTest.ok(false, "runTest FAILS " + exc);
                                }
                            }

                            browser.addEventListener("load", waitForEvents, true);
                            browser.addEventListener("MozAfterPaint", waitForEvents, true);
                        }

                        var newTab = openNewTab(url,
                          callback = function(win)
                          {
                            var node = win.document.getElementById("myBody");
                            // on cliec
                            var doc = node.ownerDocument, event = doc.createEvent("MouseEvents");
                            event.initMouseEvent("click", true, true, doc.defaultView, 0, 0, 0, 0, 0,
                                false, false, false, false, 0, null);
                            node.dispatchEvent(event);
                          }
                        );
                    //----- second phase
                    //----- the start of the second phase: after the next line the context will change

                        Firebug.Console.log("The end of reproduction " + reproductionId + ".");
                    }}
                },

        };

        return constructor;
    }();

}}

};