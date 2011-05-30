package salmir.qp.standalone.ui;


import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import java.util.EventListener;
import java.util.HashMap;


public class UIEvents {

    public static final int EVENT_START = 0;
    public static final int EVENT_PAUSE = 1;
    public static final int EVENT_RERUN = 2;
    public static final int EVENT_PRINT = 3;
    public static final int EVENT_EXIT_PROMPT = 4;
    public static final int EVENT_EXIT = 5;
    public static final int EVENT_ADD_POINT = 6;
    public static final int EVENT_ADD_QUERY = 7;
    public static final int EVENT_QUERY_FORM = 8;

    public static final int EVENT_TRACE_POPUP = 9;
    public static final int EVENT_TRACE_ZOOM = 10;

    static HashMap<Integer, EventListener> listeners = new HashMap<Integer, EventListener>();

    static {
        int id;
        String label;
        EventListener eventListener;

        id = EVENT_START;
        label = "Start";
        eventListener = new UIActionListener(label, id);
        listeners.put(id, eventListener);

        id = EVENT_PAUSE;
        label = "Pause";
        eventListener = new UIActionListener(label, id);
        listeners.put(id, eventListener);

        id = EVENT_RERUN;
        label = "Rerun";
        eventListener = new UIActionListener(label, id);
        listeners.put(id, eventListener);

        id = EVENT_PRINT;
        label = "Print";
        eventListener = new UIActionListener(label, id);
        listeners.put(id, eventListener);

        id = EVENT_QUERY_FORM;
        label = "Add Query";
        eventListener = new UIActionListener(label, id);
        listeners.put(id, eventListener);

        id = EVENT_ADD_POINT;
        label = "Point";
        eventListener = new UIActionListener(label, id);
        listeners.put(id, eventListener);


        id = EVENT_ADD_QUERY;
        label = "Query";
        eventListener = new UIActionListener(label, id);
        listeners.put(id, eventListener);

        id = EVENT_EXIT_PROMPT;
        eventListener = new UIWindowListener(id, new int[]{WindowEvent.WINDOW_CLOSING});
        listeners.put(id, eventListener);

        id = EVENT_TRACE_POPUP;
        eventListener = new UIMouseListener(id, new int[]{MouseEvent.MOUSE_PRESSED, MouseEvent.MOUSE_RELEASED});
        listeners.put(id, eventListener);

        id = EVENT_TRACE_ZOOM;
        eventListener = new UIMouseListener(id, new int[]{MouseEvent.MOUSE_WHEEL});
        listeners.put(id, eventListener);
    }

    public static EventListener getListener(int eventId) {
        return listeners.get(eventId);
    }

}
