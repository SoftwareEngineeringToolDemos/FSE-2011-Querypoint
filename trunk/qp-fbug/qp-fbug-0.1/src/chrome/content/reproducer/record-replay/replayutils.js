var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- JSDConstants --------------------------------
owner.ReplayUtils = {

        openNewTab : function(win, url, attributes, callback)
        {
            var tabbrowser = win.getBrowser();

            // Open new tab and mark as 'test' so it can be closed automatically.
            var newTab = tabbrowser.addTab(url);
            for (var attribute in attributes){
                newTab.setAttribute(attribute, attributes[attribute]);
            }
            tabbrowser.selectedTab = newTab;

            // Wait till the new window is loaded.
            var browser = tabbrowser.getBrowserForTab(newTab);
            ReplayUtils.waitForWindowLoad(browser, callback);

            return newTab;
        },

        waitForWindowLoad : function(browser, callback)
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
                     browser.contentWindow.setTimeout(executeCallback, 100);
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
        },

        fireEvent : function(document, element, event){
            trace("-------------------------------");
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, true ); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        }
    };
}}
};