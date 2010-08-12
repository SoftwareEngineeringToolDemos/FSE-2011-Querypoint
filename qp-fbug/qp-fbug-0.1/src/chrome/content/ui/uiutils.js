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

         getQueryPoints: function(context){
            return context.qpfbug.debugSession.debugModel.getQueryPoints();
         },

//         getQueryPoints: function(context){
//            return context.qpfbug.debugSession.debugModel.getQueryPoints();
//         },

    };
}}

};