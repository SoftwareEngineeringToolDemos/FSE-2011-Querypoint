package salmir.qp.query.constraint;

import salmir.qp.query.EventQueryNodeType;
import salmir.qp.query.grammar.MethodLexer;
import salmir.qp.query.grammar.MethodParser;
import salmir.qp.query.grammar.ObjectRefParser;
import salmir.qp.query.grammar.ObjectRefLexer;

import java.util.HashMap;
import java.util.Map;

public class Constants {

    public static class EventQueryNodeTypes {
        public static final int ATOMIC = 0;
        public static final int STRING_REGEXP = 5;

        public static final int CONSTRAINT_OBJECTVALUE = 7;

        public static final int CONSTRAINT_MODIFIERS = 10;

        public static final int CONSTRAINT_CLASS = 15;
        public static final int CONSTRAINT_METHOD = 20;
        public static final int CONSTRAINT_OBJECT = 25;
        public static final int CONSTRAINT_OBJECT_REF = 27;
        public static final int CONSTRAINT_METHOD_ENTRY = 30;
        public static final int CONSTRAINT_FIELD_CHANGED = 35;
        public static final int CONSTRAINT_VARIABLE_CHANGED = 40;

        public static final int CONSTRAINT_TRACE_QUERY = 45;
        public static final int CONSTRAINT_TRACE_POINT = 50;

    }

    public static class LogicalOperators {
        public static final byte OP_NON = 0;
        public static final byte OP_AND = 1;
        public static final byte OP_OR = 2;
        public static final byte OP_ANDNOT = 3;
    }


    static Map<Integer, EventQueryNodeType> eventQueryNodeTypes = new HashMap();

    static {
        EventQueryNodeType ct;

        ct = new EventQueryNodeType(EventQueryNodeTypes.ATOMIC, "atomic",
                salmir.qp.query.constraint.ConstraintAtomic.class,
                new String[]{}, new int[]{});
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.STRING_REGEXP, "regexp",
                salmir.qp.query.constraint.ConstraintString.class,
                new String[]{"pattern"},
                new int[]{EventQueryNodeTypes.STRING_REGEXP});
        eventQueryNodeTypes.put(ct.getId(), ct);

//todo
        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_OBJECTVALUE, "objectvalue",
                ConstraintObjectValue.class,
                new String[]{},
                new int[]{});
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_MODIFIERS, "modifiers",
                salmir.qp.query.constraint.ConstraintModifiers.class,
                new String[]{},
                new int[]{});
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_CLASS, "clazz", salmir.qp.query.constraint.ConstraintClass.class,
                new String[]{"name", "subclass", "superclass"},
                new int[]{EventQueryNodeTypes.ATOMIC, EventQueryNodeTypes.ATOMIC});
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_METHOD, "method",
                salmir.qp.query.constraint.ConstraintMethod.class,
                new String[]{"modifiers", "returntype", "name"},
                new int[]{EventQueryNodeTypes.CONSTRAINT_MODIFIERS, EventQueryNodeTypes.CONSTRAINT_CLASS, EventQueryNodeTypes.ATOMIC}
               , MethodLexer.class, MethodParser.class);
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_OBJECT, "object",
                salmir.qp.query.constraint.ConstraintObject.class,
                new String[]{"clazz", "ref", "value" },
                new int[]{EventQueryNodeTypes.CONSTRAINT_CLASS, EventQueryNodeTypes.CONSTRAINT_OBJECT_REF, EventQueryNodeTypes.CONSTRAINT_OBJECTVALUE});
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_OBJECT_REF, "objectref",
                salmir.qp.query.constraint.ConstraintObjectRef.class,
                new String[]{"pointname", "frame", "reference" },
                new int[]{EventQueryNodeTypes.ATOMIC, EventQueryNodeTypes.ATOMIC, EventQueryNodeTypes.ATOMIC}
              , ObjectRefLexer.class, ObjectRefParser.class);
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_METHOD_ENTRY, "methodentry",
                salmir.qp.query.constraint.ConstraintMethodEntry.class,
                new String[]{"caller", "callee", "method", "args[]"},
                new int[]{EventQueryNodeTypes.CONSTRAINT_OBJECT, EventQueryNodeTypes.CONSTRAINT_OBJECT, EventQueryNodeTypes.CONSTRAINT_METHOD, EventQueryNodeTypes.CONSTRAINT_OBJECT});
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_FIELD_CHANGED, "fieldchanged",
                ConstraintFieldChanged.class,
                new String[]{"clazz", "object", "field"},  //todo perhaps you can combile class and object to object
                new int[]{EventQueryNodeTypes.CONSTRAINT_CLASS, EventQueryNodeTypes.CONSTRAINT_OBJECT, EventQueryNodeTypes.ATOMIC});
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_VARIABLE_CHANGED, "variablechanged",
                salmir.qp.query.constraint.ConstraintVariableChanged.class,
                new String[]{"object", "method", "variable"},  
                new int[]{EventQueryNodeTypes.CONSTRAINT_OBJECT, EventQueryNodeTypes.ATOMIC, EventQueryNodeTypes.ATOMIC});
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_TRACE_QUERY, "tracequery",
                ConstraintQuery.class,
                new String[]{"methodentry", "variablechanged", "fieldchanged", "after", "afterthread", "before", "beforethread"},
                new int[]{EventQueryNodeTypes.CONSTRAINT_METHOD_ENTRY, EventQueryNodeTypes.CONSTRAINT_VARIABLE_CHANGED,
                          EventQueryNodeTypes.CONSTRAINT_FIELD_CHANGED,
                        EventQueryNodeTypes.ATOMIC, EventQueryNodeTypes.ATOMIC, EventQueryNodeTypes.ATOMIC, EventQueryNodeTypes.ATOMIC});
        eventQueryNodeTypes.put(ct.getId(), ct);

        ct = new EventQueryNodeType(EventQueryNodeTypes.CONSTRAINT_TRACE_POINT, "tracepoint",
                ConstraintPoint.class,
                new String[]{"query", "index"},
                new int[]{EventQueryNodeTypes.CONSTRAINT_TRACE_QUERY, EventQueryNodeTypes.ATOMIC});
        eventQueryNodeTypes.put(ct.getId(), ct);
    }

    public static EventQueryNodeType getEventQueryNodeTypeByName(String name) {
        if (name == null)
            return null;

        name = name.trim().toLowerCase();
        for (Integer constraintTypeId : eventQueryNodeTypes.keySet()) {
            if (eventQueryNodeTypes.get(constraintTypeId).getName().toLowerCase().equals(name))
                return eventQueryNodeTypes.get(constraintTypeId);
        }
        return null;
    }

    public static EventQueryNodeType getEventQueryNodeTypeByBeanClass(Class clazz) {
        if (clazz == null)
            return null;

        for (Integer constraintTypeId : eventQueryNodeTypes.keySet()) {
            if (eventQueryNodeTypes.get(constraintTypeId).getBeanClass().equals(clazz))
                return eventQueryNodeTypes.get(constraintTypeId);
        }
        return null;
    }

    public static EventQueryNodeType getEventQueryNodeTypeById(int id) {
        return eventQueryNodeTypes.get(id);
    }

    public static EventQueryNodeType getChildNodeType(EventQueryNodeType parent, String childName)
    {
        for (int i=0 ; i<parent.getChildrenNames().length ; i++)
        {
            String name = parent.getChildrenNames()[i];
            if (name.equals(childName))
                return Constants.getEventQueryNodeTypeById(parent.getChildrenNodeTypes()[i]);
        }
        return null;
    }

}