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

         getTracePoints: function(context){
            return UIUtils.getDebugSession(context).getTracePoints(context.qpfbug.reproduction.id);
         },

         eachTracePoint: function(context, fnOfTracePoint)
         {
            var tps = this.getTracePoints(context);
            try
            {
            for(var i = 0; i < tps.length; i++)
            {
                FBTrace.sysout("qp.eachTracePoint "+i+"/"+tps.length, tps[i]);

                fnOfTracePoint(tps[i]);
            }
            }catch(exc)
            {
                FBTrace.sysout("qp.eachTracepoint FAILS at "+i+" with "+exc, exc);
            }
         },

         getQueryPoints: function(context){
            return context.qpfbug.debugSession.debugModel.getQueryPoints();
         },

         getFrameByTracePoint: function(tracepoint)
         {
             if (FBTrace.DBG_QP_TRACEPOINTS)
                 FBTrace.sysout("getFrameByTracePoint "+tracepoint, tracepoint)
             var frame = tracepoint.getStackFrames()[0];
             return frame;
         },
     };
}}

};