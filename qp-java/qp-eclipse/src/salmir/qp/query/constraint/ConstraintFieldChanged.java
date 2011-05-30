package salmir.qp.query.constraint;


public class ConstraintFieldChanged extends Constraint{

    ConstraintClass clazz;
    ConstraintObject object;
    ConstraintAtomic field;


    public ConstraintClass getClazz() {
        return clazz;
    }

    public void setClazz(ConstraintClass clazz) {
        this.clazz = clazz;
    }

    public ConstraintObject getObject() {
        return object;
    }

    public void setObject(ConstraintObject object) {
        this.object = object;
    }

    public ConstraintAtomic getField() {
        return field;
    }

    public void setField(ConstraintAtomic field) {
        this.field = field;
    }
}
