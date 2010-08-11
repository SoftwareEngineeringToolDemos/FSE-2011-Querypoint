var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //------------------------------- StackFrameLog ----------------------------------
    // StackFrameLog
    owner.StackFrameLog =
        function(){
            var constructor = function(frame, context){
                // We need the context to interpret frames
                this.stackTraceXB = QPFBUG.FBL.getCorrectedStackTrace(frame, context);
            };

            constructor.prototype = {
                getNewestFrame: function()
                {
                    return this.stackTraceXB.frames[0];
                },
                getFrames: function()
                {
                	return this.stackTraceXB.frames;
                },
                setFrames: function(frameXBs)
                {
                	this.stackTraceXB.frames = frameXBs;
                }
            };

            return constructor;
        }();

}}

};