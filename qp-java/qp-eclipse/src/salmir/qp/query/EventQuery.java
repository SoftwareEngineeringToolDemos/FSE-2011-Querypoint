package salmir.qp.query;

import salmir.qp.query.constraint.Constraint;
import salmir.qp.query.constraint.ConstraintQuery;
import salmir.qp.query.constraint.ConstraintUtil;

//import salmir.qpdb.concept.query.output.QueryLexer;
//import salmir.qpdb.concept.query.output.QueryParser;

public class EventQuery {

    EventQueryNode tree;
    ConstraintQuery constraintQuery;


    public EventQuery(EventQueryNode tree) {
        this.tree = tree;
        this.constraintQuery = (ConstraintQuery)tree.getBean();
    }


    public EventQueryNode getTree() {
        return tree;
    }

    public void setTree(EventQueryNode tree) {
        this.tree = tree;
    }


    public ConstraintQuery getConstraintTraceQuery() {
        return constraintQuery;
    }

    public void setConstraintTraceQuery(ConstraintQuery constraintQuery) {
        this.constraintQuery = constraintQuery;
    }

    public Constraint getConstraintEvent()
    {
        if (constraintQuery.getMethodentry() != null)
            return constraintQuery.getMethodentry();
        if (constraintQuery.getVariablechanged() != null)
            return constraintQuery.getVariablechanged();
        if (constraintQuery.getFieldchanged() != null)
            return constraintQuery.getFieldchanged();
        return null;
    }

    public String toString()
    {
        return ConstraintUtil.constraintToString(constraintQuery);
    }


}
