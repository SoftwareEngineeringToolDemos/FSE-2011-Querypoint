package salmir.qp.standalone.ui;

import java.awt.event.*;


public class UIMouseListener extends MouseAdapter {

    int eventId;
    int[] listeningEventTypes;

    boolean mouseClicked = false;
    boolean mouseEntered = false;
    boolean mousePressed = false;
    boolean mouseReleased = false;
    boolean mouseMoved = false;
    boolean mouseWheel = false;

    public UIMouseListener(int eventId, int[] listeningEventTypes) {
        this.eventId = eventId;
        this.listeningEventTypes = listeningEventTypes;

        for (int eventType : listeningEventTypes) {
            switch (eventType) {
                case MouseEvent.MOUSE_CLICKED:
                    mouseClicked = true;
                    break;
                case MouseEvent.MOUSE_ENTERED:
                    mouseEntered = true;
                    break;
                case MouseEvent.MOUSE_PRESSED:
                    mousePressed = true;
                    break;
                case MouseEvent.MOUSE_RELEASED:
                    mouseReleased = true;
                    break;
                case MouseEvent.MOUSE_MOVED:
                    mouseMoved = true;
                    break;
                case MouseEvent.MOUSE_WHEEL:
                    mouseWheel = true;
                    break;
            }
        }
    }

    public void mouseClicked(MouseEvent e) {
        if (!mouseClicked)
            return;
        dispatchEvent(e);
    }


    public void mouseEntered(MouseEvent e) {
        if (!mouseEntered)
            return;
        dispatchEvent(e);
    }


    public void mousePressed(MouseEvent e) {
        if (!mousePressed)
            return;
        dispatchEvent(e);
    }

    public void mouseReleased(MouseEvent e) {
        if (!mouseReleased)
            return;
        dispatchEvent(e);
    }

    public void mouseMoved(MouseEvent e) {
        if (!mouseMoved)
            return;
        dispatchEvent(e);
    }

    public void mouseWheelMoved(MouseWheelEvent e) {
        if (!mouseWheel)
            return;
        dispatchEvent(e);
    }

    private void dispatchEvent(MouseEvent e) {
        UI.getInstance().dispatchEvent(new UIEvent(eventId, e));

    }
}
