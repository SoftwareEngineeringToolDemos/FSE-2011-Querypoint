package salmir.qp.query.constraint;

import java.util.Map;


public class ConstraintMethod  extends Constraint {

    //class modifiers name args
    ConstraintClass clazz;
    ConstraintAtomic name;
    ConstraintModifiers modifiers;
    boolean isConstructor;
    Map<Integer, ConstraintClass> args; //key = -1 means the argument can be in any place
    ConstraintClass returntype;


    public ConstraintMethod() {
    }


    public Map<Integer, ConstraintClass> getArgs() {
        return args;
    }

    public void setArgs(Map<Integer, ConstraintClass> args) {
        this.args = args;
    }

    public ConstraintClass getClazz() {
        return clazz;
    }

    public void setClazz(ConstraintClass clazz) {
        this.clazz = clazz;
    }

    public boolean isConstructor() {
        return isConstructor;
    }

    public void setConstructor(boolean constructor) {
        isConstructor = constructor;
    }

    public ConstraintModifiers getModifiers() {
        return modifiers;
    }

    public void setModifiers(ConstraintModifiers modifiers) {
        this.modifiers = modifiers;
    }

    public ConstraintClass getReturntype() {
        return returntype;
    }

    public void setReturntype(ConstraintClass returntype) {
        this.returntype = returntype;
    }


    public ConstraintAtomic getName() {
        return name;
    }

    public void setName(ConstraintAtomic name) {
        this.name = name;
    }
}

