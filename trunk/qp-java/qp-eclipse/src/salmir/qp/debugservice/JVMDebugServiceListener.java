package salmir.qp.debugservice;

import com.sun.jdi.event.VMDeathEvent;
import com.sun.jdi.event.VMStartEvent;


public interface JVMDebugServiceListener {

    public void onVMStart();
    public void onVMDeath();
    public void onVMSuspend();
    public void onVMResume();
    public void onEvent();

}
