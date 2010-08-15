var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

owner.ReplayReproducer = function(){

        var constructor = function(){
        };

        constructor.prototype =
        {
                toString: function()
                {
                    return "[ReplayReproducer]";
                },

                reproduce: function (context, debugSessionId, reproductionId)
                {
                    trace("Reproduction Starts: " + reproductionId + ".");
                    var  win = context.qpfbug.firefoxWindow;
                    var url = context.window.location.toString();

                    var record = context.qpfbug.debugSession.record;
                    if (!record && context.qpfbug.recorder){
                        record = context.qpfbug.recorder.record;

                    };

                    if (!record){
                        trace("Error: There is no record to replay!")
                        return;
                    };

                    var replayer = new Replayer(record);

                    with(ReplayUtils){
//                        win.Firebug.Debugger.resume(context); //is it necessary?
                        var tabBrowser = $("content");
                        tabBrowser.removeTab(context.qpfbug.tab);
                        var attributes = {debugSessionId:debugSessionId,
                                         reproductionId:reproductionId};

                        var newTab = openNewTab(win, url, attributes, 
                                callback = function(win)
                                {
                                    replayer.start(unwrapObject(win));
                                }
                        );

                        trace("Reproduction Ends: " + reproductionId + ".");
                    }


                },

        };

        return constructor;
    }();

}}

};