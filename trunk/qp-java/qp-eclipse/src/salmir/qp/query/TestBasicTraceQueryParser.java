package salmir.qp.query;

//import salmir.qpdb.concept.query.output.QueryLexer;
//import salmir.qpdb.concept.query.output.QueryParser;

public class TestBasicTraceQueryParser {

    public static void main(String args[]) throws Exception
    {
        EventQueryParser parser = new EventQueryParser();
//        EventQuery tq = parser.parse("tracequery{methodEntry{callee{ref{System.out}}  \nmethod{public void println}args[0]{value{null}}args[1]{value{null}}}}");
        EventQuery tq = parser.parse("tracequery{fieldchanged{object{ref{DrawLine0(0):this.color}}field{forgroundcolor}}}");
        //System.out.println("TraceQuery : " + tq);
//        System.out.println("root text: " + ct.getText());
//        System.out.println(ct.getChild(0).getText());
//        System.out.println(ct.getChild(0).getChild(0).getText());
        System.out.println("EventQueryNode : " + tq.getTree());
    }
}
