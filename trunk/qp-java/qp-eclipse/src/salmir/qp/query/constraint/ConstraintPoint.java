package salmir.qp.query.constraint;

public class ConstraintPoint extends Constraint{
     ConstraintQuery query;
     ConstraintAtomic index;


    public ConstraintQuery getQuery() {
        return query;
    }

    public void setQuery(ConstraintQuery query) {
        this.query = query;
    }

    public ConstraintAtomic getIndex() {
        return index;
    }

    public void setIndex(ConstraintAtomic index) {
        this.index = index;
    }
}
