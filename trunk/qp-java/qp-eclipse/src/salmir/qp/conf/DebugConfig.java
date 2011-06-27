package salmir.qp.conf;


import salmir.qp.reproduction.IReproducer;

import java.util.List;
import java.util.ArrayList;


public class DebugConfig{

    IReproducer reproducer;
    DebugTargetBean debugTargetBean;
    DebugModelBean debugModelBean;

    public IReproducer getReproducer() {
        return reproducer;
    }

    public void setReproducer(IReproducer reproducer) {
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
