package salmir.qp.engine;

import java.util.HashMap;


public class EngineAction {

    int actionId;

    //props can be null
    HashMap<String, Object> props = new HashMap();

    public EngineAction(int actionId, HashMap<String, Object> props) {
        this.actionId = actionId;
        this.props = props;
    }


    public int getActionId() {
        return actionId;
    }

    public void setActionId(int actionId) {
        this.actionId = actionId;
    }

    public HashMap<String, Object> getProps() {
        return props;
    }

    public void setProps(HashMap<String, Object> props) {
        this.props = props;
    }
}
