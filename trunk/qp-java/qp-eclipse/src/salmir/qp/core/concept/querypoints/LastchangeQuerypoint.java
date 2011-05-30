package salmir.qp.core.concept.querypoints;

import salmir.qp.core.concept.Querypoint;

public class LastchangeQuerypoint extends Querypoint{
    public Querypoint refQuerypoint;
    //property reference

	public LastchangeQuerypoint(int id, Querypoint refQuerypoint) {
		super(id);
		this.refQuerypoint = refQuerypoint;
	}
    
    
}
