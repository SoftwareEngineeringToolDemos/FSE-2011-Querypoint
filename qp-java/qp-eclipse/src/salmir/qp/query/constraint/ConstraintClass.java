package salmir.qp.query.constraint;


public class ConstraintClass extends Constraint {

    ConstraintAtomic name; //regular expression
    ConstraintAtomic superclass;
    ConstraintAtomic subclass;

    public ConstraintClass() {
    }

    public ConstraintAtomic getName() {
        return name;
    }

    public void setName(ConstraintAtomic name) {
        this.name = name;
    }

    public ConstraintAtomic getSubclass() {
        return subclass;
    }

    public void setSubclass(ConstraintAtomic subclass) {
        this.subclass = subclass;
    }

    public ConstraintAtomic getSuperclass() {
        return superclass;
    }

    public void setSuperclass(ConstraintAtomic superclass) {
        this.superclass = superclass;
    }
}
