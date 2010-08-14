var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var owner = QPFBUG.Classes;

    //--------------------------------- UIEventHandler --------------------------------

    owner.UIUtils = {

         getDebugModel: function(context){
            return context.qpfbug.debugSession.debugModel;
         },

         getReproduction: function(context){
            return context.qpfbug.reproduction;
         },

         getDebugSession: function(context){
            return context.qpfbug.debugSession;
         },

         getTracepoints: function(context){
            return UIUtils.getDebugSession(context).getTracepoints(context.qpfbug.reproduction.id);
         },

         eachTracepoint: function(context, fnOfTracepoint)
         {
            var tps = this.getTracepoints(context);
            try
            {
            for(var i = 0; i < tps.length; i++)
            {
                FBTrace.sysout("qp.eachTracepoint "+i+"/"+tps.length, tps[i]);

                fnOfTracepoint(tps[i]);
            }
            }catch(exc)
            {
                FBTrace.sysout("qp.eachTracepoint FAILS at "+i+" with "+exc, exc);
            }
         },

         getQuerypoints: function(context){
            return context.qpfbug.debugSession.debugModel.getQuerypoints();
         },

         getFrameByTracepoint: function(tracepoint)
         {
             if (FBTrace.DBG_QP_TRACEPOINTS)
                 FBTrace.sysout("getFrameByTracepoint "+tracepoint, tracepoint)
             var frame = tracepoint.getStackFrames()[0];
             return frame;
         },

         getQuerypointByTracepoint: function(tracepoint)
         {
            return tracepoint.querypoint;
         },
     };
}}

};