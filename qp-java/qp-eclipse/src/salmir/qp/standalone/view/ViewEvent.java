package salmir.qp.standalone.view;

import java.awt.*;
import java.util.HashMap;
import java.util.Map;

public class ViewEvent {

    int originalViewActionId;
    AWTEvent internalEvent;

    //todo props can be null or cannot ?
    Map<String, Object> props = new HashMap();

    public ViewEvent(int originalViewActionId, AWTEvent internalEvent, Map<String, Object> props) {
        this.originalViewActionId = originalViewActionId;
        this.internalEvent = internalEvent;
        this.props = props;
    }

    public int getOriginalViewActionId() {
        return originalViewActionId;
    }

    public void setOriginalViewActionId(int originalViewActionId) {
        this.originalViewActionId = originalViewActionId;
    }

    public AWTEvent getInternalEvent() {
        return internalEvent;
    }

    public void setInternalEvent(AWTEvent internalEvent) {
        this.internalEvent = internalEvent;
    }

    public Map<String, Object> getProps() {
        return props;
    }

    public void setProps(Map<String, Object> props) {
        this.props = props;
    }
}
