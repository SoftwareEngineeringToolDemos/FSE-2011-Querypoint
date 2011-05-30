package salmir.qp.core.concept;

import java.util.List;
import java.util.ArrayList;

public class Querypoint {

	public int id;
    public String name;
	public boolean enabled = true;
	public List<Querypoint> dependentQuerypoints = new ArrayList<Querypoint>();

    //Data should be collected at this querypoint
    //TODO complete these types by generics
	List<Querydata> querydataList = new ArrayList();   // the list of query expressions (QueryExpr)
    List queryWatchList = new ArrayList();  // the list of watch expressions
	
	//The following properties are updated after every execution reproduction.
	//They show the characteristics of the querypoint in the past executions.
	public boolean breakable = false;
    public boolean breakEnabled = false;
    public int stopIndex = -1;
    public boolean nonDeterminismInStopIndex = false;

	public Querypoint(int id) {
		this.id = id;
	}

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Querydata> getQuerydataList() {
        return querydataList;
    }
}
