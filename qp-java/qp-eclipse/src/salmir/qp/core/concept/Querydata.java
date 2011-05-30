package salmir.qp.core.concept;


public class Querydata {

    public static final int TRACE_ID = 1;

    int frame;
    String expression;

    public Querydata(String expression) {
        this.frame = 0;
        this.expression = expression;
    }

    public Querydata(int frame, String expression) {
        this.frame = frame;
        this.expression = expression;
    }


    public int getFrame() {
        return frame;
    }

    public String getExpression() {
        return expression;
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("(").append(frame).append(")").append(":").append(expression);
        return sb.toString();
    }
}
