package salmir.qp.query.constraint;


public class ConstraintQuery extends Constraint{

    ConstraintMethodEntry methodentry;
    ConstraintVariableChanged variablechanged;
    ConstraintFieldChanged fieldchanged;
    ConstraintAtomic before;
    ConstraintAtomic beforethread;
    ConstraintAtomic after;
    ConstraintAtomic afterthread;


    public ConstraintFieldChanged getFieldchanged() {
        return fieldchanged;
    }

    public void setFieldchanged(ConstraintFieldChanged fieldchanged) {
        this.fieldchanged = fieldchanged;
    }

    public ConstraintMethodEntry getMethodentry() {
        return methodentry;
    }

    public void setMethodentry(ConstraintMethodEntry methodentry) {
        this.methodentry = methodentry;
    }

    public ConstraintVariableChanged getVariablechanged() {
        return variablechanged;
    }

    public void setVariablechanged(ConstraintVariableChanged variablechanged) {
        this.variablechanged = variablechanged;
    }

    public ConstraintAtomic getBeforethread() {
        return beforethread;
    }

    public void setBeforethread(ConstraintAtomic beforethread) {
        this.beforethread = beforethread;
    }

    public ConstraintAtomic getBefore() {
        return before;
    }

    public void setBefore(ConstraintAtomic before) {
        this.before = before;
    }

    public ConstraintAtomic getAfterthread() {
        return afterthread;
    }

    public void setAfterthread(ConstraintAtomic afterthread) {
        this.afterthread = afterthread;
    }

    public ConstraintAtomic getAfter() {
        return after;
    }

    public void setAfter(ConstraintAtomic after) {
        this.after = after;
    }
}
