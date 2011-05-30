package salmir.qp.standalone.view;

import salmir.util.AppContext;
import salmir.qp.standalone.ui.TraceUI;
import salmir.qp.standalone.ui.UI;
import salmir.util.concurrent.AsynchronousMessageChannel;
import salmir.util.concurrent.ManageableThread;
import salmir.util.concurrent.Message;

public class View extends ManageableThread {

    public static String ID = "View";
    public static View instance;
    ViewMessageHandler viewMessageHandler;

    public static View getInstance(){
        if (instance == null){
             instance = new View();
        }
        return instance;
    }


    public View() {
        super(ID);
        setPriority(Thread.MIN_PRIORITY);
    }

    public void init(){

        viewMessageHandler = new ViewMessageHandler(AppContext.getAsyncChannel());
        UI.getInstance().show();

    }

    public void process() {

        boolean newMessage = viewMessageHandler.handleMessage();

        boolean doSleep = false;


//        if (!traceUI.isShowing() || traceUI.getSize().getWidth() == 0)
//        {
//            doSleep = true;
//        }else
//        {
            UI.getInstance().repaintTraceUI();
            try {
                sleep(100);
            } catch (InterruptedException e) {
                //do nothing
                Thread.currentThread().interrupt();
            }
//        }
        if (doSleep){ // to prevent looping when there isn't any change
            try {
                sleep(500);
            } catch (InterruptedException e) {
                //do nothing
                Thread.currentThread().interrupt();
            }
        }
    }

    //return true if it is updated
    public boolean update()
    {
//        DebugSessionImpl reproductionManager = AppContext.getDebugSession();
//        if (reproductionManager == null)
//            return false;
//        if (reproductionManager.getLastChangeTime() > lastUpdateTime)
//            lastUpdateTime = reproductionManager.getLastChangeTime();
//        else
//            return false;
//
//        if (reproductionManager.isInTransition())
//        {
//            ControllerActions.getAction(ControllerActions.ACTION_START).setEnabled(false);
//            ControllerActions.getAction(ControllerActions.ACTION_PAUSE).setEnabled(false);
//        }else
//        {
//            ControllerActions.getAction(ControllerActions.ACTION_START).setEnabled(!reproductionManager.isAlive() || reproductionManager.isPaused());
//            ControllerActions.getAction(ControllerActions.ACTION_PAUSE).setEnabled(reproductionManager.isAlive() && !reproductionManager.isPaused());
//        }
//        return true;
        return false;
    }

    @Override
    public void terminate() {

    }
}
