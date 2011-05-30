package salmir.qp.debugservice;

import salmir.qp.query.constraint.Constraint;
import salmir.qp.query.constraint.ConstraintClass;
import salmir.qp.query.constraint.ConstraintMethod;

import java.util.List;
import java.util.Set;

public interface RepositoryClasses {

    public void addClass(String className);
    public void removeClass(String className);
    public Set<String> getAllClassNames();
    public List<String> getClassNames(ConstraintClass constratint);
    public List<String> getMethodNames(ConstraintMethod constraint);

    public List<InstructionLocation> getLocations(String className, Constraint constraint);
    public List<InstructionLocation> getLocations(Constraint constraint);
}
