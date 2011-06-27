package salmir.qp.core.concept;

import com.sun.jdi.event.*;
import com.sun.jdi.*;

import java.util.List;

import salmir.qp.core.IDebugSession;
import salmir.qp.core.IQuerypoint;
import salmir.util.AppContext;


//PointContext Class
public class TracePointContext {

    IDebugSession debugSession;
    IQuerypoint querypoint;
    Event event;
    


    public TracePointContext(IQuerypoint querypoint, Event event) {
        this.querypoint = querypoint;
        this.event = event;
    }

    public boolean containsValue(List<Value> items , Object value)
    {
        if (items == null)
            return false;
        for (Value item: items)
        {
            if (item == value)
                return true;
            if (value != null)
                if (value.equals(item))
                    return true;
        }
        return false;
    }

    public List<Value> getArguments(){
        List<Value> values = null;
        try {
            values = getThreadReference().frame(0).getArgumentValues();
        } catch (IncompatibleThreadStateException e) {
            //to do  manage it
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return values;
    }

    public Object getValue(String s, String s1) {
//        List<MonitoredProcess> monitoredProcesses = debugSession.getMonitoredProcesses();
//        for (MonitoredProcess monitoredProcess : monitoredProcesses)
//        {
//            if (monitoredProcess.getName().equals(s))
//            {
//                MonitoredProcess_Java tbmjp = (MonitoredProcess_Java) monitoredProcess;
//                VirtualMachine vm = tbmjp.getVm();
//                try {
//                    List<LocalVariable> localVariables = getThreadReference().frame(0).visibleVariables();
//                    for (LocalVariable localVariable : localVariables)
//                    {
////                        System.out.println("++++++++++++++++ Variable");
////                        System.out.println("Signature");
////                        System.out.println(localVariable.signature());
////                        System.out.println("Name");
////                        System.out.println(localVariable.name());
////                        System.out.println("Type");
//                        Value value = getThreadReference().frame(0).getValue(localVariable);
////                        System.out.println(value.type());
//
//                        if (value instanceof IntegerValue)
//                            return ((IntegerValue)value).intValue();
//
//                    }
//                } catch (AbsentInformationException e) {
//                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//                } catch (IncompatibleThreadStateException e) {
//                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//                }
//            }
//        }
        return null;
    }

    //todo rewrite and complete this method
    public ObjectReference getObjectReference(int frameIndex, String reference) {
        try {
            StackFrame frame = getThreadReference().frame(frameIndex);
            String[] parts = reference.split("\\.");

            if (parts[0].equals("this"))
                return frame.thisObject();
            if (parts[0].equals("Object"))
            {
                return ((WatchpointEvent)event).object();
            }
        } catch (IncompatibleThreadStateException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return null;
    }


    public ThreadReference getThreadReference() {
        if (event instanceof LocatableEvent)
            return ((LocatableEvent)event).thread();
        return null;
    }
    public Object getStaticValue(String s, String className, String fieldName) {
//        List<MonitoredProcess> monitoredProcesses = debugSession.getMonitoredProcesses();
//        for (MonitoredProcess monitoredProcess : monitoredProcesses)
//        {
//            if (monitoredProcess.getName().equals(s))
//            {
//                MonitoredProcess_Java tbmjp = (MonitoredProcess_Java) monitoredProcess;
//                VirtualMachine vm = tbmjp.getVm();
//                List<ReferenceType> rfs = vm.classesByName(className);
//                if (rfs.size() == 0)
//                    return null;
//                ReferenceType rt = vm.classesByName(className).get(0);
//                return rt.getValue(rt.fieldByName(fieldName));
//            }
//        }
        return null;
    }

    public boolean callerClass(String className)
    {
        //List<Value> values = null;
        try {
            String regExp = className.replace("*",".*");
            int frameCount = getThreadReference().frameCount();

            for (int i=0 ;  i<frameCount ; i++)
            {
//                String name = ((BreakpointEvent)event).thread().frame(i).thisObject().referenceType().name();
                String name = getThreadReference().frame(i).location().declaringType().name();
                if (name.matches(regExp))
                {
                    return true;
                }
            }
            return false;
        } catch (IncompatibleThreadStateException e) {
            //todo  manage it
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        // normally it should not reach to this point
        return true;
    }

    public boolean checkConditionRemote(String expr)
    {
//            ExpressionCondition ec = new ExpressionCondition();
//            ec.setExpression(expr);
//        try {
//            return ec.isSatisfied(null, event);
//        } catch (Exception e) {
//            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//        }
        return false;
    }


    public IDebugSession getDebugSession() {
        return debugSession;
    }

    public Event getEvent() {
        return event;
    }

    public IQuerypoint getQuerypoint() {
        return querypoint;
    }

}
