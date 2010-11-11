var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var __owner = QPFBUG.Classes;

//--------------------------------- Reproducer --------------------------------

__owner.ReplayReproducer = function(){  // todo inherit from Reproducer

        var constructor = function(){
        };

        constructor.prototype =
        {
                toString: function()  // todo to base class
                {
                    return "["+this.name+"Reproducer]";
                },

                name: "Replay",

                reproduce: function (context, debugSessionId, reproductionId)
                {
                    trace("Reproduction Starts: " + reproductionId + ".");
                    var  win = context.window;
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