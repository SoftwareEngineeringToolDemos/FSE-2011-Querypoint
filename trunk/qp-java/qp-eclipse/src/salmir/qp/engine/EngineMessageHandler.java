package salmir.qp.engine;

import salmir.qp.core.IDebugSession;
import salmir.util.AppContext;
import salmir.util.concurrent.AsynchronousMessageChannel;
import salmir.util.concurrent.Message;
import salmir.util.concurrent.MessageHandler;


public class EngineMessageHandler implements MessageHandler {

    Engine engine;
    AsynchronousMessageChannel asynchronousMessageChannel;
    public EngineMessageHandler(AsynchronousMessageChannel asynchronousMessageChannel) {
        engine = Engine.getInstance();
        this.asynchronousMessageChannel = asynchronousMessageChannel;

    }

    // if there is any event return true;
    public boolean handleMessage()
    {
        Message message = asynchronousMessageChannel.getMessage(Engine.ID);
        if (message != null)
        {
            EngineAction action = (EngineAction) message.getContent();
            handleEvent(action);
            return true;
        }
        return false;
    }

    public void handleEvent(EngineAction e)
    {
        IDebugSession debugSession = engine.getDebugSession();
        if (debugSession == null)
            return;
        if (e.getActionId() == EngineActions.ACTION_START)
        {
           debugSession.resumeReproduction();
        }
        if (e.getActionId() == EngineActions.ACTION_PAUSE)
        {
            debugSession.pauseReproduction();
        }
        if (e.getActionId() == EngineActions.ACTION_RERUN)
        {
            debugSession.reproduce();
        }
        if (e.getActionId() == EngineActions.ACTION_EXIT)
        {
            engine.end();
        }
    }
}
