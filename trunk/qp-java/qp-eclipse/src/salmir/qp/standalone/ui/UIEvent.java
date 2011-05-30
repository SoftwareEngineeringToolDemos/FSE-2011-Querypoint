package salmir.qp.standalone.ui;

import java.awt.*;

public class UIEvent {

    int eventId;
    AWTEvent originalEvent;

    public UIEvent(int eventId, AWTEvent originalEvent) {
        this.eventId = eventId;
        this.originalEvent = originalEvent;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public AWTEvent getOriginalEvent() {
        return originalEvent;
    }

    public void setOriginalEvent(AWTEvent originalEvent) {
        this.originalEvent = originalEvent;
    }
}
