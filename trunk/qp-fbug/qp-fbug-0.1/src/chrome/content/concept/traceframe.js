var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //------------------------------- TraceFrame ----------------------------------
    __owner.TraceFrame =
        function(){
            var constructor = function(stackTraceXB, traceScope, traceThis){
                this.stackTraceXB = stackTraceXB;
                this.traceScope = traceScope;
                this.traceThis = traceThis;
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