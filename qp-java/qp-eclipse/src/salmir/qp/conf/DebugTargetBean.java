package salmir.qp.conf;

import java.util.Map;


public class DebugTargetBean {

    public static String TYPE_JAVA = "java";
    public static String TYPE_DB = "db";

    String name;
    String type;
    boolean redirectProcessOutput = true;
    Map<String, String> props;

    public DebugTargetBean(String name, String type, Map<String, String> props) {
        this.name = name;
        this.type = type;
        this.props = props;
    }

    public DebugTargetBean(String name, String type, boolean redirectProcessOutput, Map<String, String> props) {
        this.name = name;
        this.type = type;
        this.redirectProcessOutput = redirectProcessOutput;
        this.props = props;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isRedirectProcessOutput() {
        return redirectProcessOutput;
    }

    public void setRedirectProcessOutput(boolean redirectProcessOutput) {
        this.redirectProcessOutput = redirectProcessOutput;
    }

    public Map<String, String> getProps() {
        return props;
    }

    public void setProps(Map<String, String> props) {
        this.props = props;
    }


}
