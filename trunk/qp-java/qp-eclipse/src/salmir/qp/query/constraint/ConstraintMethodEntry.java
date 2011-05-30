package salmir.qp.query.constraint;

import java.util.Map;
import java.util.HashMap;


public class ConstraintMethodEntry extends Constraint{

    ConstraintObject caller;
    ConstraintObject callee;
    ConstraintMethod method;
    Map<Integer, ConstraintObject> args = new HashMap(); //key = -1 means the argument can be in any place

    public ConstraintMethodEntry() {
    }

    public ConstraintMethodEntry(ConstraintMethod method, ConstraintObject caller, ConstraintObject callee, Map<Integer, ConstraintObject> args) {
        this.method = method;
        this.caller = caller;
        this.callee = callee;
        this.args = args;
    }


    public Map<Integer, ConstraintObject> getArgs() {
        return args;
    }

    public void setArgs(Map<Integer, ConstraintObject> args) {
        this.args = args;
    }

    public ConstraintObject getCallee() {
        return callee;
    }

    public void setCallee(ConstraintObject callee) {
        this.callee = callee;
    }

    public ConstraintObject getCaller() {
        return caller;
    }

    public void setCaller(ConstraintObject caller) {
        this.caller = caller;
    }

    public ConstraintMethod getMethod() {
        return method;
    }

    public void setMethod(ConstraintMethod method) {
        this.method = method;
    }
}
