package salmir.qp.standalone.ui;

import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

public class UIWindowListener extends WindowAdapter {
    int eventId;
    int[] listeningEventTypes;

    boolean windowClosing = false;

    public UIWindowListener(int eventId, int[] listeningEventTypes) {
        this.eventId = eventId;
        this.listeningEventTypes = listeningEventTypes;

        for (int eventType : listeningEventTypes) {
            if (eventType == WindowEvent.WINDOW_CLOSING)
                windowClosing = true;
        }
    }

    public void windowClosing(WindowEvent e) {
        if (!windowClosing)
            return;
        dispatchEvent(e);
    }

    private void dispatchEvent(WindowEvent e) {
        UI.getInstance().dispatchEvent(new UIEvent(eventId, e));
    }


}
