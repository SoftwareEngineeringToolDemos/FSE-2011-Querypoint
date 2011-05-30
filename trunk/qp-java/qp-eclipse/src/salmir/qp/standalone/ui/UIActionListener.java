package salmir.qp.standalone.ui;

import javax.swing.*;
import java.awt.event.ActionEvent;


public class UIActionListener extends AbstractAction {

    int eventId;

    public UIActionListener(String name, int eventId) {
        super(name);
        this.eventId = eventId;
    }

    public void actionPerformed(ActionEvent e) {
        dispatchEvent(e);
    }

    private void dispatchEvent(ActionEvent e) {
        UI.getInstance().dispatchEvent(new UIEvent(eventId, e));
    }

}
