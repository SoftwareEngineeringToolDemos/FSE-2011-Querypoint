package salmir.qp.conf;


import salmir.qp.core.concept.Reproducer;

import java.util.List;
import java.util.ArrayList;


public class DebugConfig{

    Reproducer reproducer;
    DebugTargetBean debugTargetBean;
    DebugModelBean debugModelBean;

    public Reproducer getReproducer() {
        return reproducer;
    }

    public void setReproducer(Reproducer reproducer) {
        this.reproducer = reproducer;
    }

    public DebugTargetBean getDebugTargetBean() {
        return debugTargetBean;
    }

    public void setDebugTargetBean(DebugTargetBean debugTargetBean) {
        this.debugTargetBean = debugTargetBean;
    }

    public DebugModelBean getDebugModelBean() {
        return debugModelBean;
    }

    public void setDebugModelBean(DebugModelBean debugModelBean) {
        this.debugModelBean = debugModelBean;
    }
}
