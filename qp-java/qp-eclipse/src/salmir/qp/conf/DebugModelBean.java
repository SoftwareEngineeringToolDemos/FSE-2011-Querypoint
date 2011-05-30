package salmir.qp.conf;

import java.util.List;
import java.util.ArrayList;


public class DebugModelBean {

    List<QuerypointBean> querypointBeans = new ArrayList<QuerypointBean>();

    public List<QuerypointBean> getQuerypointBeans() {
        return querypointBeans;
    }

    public void addQuerypointBean(QuerypointBean qpb)
    {
        if (getQuerypointBeanByName(qpb.getIdentifier()) != null) // there is another trace query with the same name
        {
            //tod manage the exception by a special exception
            throw new RuntimeException("Another trace point with the same name has been already defined : " + qpb.getIdentifier());
        }
        if (qpb.getIdentifier() == null)
            qpb.setIdentifier("point-" + querypointBeans.size());
        querypointBeans.add(qpb);
    }

    private QuerypointBean getQuerypointBeanByName(String name)
    {
        if (name == null)
            return null;
        for (QuerypointBean tpd: querypointBeans)
        {
            if (name.equals(tpd.getIdentifier()))
                return tpd;
        }
        return null;
    }
}
