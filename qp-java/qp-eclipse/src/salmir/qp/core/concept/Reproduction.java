package salmir.qp.core.concept;

import salmir.util.StateMachine;

import java.util.HashMap;
import java.util.Map;

public class Reproduction {
    
	DebugSession debugSession;
	Trace trace;
    DebugTarget debugTarget;


	public Reproduction(){
        this.trace = new Trace(null);
	}
	
    public Trace getTrace() {
        return trace;
    }

    public void setTrace(Trace trace) {
        this.trace = trace;
    }

    public DebugTarget getDebugTarget() {
        return debugTarget;
    }

    public void setDebugTarget(DebugTarget debugTarget) {
        this.debugTarget = debugTarget;
    }
}
