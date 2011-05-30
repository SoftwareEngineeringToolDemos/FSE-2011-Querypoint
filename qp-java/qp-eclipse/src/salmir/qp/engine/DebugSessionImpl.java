package salmir.qp.engine;

import com.sun.jdi.VirtualMachine;
import salmir.qp.conf.DebugConfig;
import salmir.qp.conf.QuerypointBean;
import salmir.qp.core.concept.*;
import salmir.qp.debugservice.JVMDebugService;
import salmir.qp.debugservice.JVMDebugServiceListener;
import salmir.qp.query.EventQueryParseException;
import salmir.qp.standalone.JavaDebugTarget;
import salmir.qpdb.concept.DebugModel;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import salmir.util.StateMachine;
import salmir.util.Timer;

import java.util.List;

public class DebugSessionImpl implements DebugSession, JVMDebugServiceListener {

    private static Log log = LogFactory.getLog(DebugSessionImpl.class);

    private static class State {
        public final static String NOT_INITIALIZED = "not_initialized";
        public final static String INITIALIZED = "initialized";
        public final static String WORKING = "working";
        public final static String PAUSED = "paused";
        public final static String STOPPED = "stopped";
    }

    private static class Transition{
        public final static String INIT = "init";
        public final static String START = "start";
        public final static String PAUSE = "pause";
        public final static String RESUME = "resume";
        public final static String STOP = "stop";
        public final static String REINIT = "reinit";
    }

    private final static String[] ALL_STATES = new String[]{
        State.NOT_INITIALIZED, State.INITIALIZED, State.WORKING,
        State.PAUSED, State.STOPPED
    };

    private final static String[][] ALL_TRANSITIONS = new String[][]{
        {Transition.INIT, State.NOT_INITIALIZED, State.INITIALIZED},
        {Transition.START, State.INITIALIZED, State.WORKING},
        {Transition.PAUSE, State.WORKING, State.PAUSED},
        {Transition.RESUME, State.PAUSED, State.WORKING},
        {Transition.STOP, State.PAUSED, State.STOPPED},
        {Transition.REINIT, State.STOPPED, State.INITIALIZED}
    };

    StateMachine reproductionState;
    Timer timer;

    DebugConfig debugConfig;

    DebugModel debugModel;
	List<Reproduction> pastReproductions;
    // It is supposed that there is only one current reproduction.
    Reproduction reproduction;
    JavaDebugTarget debugTarget;
    JVMDebugService jvmDebugService;

    public DebugSessionImpl(DebugConfig debugConfig) {
        reproductionState = new StateMachine(ALL_STATES, State.NOT_INITIALIZED, ALL_TRANSITIONS);
        this.debugConfig = debugConfig;
        timer = new Timer();
    }
    
    public void init(){
        debugModel = null;
        try {
//            debugModel = DebugModel.loadDebugModel(debugConfig.getDebugModelBean());
            debugModel = new DebugModel();
        } catch (RuntimeException e) {
            //todo manage the exception
            e.printStackTrace();
            throw new RuntimeException(e);
        }catch(Throwable ex)
        {
            ex.printStackTrace();
        }

        reproductionState.startTransit(Transition.INIT);
        reproductionState.endTransit();
    }

    public void startReproduction()
    {
        reproductionState.startTransit(Transition.START);
        // start execution
        try {
            log.info("... is going to start the execution reproduction.");
            reproduction = debugConfig.getReproducer().reproduce();
            log.info("The execution reproduction started.");

        } catch (ReproductionException e) {
            //todo manage the exception
            throw new RuntimeException(e);
        }

        debugTarget = (JavaDebugTarget)reproduction.getDebugTarget();
        VirtualMachine vm = debugTarget.getVm();

        jvmDebugService = new JVMDebugService(vm, this);
        jvmDebugService.init();

        timer.start();
        debugTarget.getVm().resume();

        reproductionState.endTransit();
    }

    public void resumeReproduction()
    {
        if (reproductionState.isState(State.INITIALIZED))
            startReproduction();
        else{
            reproductionState.startTransit(Transition.RESUME);
            timer.resume();
            debugTarget.getVm().resume();
            reproductionState.endTransit();
        }
    }

    public void pauseReproduction()
    {
        reproductionState.startTransit(Transition.PAUSE);

        if (reproductionState.isState(State.WORKING)){
            timer.pause();
            debugTarget.getVm().suspend();
        }

        reproductionState.endTransit();
    }

    public void stopReproduction(){
        reproductionState.startTransit(Transition.STOP);
        timer.pause();
        reproductionState.endTransit();

    }


    public void reproduce()
    {
        if (reproductionState.isState(State.WORKING))
            pauseReproduction();
        if (!reproductionState.isState(State.STOPPED))
            stopReproduction();
        reproductionState.startTransit(Transition.REINIT);
        debugConfig.getReproducer().endReproduction(reproduction);
        reproductionState.endTransit();

        timer.reset();
        startReproduction();
    }


    @Override
    public boolean isReproductionAlive() {
        return reproductionState.isState(State.PAUSED) || reproductionState.isState(State.WORKING);
    }

    @Override
    public boolean isReproductionPaused() {
        return reproductionState.isState(State.PAUSED);
    }

    @Override
    public boolean isReproductionStopped() {
        return reproductionState.isState(State.STOPPED);
    }

    @Override
    public Querypoint addQuerypoint() {
        return null;
    }

    @Override
    public void destroy() {
        
    }

    @Override
    public void onVMStart() {
        if (!reproductionState.isState(State.WORKING))
            reproductionState.doTransit(Transition.START);
        timer.start();
        log.info("-- VM START --");
    }

    @Override
    public void onVMDeath() {
        if (!reproductionState.isState(State.STOPPED))
            reproductionState.doTransit(Transition.STOP);
        timer.pause();
        log.info("-- VM DEATH --");
    }

    @Override
    public void onVMSuspend() {
        if (!reproductionState.isState(State.PAUSED))
            reproductionState.doTransit(Transition.PAUSE);
        timer.pause();
        log.info("-- VM SUSPEND --");
    }

    @Override
    public void onVMResume() {
        if (!reproductionState.isState(State.WORKING))
            reproductionState.doTransit(Transition.RESUME);
        timer.resume();
        log.info("-- VM RESUME --");
    }

    @Override
    public void onEvent() {

    }

    public long getReproductionLifeTime()
    {
        return timer.getRecordedTime();
    }

    public long getReproductionLiveTime()
    {
        return timer.getWholeTime();
    }

    public JVMDebugService getJvmDebugService() {
        return jvmDebugService;
    }

    public void addQuerypointBean(QuerypointBean querypointBean) throws EventQueryParseException {
//        Querypoint querypoint = debugModel.addTraceQuery(querypointBean);
//        debugModel.addTraceQueryTraceObjects(querypoint);
//        addQuerypoint(querypoint);
    }

}
