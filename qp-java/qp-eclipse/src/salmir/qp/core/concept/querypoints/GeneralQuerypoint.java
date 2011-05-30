package salmir.qp.core.concept.querypoints;

import bsh.Interpreter;
import salmir.qp.core.concept.BSHException;
import salmir.qp.core.concept.Querydata;
import salmir.qp.core.concept.Querypoint;
import salmir.qp.core.concept.TracePointContext;
import salmir.qp.query.EventQuery;
import salmir.qp.query.constraint.ConstraintMultipoint;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GeneralQuerypoint extends Querypoint{

    String description;
    String checkPointBSH; //bsh
    String assertPointBSH; //bsh
    String showPointBSH; //bsh
    String pausePointBSH; //bsh
//    TraceQueryDef tqd;
    EventQuery eventQuery;
    public Querypoint refQuerypoint;

    public static final int INDEX_LAST  = -1;
    public static final int INDEX_FIRST = 0;
    int index;  //-1 means last -2 means last-1

    Map<String, Querydata> querydata = new HashMap();
    List<ConstraintMultipoint> multipointConstraints = new ArrayList();

    public GeneralQuerypoint(int id, Querypoint refQuerypoint) {
        super(id);
        this.refQuerypoint = refQuerypoint;
    }

    public GeneralQuerypoint(int id, String name, String description, EventQuery eventQuery,
                      String checkPointBSH, String assertPointBSH, String pausePointBSH, String showPointBSH) {
        super(id);
        this.name = name;
        this.description = description;
        this.eventQuery = eventQuery;
        this.checkPointBSH = checkPointBSH;
        this.assertPointBSH = assertPointBSH;
        this.pausePointBSH = pausePointBSH;
        this.showPointBSH = showPointBSH;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCheckPointBSH() {
        return checkPointBSH;
    }

    public void setCheckPointBSH(String checkPointBSH) {
        this.checkPointBSH = checkPointBSH;
    }

    public String getAssertPointBSH() {
        return assertPointBSH;
    }

    public void setAssertPointBSH(String assertPointBSH) {
        this.assertPointBSH = assertPointBSH;
    }

    public String getPausePointBSH() {
        return pausePointBSH;
    }

    public void setPausePointBSH(String pausePointBSH) {
        this.pausePointBSH = pausePointBSH;
    }

    public String getShowPointBSH() {
        return showPointBSH;
    }

    public void setShowPointBSH(String showPointBSH) {
        this.showPointBSH = showPointBSH;
    }

    public EventQuery getEventQuery() {
        return eventQuery;
    }

    public void setEventQuery(EventQuery eventQuery) {
        this.eventQuery = eventQuery;
    }

    // functions
    public boolean checkCustomPoint(TracePointContext pc) throws BSHException{
        return evalBSH(pc, checkPointBSH);
    }

    public boolean assertPoint(TracePointContext pc) throws BSHException{
        return evalBSH(pc, assertPointBSH);
    }

    public boolean showPoint(TracePointContext pc) throws BSHException{
        return evalBSH(pc, showPointBSH);
    }

    public boolean pausePoint(TracePointContext pc) throws BSHException{
        return evalBSH(pc, pausePointBSH);
    }

    private boolean evalBSH(TracePointContext pc, String bsh) throws BSHException{
        if (bsh == null)
            return true;

        Interpreter i = new Interpreter();  // Construct an interpreter
        try{
            i.set("tpc", pc );
            Boolean b = ((Boolean) i.eval(bsh));
            if (b != null)
                return b;
        }catch(Exception exp)
        {
            throw new BSHException(exp);
        }
        return true;
    }

    public Map<String, Querydata> getQuerydata() {
        return querydata;
    }

    public void setQuerydata(Map<String, Querydata> querydata) {
        this.querydata = querydata;
    }

    public void addMultipointConstraint(ConstraintMultipoint constraint)
    {
        multipointConstraints.add(constraint);
    }

    public List<ConstraintMultipoint> getMultipointConstraints() {
        return multipointConstraints;
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append("TraceQuery {");
        sb.append("\n");
        sb.append("id:" + id);
        sb.append("\n");
        sb.append("name: " + name);
        sb.append("\n");
        sb.append("description: " + description);
        sb.append("\n");
        sb.append("eventQuery: " + eventQuery);
        sb.append("\n");
        sb.append("checkPointBSH: " + checkPointBSH);
        sb.append("\n");
        sb.append("assertPointBSH: " + assertPointBSH);
        sb.append("\n");
        sb.append("showPointBSH: " + showPointBSH);
        sb.append("\n");
        sb.append("pausePointBSH: " + pausePointBSH);
        sb.append("\n");
        sb.append("TraceObjects:");
        sb.append("\n");
        for (String key : querydata.keySet())
        {
            sb.append(querydata.get(key));
            sb.append("\n");
        }
        sb.append("}");
        return sb.toString();
    }
}
