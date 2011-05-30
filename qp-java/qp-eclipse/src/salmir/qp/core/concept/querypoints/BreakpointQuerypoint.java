package salmir.qp.core.concept.querypoints;

import salmir.qp.core.concept.Querypoint;

public class BreakpointQuerypoint extends Querypoint{

	public String className;
    //bsh code conditions
    public int lineNumber;
    public int hitCount;
    
	public BreakpointQuerypoint(int id, String className, int lineNumber,
			int hitCount) {
		super(id);
		this.className = className;
		this.lineNumber = lineNumber;
		this.hitCount = hitCount;
	}
    
}
