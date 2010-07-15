FBL.ns(function() { with (FBL)
with(QPFBUG)
with(QPFBUG.Classes)
{

    if (FBTrace.DBG_INITIALIZE)
        FBTrace.sysout("Loads QP-FBUG add-on ...");

    FBTrace.DBG_QPFBUG = true;

    // A new module is created for every new firefox window
    qpfbugmodule = new QPFBUGModule(window);

    Firebug.registerModule(qpfbugmodule);

    if (FBTrace.DBG_INITIALIZE)
        FBTrace.sysout("QP-FBUG add-on was loaded.");
}});



