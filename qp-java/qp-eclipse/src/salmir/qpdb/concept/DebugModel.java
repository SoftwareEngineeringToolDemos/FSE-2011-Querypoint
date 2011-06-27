package salmir.qpdb.concept;

import salmir.qp.conf.QuerypointBean;
import salmir.qp.conf.DebugModelBean;
import salmir.qp.core.IQuerypoint;
import salmir.qp.internal.querypoints.DataTobeCollected;

import java.util.List;
import java.util.ArrayList;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import salmir.qp.query.EventQueryParseException;

public class DebugModel {

    private static Log log = LogFactory.getLog(DebugModel.class);

    List<IQuerypoint> querypoints = new ArrayList();
    
    int QuerypointId = 0;
    int tracePointId = 0;                           

    public DebugModel() {
    }

    public List<IQuerypoint> getQuerypoints() {
        return querypoints;
    }


//    public static DebugModel loadDebugModel(DebugModelBean debugModelBean){
//
//        DebugModel debugModel = new DebugModel();
//        List<QuerypointBean> querypointBeans = debugModelBean.getQuerypointBeans();
////        ExceptionalPathException epe = null;
//        for (int i=0 ; i<querypointBeans.size() ; i++)
//        {
//            QuerypointBean querypointBean = querypointBeans.get(i);
//            log.info("... adds new QuerypointDef to DebugModel : " + querypointBean.getBasicQuery());
//            try {
//                Querypoint tq = debugModel.addQuerypoint(querypointBean);
//            } catch (EventQueryParseException e) {
//                throw new RuntimeException(e);
////                if (null == epe)
////                    epe = new ExceptionalPathException();
////                ExceptionalPath ep = new ExceptionalPath(1,i);
////                epe.put(ep, e);
//            }
//        }
////        if (epe != null)
////            throw epe;
//
//
//        //add traceobject to trace points
//        //todo this code is temporary, change it to be more clear and general
//        for (Querypoint tq: debugModel.getQuerypoints())
//        {
//            debugModel.addQuerypointQuerydata(tq);
//        }
//        boolean isConsistent = debugModel.checkModelConsistency();
//        // todo if it is inconsistent throw an exception
//        return debugModel;
//    }
//
//    public synchronized Querypoint addQuerypoint(QuerypointDef QuerypointDef) throws BasicQuerypointParseException{
//
//        //todo check name
//        // give a new id
//        // check its name
//        BasicQuerypointParser parser = new BasicQuerypointParser();
//        BasicQuerypoint basicQuerypoint = parser.parse(QuerypointDef.getBasidQuery());
//
//        Querypoint Querypoint = new Querypoint(QuerypointId++);
//        Querypoint.setName(QuerypointDef.getName());
//        Querypoint.setDescription(QuerypointDef.getDescription());
//        Querypoint.setBasicQuerypoint(basicQuerypoint);
//        Querypoint.setCheckPointBSH(QuerypointDef.getCheckPoint());
//        Querypoint.setAssertPointBSH(QuerypointDef.getAssertPoint());
//        Querypoint.setPausePointBSH(QuerypointDef.getPausePoint());
//        Querypoint.setShowPointBSH(QuerypointDef.getShowPoint());
//
//        traceQueries.add(Querypoint);
//
//        return Querypoint;
//    }

//    public synchronized void addQuerypointTraceObjects(Querypoint tq)
//    {
//        if (tq.getBasicQuerypoint().getConstraintEvent() instanceof ConstraintFieldChanged)
//        {
//            ConstraintObjectRef cor = ((ConstraintFieldChanged)tq.getBasicQuerypoint().getConstraintEvent()).getObject().getRef();
//            Querypoint tp = getTracePoint(cor.getPointname().getData0());
//
//            if (tp == null)
//                throw new RuntimeException("No trace point with this name:" + cor.getPointname());
//            Querydata to = new Querydata(cor.getPointname().getData0(),
//                                 Integer.parseInt(cor.getFrame().getData0()),
//                    cor.getReference().getData0());
//            Querypoint tpTQ = getQuerypoint(tp.getQuerypointName());
//            //tp.addTraceObject(to.toString(),to);
//            tpTQ.addTraceObject(to.toString(),to);
//
//            //todo change this way of referencing from current event
//            Querydata to2 = new Querydata("This", 0, "Object");
//            tq.addTraceObject(to2.toString(),to2);
//
//            ConstraintMultipoint constraintMultipoint = new ConstraintMultipoint(to2.toString(),to.toString());
//            tq.addMultipointConstraint(constraintMultipoint);
//
//        }
//    }
//
//    public synchronized Querypoint addTracePoint(QuerypointBean querypointBean){
//
//        //todo check name
//        // give a new id
//        // check its name
//        Querypoint querypoint = new Querypoint(tracePointId++);
//        querypoint.setName(querypointBean.getName());
//        querypoint.setDescription(querypointBean.getDescription());
//        querypoint.setQuerypointName(querypointBean.getQuerypointName());
//        querypoint.setIndex(querypointBean.getIndex());
//
//        querypoints.add(querypoint);
//        return querypoint;
//    }
//
//    //todo
//    //checks how queries and points are dependent to each other
//    //both after and before points for every query should have been defined.
//    //we should not have cycles in point/query definitions.
//    public synchronized boolean checkModelConsistency()
//    {
//        return true;
//    }
//
//    public Querypoint getQuerypoint(String QuerypointName) {
//        if (QuerypointName ==  null)
//            return null;
//        for (Querypoint tq: traceQueries)
//        {
//            if (tq.getName().equals(QuerypointName))
//                return tq;
//        }
//        return null;
//    }
//    public Querypoint getTracePoint(String tracePointName){
//        if (tracePointName ==  null)
//            return null;
//        for (Querypoint tp: querypoints)
//        {
//            if (tp.getName().equals(tracePointName))
//                return tp;
//        }
//        return null;
//    }
//
//
//    public List<Querypoint> getNegativeTracePointsDefinedByTracePoint(String tracePointName) {
//        if (tracePointName == null)
//            return null;
//        List<Querypoint> points = new ArrayList();
//
//        List<String> queries = new ArrayList(); //list of tracequeries end at this tracepoint
//        for (Querypoint Querypoint : traceQueries)
//        {
//            if (tracePointName.equals(getBeforePointName(Querypoint)))
//                queries.add(Querypoint.getName());
//        }
//
//        for (Querypoint querypoint : querypoints)
//        {
//            if (querypoint.getIndex()<0 && queries.contains(querypoint.getQuerypointName()))
//            {
//                points.add(querypoint);
//            }
//        }
//        return points;
//    }
//
//    public String getAfterPointName(Querypoint Querypoint)
//    {
//        ConstraintAtomic after = Querypoint.getBasicQuerypoint().getConstraintQuerypoint().getAfter();
//        ConstraintAtomic afterthread = Querypoint.getBasicQuerypoint().getConstraintQuerypoint().getAfterthread();
//        if (after != null)
//            return after.getData0();
//        if (afterthread != null)
//            return afterthread.getData0();
//        return null;
//    }
//
//    public String getBeforePointName(Querypoint Querypoint)
//    {
//        ConstraintAtomic before = Querypoint.getBasicQuerypoint().getConstraintQuerypoint().getBefore();
//        ConstraintAtomic beforethread = Querypoint.getBasicQuerypoint().getConstraintQuerypoint().getBeforethread();
//        if (before != null)
//            return before.getData0();
//        if (beforethread != null)
//            return beforethread.getData0();
//        return null;
//    }
//
//    public String toString()
//    {
//        StringBuilder sb = new StringBuilder();
//        sb.append("DebugModel :");
//        sb.append("\n");
//        sb.append("\n");
//        sb.append("#Queries: " + traceQueries.size());
//        sb.append("\n");
//        sb.append("#Points: " + querypoints.size());
//        sb.append("\n");
//        for (Querypoint tq: traceQueries)
//        {
//            sb.append(tq.toString());
//            sb.append("\n");
//        }
//        for (Querypoint tp: querypoints)
//        {
//            sb.append(tp.toString());
//            sb.append("\n");
//        }
//        return sb.toString();
//    }

}
