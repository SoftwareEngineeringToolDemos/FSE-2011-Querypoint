package salmir.qp.core.concept;

import java.util.HashMap;
import java.util.Map;

import salmir.qp.core.IQuerypoint;
import salmir.qp.internal.querypoints.JavaLineBreakpointQuerypoint;
import salmir.qp.internal.querypoints.GeneralQuerypoint;
import salmir.qp.internal.querypoints.LastchangeQuerypoint;

public class DebugModel {
	Map<Integer, IQuerypoint> querypoints = new HashMap<Integer, IQuerypoint>();
    int nextQuerypointId = 0;
    
    public JavaLineBreakpointQuerypoint addBreakpointQuerypoint(String className, int lineNumber, int hitCount){
    	for (IQuerypoint qp: querypoints.values()){
    		if (qp instanceof JavaLineBreakpointQuerypoint){
    			JavaLineBreakpointQuerypoint qpToCompare = (JavaLineBreakpointQuerypoint)qp;
    			if (qpToCompare.className.equals(className)
    			 && qpToCompare.lineNumber == lineNumber
    		     && qpToCompare.hitCount == hitCount){
    				return qpToCompare;
    			}
    		}
    	}
    	JavaLineBreakpointQuerypoint qp = new JavaLineBreakpointQuerypoint(++nextQuerypointId, className, lineNumber, hitCount);
    	querypoints.put(qp.id, qp);
    	return qp;
    }
    
    public LastchangeQuerypoint addLastchangeQuerypoint(IQuerypoint refQuerypoint){
    	for (IQuerypoint qp: querypoints.values()){
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
    
    public GeneralQuerypoint addGeneralQuerypoint(IQuerypoint refQuerypoint){
    	for (IQuerypoint qp: querypoints.values()){
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
