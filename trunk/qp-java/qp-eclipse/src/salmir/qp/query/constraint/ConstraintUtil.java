package salmir.qp.query.constraint;

import salmir.qp.query.EventQueryNodeType;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import salmir.util.UnexpectedEventException;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;


public class ConstraintUtil {

    private static Log log = LogFactory.getLog(ConstraintUtil.class);
    public static ConstraintMethod getConstraintMethodfromConstraintMethodEntry(ConstraintMethodEntry cme)
    {
        ConstraintMethod cm = cme.getMethod();
        return cm;
    }


    public static String constraintToString(Constraint constraint)
    {
        if (constraint == null)
            return null;
        StringBuilder sb = new StringBuilder();
        EventQueryNodeType qnt = Constants.getEventQueryNodeTypeByBeanClass(constraint.getClass());
        sb.append(qnt.getName());
        sb.append("{");
        sb.append(constraintToStringAsAChild(constraint));
        sb.append("}");
        return sb.toString();
    }

    private static String constraintToStringAsAChild(Constraint constraint)
    {
        if (constraint == null)
            return null;
        StringBuilder sb = new StringBuilder();
        EventQueryNodeType qnt = Constants.getEventQueryNodeTypeByBeanClass(constraint.getClass());
        if (qnt.getChildrenNames().length >0 )
        {
            for (String childName: qnt.getChildrenNames())
            {
                Object prop = null;
                try {
                    prop = PropertyUtils.getProperty(constraint, childName.replace("[]",""));
                } catch (IllegalAccessException e) {
                    throw new UnexpectedEventException(e);
                } catch (InvocationTargetException e) {
                    throw new UnexpectedEventException(e);
                } catch (NoSuchMethodException e) {
                    throw new UnexpectedEventException(e);
                }

                if (prop != null)
                {
                    sb.append(childName);
                    sb.append("{");
                    if (prop instanceof Map)
                    {
                        for (Object key: ((Map)prop).keySet())
                        {
                            sb.append(key);
                            sb.append("=");
                            sb.append(constraintToStringAsAChild((Constraint)((Map)prop).get(key)));
                        }
                    }else{
                        sb.append(constraintToStringAsAChild((Constraint)prop));
                    }
                    sb.append("}");
                }
            }
        }
        else
        {
            sb.append(constraint.toString());
        }
        return sb.toString();
    }
}
