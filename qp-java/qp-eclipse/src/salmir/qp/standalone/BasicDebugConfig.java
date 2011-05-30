package salmir.qp.standalone;

import salmir.qp.conf.DebugConfig;

public class BasicDebugConfig extends DebugConfig {

    public BasicDebugConfig(String className) {
        setReproducer(new BasicJavaReproducer(className));
    }
}
