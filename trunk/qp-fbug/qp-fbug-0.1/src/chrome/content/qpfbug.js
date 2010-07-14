FBL.ns(function() { with (FBL)
with(QPFBUG.Classes)
{

    if (FBTrace.DBG_INITIALIZE)
        FBTrace.sysout("Loads QP-FBUG add-on ...");

    FBTrace.DBG_QPFBUG = true;

    Firebug.registerModule(FBUGModuleFactory());

    if (FBTrace.DBG_INITIALIZE)
        FBTrace.sysout("QP-FBUG add-on was loaded.");
}});



