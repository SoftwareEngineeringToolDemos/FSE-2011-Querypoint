package salmir.qp.standalone;

import salmir.qp.core.concept.DebugTarget;

public class AbstractDebugTarget implements DebugTarget{

    String name;
    Process process;

    protected AbstractDebugTarget(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Process getProcess() {
        return process;
    }

    public void setProcess(Process process) {
        this.process = process;
    }
}
