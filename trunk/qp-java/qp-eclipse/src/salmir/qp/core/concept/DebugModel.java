package salmir.qp.core.concept;

import java.util.HashMap;
import java.util.Map;

import salmir.qp.core.concept.querypoints.BreakpointQuerypoint;
import salmir.qp.core.concept.querypoints.GeneralQuerypoint;
import salmir.qp.core.concept.querypoints.LastchangeQuerypoint;

public class DebugModel {
	Map<Integer, Querypoint> querypoints = new HashMap<Integer, Querypoint>();
    int nextQuerypointId = 0;
    
    public BreakpointQuerypoint addBreakpointQuerypoint(String className, int lineNumber, int hitCount){
    	for (Querypoint qp: querypoints.values()){
    		if (qp instanceof BreakpointQuerypoint){
    			BreakpointQuerypoint qpToCompare = (BreakpointQuerypoint)qp;
    			if (qpToCompare.className.equals(className)
    			 && qpToCompare.lineNumber == lineNumber
    		     && qpToCompare.hitCount == hitCount){
    				return qpToCompare;
    			}
    		}
    	}
    	BreakpointQuerypoint qp = new BreakpointQuerypoint(++nextQuerypointId, className, lineNumber, hitCount);
    	querypoints.put(qp.id, qp);
    	return qp;
    }
    
    public LastchangeQuerypoint addLastchangeQuerypoint(Querypoint refQuerypoint){
    	for (Querypoint qp: querypoints.values()){
    		if (qp instanceof LastchangeQuerypoint){
    			LastchangeQuerypoint qpToCompare = (LastchangeQuerypoint)qp;
    			if (qpToCompare.refQuerypoint.id == refQuerypoint.id){
    				return qpToCompare;
    			}
    		}
    	}
    	LastchangeQuerypoint qp = new LastchangeQuerypoint(++nextQuerypointId, refQuerypoint);
    	querypoints.put(qp.id, qp);
    	return qp;
    }
    
    public GeneralQuerypoint addGeneralQuerypoint(Querypoint refQuerypoint){
    	for (Querypoint qp: querypoints.values()){
    		if (qp instanceof GeneralQuerypoint){
    			GeneralQuerypoint qpToCompare = (GeneralQuerypoint)qp;
    			if (qpToCompare.refQuerypoint.id == refQuerypoint.id){
    				return qpToCompare;
    			}
    		}
    	}
    	GeneralQuerypoint qp = new GeneralQuerypoint(++nextQuerypointId, refQuerypoint);
    	querypoints.put(qp.id, qp);
    	return qp;
    }
    
    
    
    
}
