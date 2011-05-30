package salmir.qp.engine;

import salmir.qp.conf.DebugConfig;
import salmir.qp.core.concept.DebugSession;
import salmir.qp.debugservice.JVMDebugService;
import salmir.qp.standalone.BasicDebugConfig;
import salmir.util.AppContext;
import salmir.util.concurrent.ManageableThread;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


public class Engine extends ManageableThread {

    private static Log log = LogFactory.getLog(Engine.class);
    private static Engine instance;
    public static String ID = "Engine";

    DebugSessionImpl debugSession;
    EngineMessageHandler engineMessageHandler;

    public static Engine getInstance(){
        if (instance == null){
            instance = new Engine();
        }
        return instance;
    }

    public Engine() {
        super(ID);
    }

    /**
     * Run the event handling thread.
     * As long as we are connected, get event sets off
     * the queue and dispatch the events within them.
     */
    public void init() {
        log.info("Thread Engine is starting ...");
        // load definitions
        DebugConfig debugConfig = null;

        String args[] = AppContext.getSystemArgs();
        if (args == null || args.length == 0)
        {
            log.error("No Argument - Define the Debug Configuration Class");
            return;
        }
        String className = args[0];
        try {
            debugConfig = new BasicDebugConfig(className);
        } catch (Exception e) {
            log.error("Problem in loading/finding the configuration file : " + className ,e);
        }
        debugSession = new DebugSessionImpl(debugConfig);
        debugSession.init();
        engineMessageHandler = new EngineMessageHandler(AppContext.getAsyncChannel());
    }

    public void process(){

        boolean anyJVMEvent = false;
        boolean anyMessage = false;

        if (!debugSession.isReproductionStopped()){
            JVMDebugService jvmDebugService = debugSession.getJvmDebugService();
            if (jvmDebugService != null){
            anyJVMEvent = jvmDebugService.consumeEvents();

//            if (!jvmDebugService.isWorkinig())
//            {
//                debugSession.pauseReproduction();
//                debugSession.stop();
//            }
            }
        }

        anyMessage = engineMessageHandler.handleMessage();
        if (anyJVMEvent==false && anyMessage==false)
        {
            try {
                sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                //ignore
            }
        }
    }

    public DebugSession getDebugSession() {
        return debugSession;
    }

    public void terminate() {
        log.info("... is going to end the reproduction.");
        debugSession.destroy();
        log.info("The monitored reproduction is ended");
    }

}

