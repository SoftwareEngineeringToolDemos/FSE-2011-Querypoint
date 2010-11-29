var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

    var __owner = QPFBUG.Classes;

    //--------------------------------- UIEventHandler --------------------------------

    __owner.UIUtils = {

         getDebugSession: function(context){
            return context.qpfbug.debugSession;
         },

         getDebugModel: function(context){
            return context.qpfbug.debugSession.debugModel;
         },

         getReproduction: function(context){
            return context.qpfbug.debugSession.reproduction;
         },

         getTracepoints: function(context){
            return UIUtils.getDebugSession(context).getTracepoints(UIUtils.getReproduction(context).id);
         },

         eachTracepoint: function(context, fnOfTracepoint)
         {
            var tps = this.getTracepoints(context);
            try
            {
            for(var i = 0; i < tps.length; i++)
            {
                if (FBTrace.DBG_QUERYPOINT)
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

         getTracepointByQuerypoint: function(context, querypoint)
         {
            return context.qpfbug.debugSession.reproduction.trace.getAssignedTracepointByQuerypoint(querypoint);
         },

         getTraceData: function(tracepoint)
         {
             // Salman, need help here.
             return {expr: "traceDataExpr", traceData: {value: "traceDataValue", otherProps: "here"} };
         },


         // Dom panels utility functions
         getPropertyPath: function(panel, row)
         {
             var path = [];
             for(var current = row; current ; current = UIUtils.getParentRow(current)){
                 if (hasClass(current, "scopesRow")) //we don't want the root row which is a dummy node for scope
                    break;
                 path = panel.getRowPathName(current).concat(path);
             }
             path.splice(0,1); //don't want the first seperator
             return path;
         },

         getParentRow: function(row)
         {
             var level = parseInt(row.getAttribute("level"))-1;
             // If it's top level object the level is now set to -1, is that a problem?
             for (row = row.previousSibling; row; row = row.previousSibling)
             {
                 if (parseInt(row.getAttribute("level")) == level)
                     return row;
             }
         }
         

     };
}}

};