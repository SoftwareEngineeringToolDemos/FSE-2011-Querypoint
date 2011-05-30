package salmir.qp.query.constraint;


public class ConstraintObject extends Constraint {

    ConstraintClass clazz;
    ConstraintProp prop;
    ConstraintObjectValue value;
    ConstraintObjectRef ref;

    public ConstraintObject() {
    }

    public ConstraintClass getClazz() {
        return clazz;
    }

    public void setClazz(ConstraintClass clazz) {
        this.clazz = clazz;
    }

    public ConstraintProp getProp() {
        return prop;
    }

    public void setProp(ConstraintProp prop) {
        this.prop = prop;
    }

    public ConstraintObjectValue getValue() {
        return value;
    }

    public void setValue(ConstraintObjectValue value) {
        this.value = value;
    }

    public ConstraintObjectRef getRef() {
        return ref;
    }

    public void setRef(ConstraintObjectRef ref) {
        this.ref = ref;
    }
}
