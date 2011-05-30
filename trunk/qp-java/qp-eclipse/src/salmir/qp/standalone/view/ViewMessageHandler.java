package salmir.qp.standalone.view;

import salmir.util.AppContext;
import salmir.qp.engine.Engine;
import salmir.qp.engine.EngineAction;
import salmir.qp.engine.EngineActions;
import salmir.qp.standalone.ui.*;
import salmir.util.concurrent.AsynchronousMessageChannel;
import salmir.util.concurrent.Message;
import salmir.util.concurrent.MessageHandler;

import javax.swing.*;
import java.awt.event.MouseWheelEvent;
import java.lang.reflect.InvocationTargetException;

public class ViewMessageHandler implements MessageHandler {

    AsynchronousMessageChannel asynchronousMessageChannel;

    public ViewMessageHandler(AsynchronousMessageChannel asynchronousMessageChannel) {
        this.asynchronousMessageChannel = asynchronousMessageChannel;
    }

    //returns true if there is any event
    public boolean handleMessage() {
        Message message = asynchronousMessageChannel.getMessage(View.ID);
        if (message == null)
            return false;
        UIEvent event = (UIEvent) message.getContent();
        handleEvent(event);
        return true;
    }

    private void handleEvent(UIEvent event) {
        switch (event.getEventId()) {
            case UIEvents.EVENT_EXIT:
                handleEvent_Exit(event);
                break;
            case UIEvents.EVENT_EXIT_PROMPT:
                handleEvent_ExitPrompt(event);
                break;
            case UIEvents.EVENT_START:
                handleEvent_Start(event);
                break;
            case UIEvents.EVENT_PAUSE:
                handleEvent_Pause(event);
                break;
            case UIEvents.EVENT_RERUN:
                handleEvent_ReRun(event);
                break;
            case UIEvents.EVENT_PRINT:
                handleEvent_Print(event);
                break;
            case UIEvents.EVENT_QUERY_FORM:
                handleEvent_Query_Form(event);
                break;
            case UIEvents.EVENT_ADD_POINT:
                handleEvent_Add_Point(event);
                break;
            case UIEvents.EVENT_ADD_QUERY:
                handleEvent_Add_Query(event);
                break;
            case UIEvents.EVENT_TRACE_ZOOM:
                handleEvent_TraceZoom(event);
                break;
        }
    }

    private void handleEvent_Start(UIEvent event) {
            Message message = new Message(Engine.ID, new EngineAction(EngineActions.ACTION_START, null));
            asynchronousMessageChannel.sendAsyncMessage(Engine.ID, message);
    }

    private void handleEvent_Pause(UIEvent event) {
        Message message = new Message(Engine.ID, new EngineAction(EngineActions.ACTION_PAUSE, null));
        asynchronousMessageChannel.sendAsyncMessage(Engine.ID, message);
    }

    private void handleEvent_ReRun(UIEvent event) {
        Message message = new Message(Engine.ID, new EngineAction(EngineActions.ACTION_RERUN, null));
        asynchronousMessageChannel.sendAsyncMessage(Engine.ID, message);
    }

    private void handleEvent_Exit(UIEvent event) {
        Message message = new Message(Engine.ID, new EngineAction(EngineActions.ACTION_EXIT, null));
        asynchronousMessageChannel.sendAsyncMessage(Engine.ID, message);
        //todo it should ask one of threads to end all threads and then call exit(0)
        System.exit(0);
    }

    private void handleEvent_ExitPrompt(UIEvent event) {
        UI.getInstance().showExitPrompt();
    }

    private void handleEvent_Print(UIEvent event) {
//        ActionEvent e = (ActionEvent) event.getInternalEvent();
//        String newline = "\n";
//        StringBuilder s = new StringBuilder();
//
//        Map<String, Querypoint> map = AppContext.getRepositoryRuntime().getCurrentExecution().getVisitedTracePoints();
//        for (String key : map.keySet()) {
//            s.append(key).append(newline);
//            s.append(map.get(key));
//            s.append("--------------------------------------------------------------------------------------------------------------------");
//            s.append(newline);
//        }
//        s.append("--------------------------------------------------------------------------------------------------------------------");
//        s.append(newline);
//        s.append("--------------------------------------------------------------------------------------------------------------------");
//        s.append(newline);
//        s.append(AppContext.getRepositoryRuntime().getDebugModel().toString());
//        //todo append is thread safe but this call can be done in another way
//        ((JTextArea) UIComponents.getComponent(UIComponents.LOG_AREA)).setText("");
//        ((JTextArea) UIComponents.getComponent(UIComponents.LOG_AREA)).append(s.toString());
    }

    private void handleEvent_Query_Form(UIEvent event) {
        UI.getInstance().showQueryForm();
    }

    private void handleEvent_Add_Point(UIEvent event) {
        //todo change it, this change should be done by engine thread
//        try {
//            AppContext.getRepositoryRuntime().addTracePointDef((QuerypointBean)event.getProps().get("tracepointdef"));
//        } catch (BasicTraceQueryParseException e1) {
//            e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//        }
    }
    private void handleEvent_Add_Query(UIEvent event) {
        try {
            SwingUtilities.invokeAndWait(new Runnable() {
                public void run() {
                    ((FormTraceQuery)(UIComponents.getComponent(UIComponents.FORM_TRACEQUERY))).setVisible(false);
                }
            });
        } catch (InterruptedException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (InvocationTargetException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
//        TraceQueryDef traceQueryDef = ((FormTraceQuery) UIComponents.getComponent(UIComponents.FORM_TRACEQUERY)).getTraceQueryDef();
//
//        //todo change it, this change should be done by engine thread
//        try {
//            AppContext.getRepositoryRuntime().addTraceQueryDef(traceQueryDef);
//        } catch (BasicTraceQueryParseException e1) {
//            e1.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
//        }
    }

    private void handleEvent_TraceZoom(UIEvent event){
//                String newline = "\n";
//                String message;
//                       int notches = e.getWheelRotation();
//                       if (notches < 0) {
//                           message = "Mouse wheel moved UP "
//                                        + -notches + " notch(es)" + newline;
//                       } else {
//                           message = "Mouse wheel moved DOWN "
//                                        + notches + " notch(es)" + newline;
//                       }
//                       if (e.getScrollType() == MouseWheelEvent.WHEEL_UNIT_SCROLL) {
//                           message += "    Scroll type: WHEEL_UNIT_SCROLL" + newline;
//                           message += "    Scroll amount: " + e.getScrollAmount()
//                                   + " unit increments per notch" + newline;
//                           message += "    Units to scroll: " + e.getUnitsToScroll()
//                                   + " unit increments" + newline;
//                           message += "    Vertical unit increment: "
////                               + scroll.getVerticalScrollBar().getUnitIncrement(1)
//                               + " pixels" + newline;
//                       } else { //scroll type == MouseWheelEvent.WHEEL_BLOCK_SCROLL
//                           message += "    Scroll type: WHEEL_BLOCK_SCROLL" + newline;
//                           message += "    Vertical block increment: "
////                               + scroll.getVerticalScrollBar().getBlockIncrement(1)
//                               + " pixels" + newline;
//                       }
//                System.out.println("Message : " + message);

        UI.getInstance().zoomTraceUI(-((MouseWheelEvent)event.getOriginalEvent()).getUnitsToScroll());
    }
}
