package salmir.qp.standalone;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import salmir.qp.engine.Engine;
import salmir.qp.standalone.view.View;
import salmir.util.AppContext;
import salmir.util.concurrent.AsynchronousMessageChannel;
import salmir.util.concurrent.ManageableThread;

public class Starter extends ManageableThread {

    public final static String ID = "Starter";

    private static Log log = LogFactory.getLog(Starter.class);
    private static Starter instance;

    public static void main(String args[]) {
        AppContext.set(AppContext.SYSTEM_ARGS, args);
        AppContext.set(AppContext.ASYNC_CHANNEL, new AsynchronousMessageChannel(50));
        Starter starter = Starter.getInstance();
        starter.start();
    }

    public static Starter getInstance() {
        if (instance == null)
            instance = new Starter();
        return instance;
    }

    public Starter() {
        super(ID);
    }

    public void init() {
        log.info("----------- Starter Thread is starting ... ");
    }

    public void process() {
        Engine engine = Engine.getInstance();
        View view = View.getInstance();
        engine.start();
        view.start();
        this.end();
    }

    public void terminate() {
        log.info("----------- Starter Thread is shutting down ... ");
    }
}