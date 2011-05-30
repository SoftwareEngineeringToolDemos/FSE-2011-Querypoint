package salmir.qp.debugservice;


import java.util.*;

import org.apache.bcel.classfile.*;
import org.apache.bcel.Repository;
import org.apache.bcel.util.InstructionFinder;
import org.apache.bcel.generic.InstructionList;
import org.apache.bcel.generic.InstructionHandle;
import org.apache.bcel.generic.Type;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import salmir.qp.query.constraint.*;


public class BCELRepositoryClasses implements RepositoryClasses {
    private static Log log = LogFactory.getLog(BCELRepositoryClasses.class);
    Set<String> classNames = new HashSet();

    public BCELRepositoryClasses() {
    }

    public void addClass(String className)
    {
        classNames.add(className);
    }

    public void removeClass(String className)
    {
        classNames.remove(className);
    }

    public Set<String> getAllClassNames()
    {
        return classNames;
    }

    public List<String> getClassNames(ConstraintClass constratint)
    {
        List<String> classNames = new ArrayList<String>();

        return classNames;
    }

    public List<String> getMethodNames(ConstraintMethod constraint)
    {
        List<String> classNames = new ArrayList<String>();

        return classNames;
    }

    //todo add documentation
    public List<InstructionLocation> getLocations(String className, Constraint constraint) {
//        System.out.println(className + " " + constraint);
        List<InstructionLocation> locations = new ArrayList();
        if (constraint == null)
            return locations;  // when constraint is null it returns an empty list

        JavaClass jc = getJavaClassByName(className);
        if (jc == null) //todo throw an exception or a hint, this should not happen, it means there is a class in monitored vm which is not available here
            return locations; // if there isn't a class with this class name it returns an empty list


        if (constraint instanceof ConstraintMethodEntry)
        {
            ConstraintMethodEntry cme = (ConstraintMethodEntry) constraint;

            if (!matches(cme.getCallee(), jc))
            {
                return locations; //returns empty locations
            }
            if (cme.getMethod() != null)
            {
                ConstraintMethod constriantMethod = cme.getMethod();
                org.apache.bcel.classfile.Method[] methods = jc.getMethods();
                for (Method method : methods)
                {
                    if (matches(constriantMethod, method))
                    {
                        locations.add(getLocation(jc, method));
                    }
                }
            }
        }

        if (constraint instanceof ConstraintVariableChanged)
        {
            ConstraintVariableChanged cvc = (ConstraintVariableChanged)constraint;
            if (!matches(cvc.getObject(), jc))
            {
                return locations; //returns empty locations
            }
            String methodName = cvc.getMethod().getData0();
            if ( methodName == null)
            {
                return locations; //returns empty locations
            }
            Method method = getMethodByName(jc, methodName);
            if (method == null)
            {
                return locations; //returns empty locations
            }
            String variableName = cvc.getVariable().getData0();
            if (variableName == null)
            {
                return locations; //returns empty lcoations
            }
            LocalVariableTable lvt = method.getLocalVariableTable();
            LocalVariable[] lvs = lvt.getLocalVariableTable();
            LocalVariable localVariable = null;
            for (LocalVariable lv : lvs)
            {
                if (variableName.equals(lv.getName()))
                {
                    localVariable = lv;
                    break;
                }
            }
            //because the variable decleration line is not defined in bytecode
            // we consider first method line as the line the variable is declared without any assignment.
            locations.add(getLocation(jc, method)); // the variable decleration place

            LineNumberTable lnt = method.getLineNumberTable();
            System.out.println("_________________________________________________");
            System.out.println("LOCAL VARIABLE: " + localVariable);
            InstructionList il = new InstructionList(method.getCode().getCode());
            InstructionFinder f   = new InstructionFinder(il);
            String pat = "ASTORE_"+localVariable.getIndex();
            for(Iterator i = f.search(pat); i.hasNext(); ) {
                InstructionHandle[] ihs = (InstructionHandle[])i.next();
                int sourceLine = lnt.getSourceLine(ihs[0].getPosition());
                locations.add(new InstructionLocation(jc.getClassName(), sourceLine, ihs[0].getPosition()));
             }
        }
        return locations;
    }

    public List<InstructionLocation> getLocations(Constraint constraint) {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    private InstructionLocation getLocation(JavaClass jc, Method method)
    {
        LineNumberTable lnt = method.getLineNumberTable();
        Code code = method.getCode();

        InstructionList il = new InstructionList(code.getCode());
        InstructionHandle ih = il.getStart();
        int sourceLine = lnt.getSourceLine(ih.getPosition());
        return new InstructionLocation(jc.getClassName(), sourceLine, ih.getPosition());
    }

    //---------------------------Matches functions

    private boolean matches(ConstraintObject constraintObject, JavaClass jc)
    {
        if (constraintObject == null)
            return false;

        ConstraintClass constraintClass = constraintObject.getClazz();
        return matches(constraintClass, jc);
    }

    private boolean matches(ConstraintClass constraintClass, JavaClass jc)
    {
        if (constraintClass == null)
            return false;

        ConstraintAtomic constraintClassName = constraintClass.getName();
        if (constraintClassName != null)
        {
            String className = constraintClassName.getData0();

            String regExpClassName = className.replace("*",".*");
            if (jc.getClassName().matches(regExpClassName))
            {
                    return true;
            }
            try {
                JavaClass[] classes = null;
                classes = jc.getSuperClasses(); //throws exception
                for (JavaClass clazz: classes)
                {
                    if (clazz.getClassName().matches(regExpClassName))
                    {
                            return true;
                    }
                }
            } catch (ClassNotFoundException e) {
                //todo manage the exception
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
            try {
                JavaClass[] interfaces = null;
                interfaces = jc.getAllInterfaces(); //throws exception
                for (JavaClass interfase: interfaces)
                {
                    if (interfase.getClassName().matches(regExpClassName))
                    {
                            return true;
                    }
                }
            } catch (ClassNotFoundException e) {
                //todo manage the exception
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }

        return false;
    }
    private boolean matches(ConstraintMethod constraintMethod, Method method)
    {
        if (constraintMethod == null)
            return false;

        ConstraintAtomic constraintMethodName = constraintMethod.getName();
        if (constraintMethodName != null)
        {
            String methodName = constraintMethodName.getData0();
            String regExpMethodName = methodName.replace("*",".*");
//            System.out.println(method.getName() + " " + regExpMethodName );
            if (method.getName().matches(regExpMethodName))
            {
                if (matches(constraintMethod.getReturntype(), method.getReturnType()))
                {
                    return true;
                }
            }
        }

        return false;
    }
    private boolean matches(ConstraintClass constraintClass, Type type)
    {
        if (constraintClass == null )
            return false;

        ConstraintAtomic constraintClassName = constraintClass.getName();
        if (constraintClassName != null)
        {
            String className = constraintClassName.getData0();
            if (className.equals("void") && type == Type.VOID)
                return true;

        }
        return false;
    }

    private JavaClass getJavaClassByName(String className)
    {
        JavaClass jc = null;
        try {
            jc = Repository.lookupClass(className);
        } catch (ClassNotFoundException e) {
            //todo mange the exception
            log.info("ClassNotFoundExceptoin : " + className);
//            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return jc;
    }
    private Method getMethodByName(JavaClass jc, String methodName)
    {
        Method method = null;
        Method[] methods = jc.getMethods();
        for (Method methodTemp : methods)
        {
            if (methodTemp.getName().equals(methodName))
            {
                method = methodTemp;
                break;
            }
        }
        return method;
    }

}
