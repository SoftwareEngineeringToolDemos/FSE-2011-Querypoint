package salmir.qp.query.constraint;

import java.util.List;

public class ConstraintAtomic extends Constraint{

    List<String> data;
    public ConstraintAtomic() {
        
    }
    public List<String> getData() {
        return data;
    }

    public void setData(List<String> data) {
        this.data = data;
    }

    public String getData0() // a short cut for geting the first element
    {
        if (data != null && data.size() > 0)
            return data.get(0);
        return null;
    }
    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        for (String item: data)
        {
            sb.append(item + " ");
        }
        return sb.toString();
    }
}
