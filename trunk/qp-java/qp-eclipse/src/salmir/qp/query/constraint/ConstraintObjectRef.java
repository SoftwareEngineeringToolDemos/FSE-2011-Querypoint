package salmir.qp.query.constraint;


public class ConstraintObjectRef extends Constraint {

    ConstraintAtomic pointname;
    ConstraintAtomic frame;
    ConstraintAtomic reference;

    public ConstraintObjectRef() {
    }

    public ConstraintAtomic getPointname() {
        return pointname;
    }

    public void setPointname(ConstraintAtomic pointname) {
        this.pointname = pointname;
    }

    public ConstraintAtomic getFrame() {
        return frame;
    }

    public void setFrame(ConstraintAtomic frame) {
        this.frame = frame;
    }

    public ConstraintAtomic getReference() {
        return reference;
    }

    public void setReference(ConstraintAtomic reference) {
        this.reference = reference;
    }
}
