package salmir.qp.debugservice;

import com.sun.jdi.*;
import com.sun.jdi.event.*;
import com.sun.jdi.request.*;

import salmir.qp.core.IQuerypoint;
import salmir.qp.core.concept.TracePointContext;
import salmir.qp.core.concept.Tracedata;
import salmir.qp.core.concept.Tracepoint;
import salmir.qp.query.EventQuery;

import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import salmir.qp.query.constraint.*;
import salmir.util.StateMachine;
import salmir.util.Timer;

public class JVMDebugService {

    private static class State {
        public final static String NOT_INITIALIZED = "not_initialized";
        public final static String INITIALIZED = "initialized";
        public final static String DISCONNECTED = "disconnected";
        public final static String DEAD = "dead";
    }

    private static class Transition{
        public final static String INIT = "init";
        public final static String DISCONNECT = "disconnect";
    }

    public final static String[] ALL_STATES = new String[]{
        State.NOT_INITIALIZED, State.INITIALIZED, State.DISCONNECTED, State.DEAD
    };

    public final static String[][] ALL_TRANSITIONS = new String[][]{
        {Transition.INIT, State.NOT_INITIALIZED, State.INITIALIZED},
        {Transition.DISCONNECT, State.INITIALIZED, State.DISCONNECTED}
    };
    StateMachine stateMachine;

    private static Log log = LogFactory.getLog(JVMDebugService.class);

    private VirtualMachine vm;   // Running VM
    private JVMDebugServiceListener jvmDebugServiceListener;

    private String[] excludes = {"java.*", "javax.*", "sun.*",
            "com.sun.*"};   // Packages to exclude

    Timer timer;
    State state;

    RepositoryClasses repositoryClasses = new BCELRepositoryClasses();

    List<EventRequest> eventRequests = new ArrayList();


    List<EventQuery> eventQueries;

    //relations
    Map<EventQuery, List<EventRequest>> eventQuery_EventRequests;

    public JVMDebugService(VirtualMachine vm, JVMDebugServiceListener jvmDebugServiceListener) {
        stateMachine = new StateMachine(ALL_STATES, State.NOT_INITIALIZED, ALL_TRANSITIONS);
        this.vm = vm;
        this.jvmDebugServiceListener = jvmDebugServiceListener;
        timer = new Timer();
        eventQueries = new ArrayList<EventQuery>();
        eventQuery_EventRequests = new HashMap<EventQuery, List<EventRequest>>();
    }

    public void init() {
        stateMachine.startTransit(Transition.INIT);

        //set initial event requests
        log.info("... is setting the initial JDI Event Requests.");
        setInitialEventRequests();

        List<ReferenceType> allClasses = vm.allClasses();
        for (ReferenceType theClass : allClasses) {
            addClass(theClass);
        }

        stateMachine.endTransit();
    }

    /**
     * Create the desired event requests, and enable
     * them so that we will get events.
     * //@param excludes     Class patterns for which we don't want events
     */
    private void setInitialEventRequests() {
        EventRequestManager mgr = vm.eventRequestManager();

        // Class prepare requests
        ClassPrepareRequest cpr = mgr.createClassPrepareRequest();
        //        for (int i=0; i<excludes.length; ++i) {
        //        cpr.addClassExclusionFilter(excludes[i]);
        //        }
        cpr.setSuspendPolicy(EventRequest.SUSPEND_ALL);
        cpr.enable();

        ClassUnloadRequest cur = mgr.createClassUnloadRequest();
        //        for (int i=0; i<excludes.length; ++i) {
        //        cpr.addClassExclusionFilter(excludes[i]);
        //        }
        cur.setSuspendPolicy(EventRequest.SUSPEND_ALL);
        cur.enable();

        // want all exceptions
        VMDeathRequest vmdr = mgr.createVMDeathRequest();
        vmdr.setSuspendPolicy(EventRequest.SUSPEND_ALL);
        vmdr.enable();

        // Thread Events
        ThreadStartRequest tsr = mgr.createThreadStartRequest();
        tsr.setSuspendPolicy(EventRequest.SUSPEND_ALL);
        tsr.enable();

        ThreadDeathRequest tdr = mgr.createThreadDeathRequest();
        tdr.setSuspendPolicy(EventRequest.SUSPEND_ALL);
        tdr.enable();

        // Exception Events
        ExceptionRequest excReq = mgr.createExceptionRequest(null,
                true, true);
        excReq.setSuspendPolicy(EventRequest.SUSPEND_ALL);
        excReq.enable();
    }


    //returns true if there is any event
    public boolean consumeEvents() {
        EventQueue queue = vm.eventQueue();
        try {
            EventSet eventSet = null;
            try {
                eventSet = queue.remove(10);
            } catch (InterruptedException exc) {
                Thread.currentThread().interrupt();
                // Ignore
            }
            if (eventSet == null)
                return false;

            jvmDebugServiceListener.onVMSuspend();

            EventIterator it = eventSet.eventIterator();
            while (it.hasNext()) {
                handleEvent(it.nextEvent());
            }
            jvmDebugServiceListener.onVMResume();
            eventSet.resume();//after calling resume() it is not needed to be called
            return true;
        } catch (VMDisconnectedException e)
        {
            handleDisconnectedException(e);
            // break;
        }
        return false;
    }

    //----------------------------------------- Event Handling ---------------------------------
    /**
     * Dispatch incoming events
     */
    protected void handleEvent(Event event) {
        if (event instanceof ClassPrepareEvent) {
            handleClassPrepareEvent((ClassPrepareEvent) event);
        } else if (event instanceof ClassUnloadEvent) {
            handleClassUnloadEvent((ClassUnloadEvent) event);
        } else if (event instanceof ExceptionEvent) {
            handleExceptionEvent((ExceptionEvent) event);
        } else if (event instanceof ModificationWatchpointEvent) {
            handleFieldWatchEvent((ModificationWatchpointEvent) event);
        } else if (event instanceof MethodEntryEvent) {
            handleMethodEntryEvent((MethodEntryEvent) event);
        } else if (event instanceof MethodExitEvent) {
            handleMethodExitEvent((MethodExitEvent) event);
        } else if (event instanceof StepEvent) {
            handleStepEvent((StepEvent) event);
        } else if (event instanceof ThreadStartEvent) {
            handleThreadStartEvent((ThreadStartEvent) event);
        } else if (event instanceof ThreadDeathEvent) {
            handleThreadDeathEvent((ThreadDeathEvent) event);
        } else if (event instanceof VMStartEvent) {
            handleVMStartEvent((VMStartEvent) event);
        } else if (event instanceof VMDeathEvent) {
            handleVMDeathEvent((VMDeathEvent) event);
        } else if (event instanceof VMDisconnectEvent) {
            handleVMDisconnectEvent((VMDisconnectEvent) event);
        } else if (event instanceof BreakpointEvent) {
            handleBreakpointEvent((BreakpointEvent) event);
        } else {
            throw new RuntimeException("Unexpected event type : " + event);
        }
    }

    private void handleExceptionEvent(ExceptionEvent event) {
        //todo check event.catchLocation for special cases
//        System.out.println("Exception: " + event.exception() +
//		    " catch: " + event.catchLocation());
        if (event.catchLocation() == null)
            log.info("Exception: " + event.exception());

    }

    private void handleVMStartEvent(VMStartEvent event) {
        jvmDebugServiceListener.onVMStart();
    }


    private void handleVMDeathEvent(VMDeathEvent event) {
        jvmDebugServiceListener.onVMDeath();
    }

    private void handleVMDisconnectEvent(VMDisconnectEvent event) {
        if (stateMachine.isState(State.DEAD))
        {
            stateMachine.doTransit(Transition.DISCONNECT);
            log.info("-- The application has been disconnected --");
        }
    }

    private void handleMethodEntryEvent(MethodEntryEvent event) {
    }

    private void handleMethodExitEvent(MethodExitEvent event) {
    }

    private void handleStepEvent(StepEvent event) {
    }

    private void handleFieldWatchEvent(ModificationWatchpointEvent event) {
        List<EventQuery> eventQueries;
        eventQueries = getEventQueriesForEventRequest(event.request());

//        for (EventQuery eventQuery : eventQueries) {
//            TracePointContext tpc = new TracePointContext(eventQuery, event);
//            boolean isValid = checkRuntime(eventQuery, event); //check other constraints in basicQuery
//            if (isValid) {
//                if (checkCustomRuntime(eventQuery, tpc)) {
//                    addTracePoint(tpc);
//                }
//            }
//        }
    }

    private void handleThreadStartEvent(ThreadStartEvent event) {
    }

    private void handleThreadDeathEvent(ThreadDeathEvent event) {
    }

    /**
     * A new class has been loaded.
     * Set watchpoints on each of its fields
     */
    private void handleClassPrepareEvent(ClassPrepareEvent event) {

//        EventRequestManager mgr = vm.eventRequestManager();
//        String className = event.referenceType().name();
//        System.out.println(event.referenceType().name());
        //todo  remove try/catch
        try {
            addClass(event.referenceType());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleClassUnloadEvent(ClassUnloadEvent event) {
//        EventRequestManager mgr = vm.eventRequestManager();
//        String className = event.referenceType().name();
//        System.out.println(event.referenceType().name());
        //todo  remove try/catch
        try {
            removeClass(event.className());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public void handleBreakpointEvent(BreakpointEvent event) {
//        List<TraceQuery> traceQueries;
//        traceQueries = getEventQueriesForEventRequest(event.request());
//
//        for (TraceQuery traceQuery : traceQueries) {
//            TracePointContext tpc = new TracePointContext(traceQuery, event);
//            boolean isValid = checkRuntime(traceQuery, event); //check other constraints in basicQuery
//            if (isValid) {
//                if (checkCustomRuntime(traceQuery, tpc)) {
//                    addTracePointLog(tpc);
//                }
//            }
//        }
    }


    private boolean checkRuntime(IQuerypoint querypoint, Event event) {
        return true;
    }

    private boolean checkCustomRuntime(IQuerypoint bp, TracePointContext tpc) {
        boolean returnBoolean = false;

//        try {
//            returnBoolean = bp.checkCustomPoint(tpc);
//        } catch (BSHException e) {
//            //todo manage the exception
//            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//        }
        return returnBoolean;
    }

    /**
     * A VMDisconnectedException has happened while dealing with
     * another event. We need to flush the event queue, dealing only
     * with exit events (VMDeath, VMDisconnect) so that we terminate
     * correctly.
     */
    synchronized void handleDisconnectedException(VMDisconnectedException e) {
        log.error("VM DISCONNECTED");
        jvmDebugServiceListener.onVMDeath(); //todo change it
        //todo
        EventQueue queue = vm.eventQueue();
//        while (isWorkinig() || isPaused()) {
            try {
                EventSet eventSet = queue.remove();
                EventIterator iter = eventSet.eventIterator();
                while (iter.hasNext()) {
                    Event event = iter.nextEvent();
                    if (event instanceof VMDeathEvent) {
                        handleVMDeathEvent((VMDeathEvent) event);
                    } else if (event instanceof VMDisconnectEvent) {
                        handleVMDisconnectEvent((VMDisconnectEvent) event);
                    }
                }
                eventSet.resume(); // Resume the VM
            } catch (Exception exc) {
                // ignore
            }
//        }
    }



    //todo change it
    public void addEventQuery(EventQuery eventQuery){
        eventQuery_EventRequests.put(eventQuery, new ArrayList());
        Set<String> classes = repositoryClasses.getAllClassNames();
        for (String className : classes)
        {
            addEventQueryForClass(className, eventQuery);
        }
    }

    private List<EventQuery> getEventQueriesForEventRequest(EventRequest eventRequest)
    {
        List<EventQuery> eventQueriesResult = new ArrayList();
        //todo
        for (EventQuery eventQuery : eventQueries)
        {
            List<EventRequest> eventRequests = eventQuery_EventRequests.get(eventQuery);
            if (eventRequests.contains(eventRequest))
                eventQueriesResult.add(eventQuery);
        }
        return eventQueriesResult;
    }

    private void addClass(ReferenceType clazz)
    {
        log.trace("... adds this class to debug service : " + clazz.name());

        String className = clazz.name();
        repositoryClasses.addClass(className);
        if (className.endsWith("[]")) //an array
            return;   // class has been already added
        for (EventQuery eventQuery : eventQueries)
        {
            addEventQueryForClass(className, eventQuery);
        }
    }

    private void addEventQueryForClass(String className, EventQuery eventQuery)
    {
//        //todo check for nulls or empty lists
        ReferenceType clazz = vm.classesByName(className).get(0);

        Constraint constraint = eventQuery.getConstraintEvent();

        if (constraint instanceof ConstraintMethodEntry ||
            constraint instanceof ConstraintVariableChanged)
        {

            List<InstructionLocation> instructionLocations = repositoryClasses.getLocations(className, constraint);
            for (InstructionLocation instructionLocation: instructionLocations)
            {
                int lineNumber = instructionLocation.getLine();
                BreakpointRequest bpr = null;
                try {
                    log.info("... adds new breakpoint for this location : " + instructionLocation);
                    System.out.println("... adds new breakpoint for this location : " + instructionLocation);
                    Location location = clazz.locationsOfLine(lineNumber).get(0).method().locationOfCodeIndex(
                                                                                    instructionLocation.getCodeIndex());
                    bpr = clazz.virtualMachine().eventRequestManager().
                                            createBreakpointRequest(location);
                } catch (AbsentInformationException e) {
                    //todo manage the exception
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
                if (bpr != null)
                {
                    eventQuery_EventRequests.get(eventQuery).add(bpr);
                }
            }
        }

        if (constraint instanceof ConstraintFieldChanged)
        {
            ConstraintFieldChanged constraintFieldChanged = (ConstraintFieldChanged)constraint;
            ConstraintObjectRef objectRef = constraintFieldChanged.getObject().getRef();

//            Querypoint querypoint = debugModel.getTracePoint(objectRef.getPointname().getData0());
//
//            Tracepoint tracepoint = querypoint.getLastAssignedTracePoint();
//
//            if (tracepoint == null)
//                return;
//
//            String id = objectRef.getPointname().getData0()+"("+objectRef.getFrame().getData0()+"):"+objectRef.getReference().getData0();
//            Tracedata tracedata = tracepoint.
//                    getTraceObjectLog(id);
//            if (tracedata == null)
//                return;
//            if (className.equals(tracedata.getClazz()))
//            {
//                ModificationWatchpointRequest modificationWatchpointRequest = clazz.virtualMachine().eventRequestManager().createModificationWatchpointRequest(clazz.fieldByName(constraintFieldChanged.getField().getData0()));
//                if (modificationWatchpointRequest != null)
//                {
//                    eventQuery_EventRequests.get(eventQuery).add(modificationWatchpointRequest);
//                }
//            }
        }
    }

    //todo fill inside this method
    private void removeClass(String className)
    {
        System.out.println("Unload Class : " + className);
    }

    private void enableDisableTraceQueries()
    {
//        for (TraceQuery traceQuery : debugModel.getTraceQueries())
//        {
//            enableTraceQuery(traceQuery.getName(), isActiveTraceQuery(traceQuery));
//        }
    }


//    private  boolean isActiveTraceQuery(TraceQuery traceQuery)
//    {
//        boolean isAfter = false;
//        boolean isBefore = false;
//
//        List<String> visitedTracePointNames = currentExecution.getVisitedTracePointNames();
//
//        String after = debugModel.getAfterPointName(traceQuery);
//        if ((after == null) || visitedTracePointNames.contains(after))
//        {
//            isAfter = true;
//        }
//
//        String before = debugModel.getBeforePointName(traceQuery);
//        if ((before == null) || (!visitedTracePointNames.contains(before)))
//        {
//            isBefore = true;
//        }
//
//        if (isAfter && isBefore)
//            return true;
//
//        return false;
//    }
    private void enableTraceQuery(String traceQueryName, boolean enable)
    {
        List<EventRequest> ers = eventQuery_EventRequests.get(traceQueryName);
        for (EventRequest er: ers)
        {
            if (enable)
                er.enable();
            else
                er.disable();
        }
    }



}
