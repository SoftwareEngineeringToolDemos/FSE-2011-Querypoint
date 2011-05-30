package salmir.qp.query.constraint;


public class ConstraintVariableChanged extends Constraint{
    ConstraintObject object;
    ConstraintAtomic method;
    ConstraintAtomic variable;


    public ConstraintObject getObject() {
        return object;
    }

    public void setObject(ConstraintObject object) {
        this.object = object;
    }

    public ConstraintAtomic getMethod() {
        return method;
    }

    public void setMethod(ConstraintAtomic method) {
        this.method = method;
    }

    public ConstraintAtomic getVariable() {
        return variable;
    }

    public void setVariable(ConstraintAtomic variable) {
        this.variable = variable;
    }
}
