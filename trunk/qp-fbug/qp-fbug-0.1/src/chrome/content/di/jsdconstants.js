var EXPORTED_SYMBOLS = ["loadModule"];
loadModule = function(QPFBUG)
{

with (QPFBUG.Classes){
with (Lang){

var owner = QPFBUG.Classes;

//--------------------------------- JSDConstants --------------------------------
owner.JSDConstants = {

        DebuggerService : Cc["@mozilla.org/js/jsd/debugger-service;1"],

        jsdIDebuggerService : Ci.jsdIDebuggerService,
        jsdIScript : Ci.jsdIScript,
        jsdIStackFrame : Ci.jsdIStackFrame,
        jsdICallHook : Ci.jsdICallHook,
        jsdIExecutionHook : Ci.jsdIExecutionHook,
        jsdIErrorHook : Ci.jsdIErrorHook,
        jsdIFilter : Components.interfaces.jsdIFilter,

        PCMAP_SOURCETEXT : Ci.jsdIScript.PCMAP_SOURCETEXT,
        PCMAP_PRETTYPRINT : Ci.jsdIScript.PCMAP_PRETTYPRINT,
        
        COLLECT_PROFILE_DATA : Ci.jsdIDebuggerService.COLLECT_PROFILE_DATA,
        DISABLE_OBJECT_TRACE : Ci.jsdIDebuggerService.DISABLE_OBJECT_TRACE,
        HIDE_DISABLED_FRAMES : Ci.jsdIDebuggerService.HIDE_DISABLED_FRAMES,
        DEBUG_WHEN_SET : Ci.jsdIDebuggerService.DEBUG_WHEN_SET,
        MASK_TOP_FRAME_ONLY : Ci.jsdIDebuggerService.MASK_TOP_FRAME_ONLY,
        
        TYPE_FUNCTION_CALL : Ci.jsdICallHook.TYPE_FUNCTION_CALL,
        TYPE_FUNCTION_RETURN : Ci.jsdICallHook.TYPE_FUNCTION_RETURN,
        TYPE_TOPLEVEL_START : Ci.jsdICallHook.TYPE_TOPLEVEL_START,
        TYPE_TOPLEVEL_END : Ci.jsdICallHook.TYPE_TOPLEVEL_END,
        
        RETURN_CONTINUE : Ci.jsdIExecutionHook.RETURN_CONTINUE,
        RETURN_VALUE : Ci.jsdIExecutionHook.RETURN_RET_WITH_VAL,
        RETURN_THROW_WITH_VAL : Ci.jsdIExecutionHook.RETURN_THROW_WITH_VAL,
        RETURN_CONTINUE_THROW : Ci.jsdIExecutionHook.RETURN_CONTINUE_THROW,
    };
}}
};