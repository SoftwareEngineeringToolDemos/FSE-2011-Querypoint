package salmir.qp.core.concept;

import com.sun.jdi.*;
import salmir.qp.query.constraint.ConstraintMultipoint;

import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


//todo at the moment it's not thread-safe
public class Trace {

    private static Log log = LogFactory.getLog(Trace.class);

    Map<Integer, List<Tracepoint>> tracepoints; // Map<Querypoing id, the list of tracepoints>
    int nextTracepointId;

//    Map<String, List<Tracepoint>> traceQueryName_likely_tracePointLogs = new HashMap();
//    Map<String, List<Tracepoint>> tracePointName_likely_tracePointLogs = new HashMap();
//    Map<String, List<Tracepoint>> traceQueryName_tracePointLogs = new HashMap();
//    Map<String, Tracepoint> tracePointName_tracePointLog = new HashMap();

    List<String> visitedTracePoints = new ArrayList();

    //todo execution log should be informed about debugModel changes
    // if a tracequery removed or added it should update its data structures
    DebugModel debugModel;
    public Trace(DebugModel debugModel) {
        this.tracepoints = new HashMap<Integer, List<Tracepoint>>();
        this.nextTracepointId = 0;

//        this.debugModel = debugModel;
//        for (TraceQuery tq : debugModel.getTraceQueries())
//        {
//            traceQueryName_likely_tracePointLogs.put(tq.getName(), new ArrayList());
//            traceQueryName_tracePointLogs.put(tq.getName(), new ArrayList());
//        }

//        for (Querypoint querypoint : debugModel.getTracePoints())
//        {
//            tracePointName_likely_tracePointLogs.put(querypoint.getName(), new ArrayList());
//        }
    }

    public Tracepoint addTracepoint(TracePointContext tracePointContext)
    {
        Querypoint querypoint = tracePointContext.getQuerypoint();
        String querypointName = querypoint.getName();
        long jvmLifeTime = tracePointContext.getDebugSession().getReproductionLifeTime();
        long addedTime = tracePointContext.getDebugSession().getReproductionLiveTime();

        List<Tracepoint> qpTracepoints = tracepoints.get(querypoint.getId());
        if (qpTracepoints == null){
            qpTracepoints = new ArrayList<Tracepoint>();
            tracepoints.put(querypoint.getId(), qpTracepoints);
        }

        int index = qpTracepoints.size();

        Tracepoint tp = new Tracepoint(++nextTracepointId);

        tp.setIndex(index);
        tp.setJvmTime(jvmLifeTime);
        tp.setAddedTime(addedTime);
//        tp.setPossibleTraceQueryName(traceQueryName);

        qpTracepoints.add(tp);

//        TraceQuery traceQuery = debugModel.getTraceQuery(traceQueryName);
//        List<ConstraintMultipoint> constraintMultipoints = traceQuery.getMultipointConstraints();
//        List<Integer> constraintsToBeChecked = new ArrayList();
//        for (int i=0; i<constraintMultipoints.size() ; i++)
//        {
//            constraintsToBeChecked.add(i);
//        }
//        tp.setRemainedMultipointConstraintsToCheck(constraintsToBeChecked);

//        List<Tracepoint> tracepoints;
//
//        //getting the next possibleIndex value
//        int index;
//        if (constraintsToBeChecked.size() == 0)
//        {
//            tracepoints = traceQueryName_tracePointLogs.get(traceQueryName);
//            tp.setTraceQueryName(traceQueryName);
//            index = tracepoints.size(); //becareful: it might have been changed by adding another tracepointlog
//            tp.setIndex(index);
//        }else
//        {
//            tracepoints = traceQueryName_likely_tracePointLogs.get(traceQueryName);
//            index = tracepoints.size(); //becareful: it might have been changed by adding another tracepointlog
//        }
//
//        tracepoints.add(tp);
//        tp.setPossibleIndex(index);


        ThreadReference threadReference = tracePointContext.getThreadReference();
        tp.setThreadName(threadReference.name());

        //todo if the frmaes length is too long then it might create problems
        // you should bound it or only save the pattern or last part in the developer's code
        List<StackFrame> frames = null;
        try {
            frames = threadReference.frames();
        } catch (IncompatibleThreadStateException e) {
            //todo manage the exception
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        if (frames != null)
        {
            for (StackFrame frame: frames)
            {
                String SourcePath = null;
                try {
                    SourcePath = frame.location().sourcePath();
                } catch (AbsentInformationException e) {
                    e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
                }
                Integer line = frame.location().lineNumber();
                long codeIndex = frame.location().codeIndex();
                tp.addFrameInfo(SourcePath, frame.location().method().name(), line, codeIndex);
            }
        }
        try {
            tp.setThreadFrameCount(threadReference.frameCount());
        } catch (IncompatibleThreadStateException e) {
            //todo manage the exception
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

        //store traceobjectlog
        List<Querydata> querydataList = querypoint.getQuerydataList();
        for (Querydata querydata : querydataList)
        {
            ObjectReference or = tracePointContext.getObjectReference(querydata.getFrame(),querydata.getExpression());
            if (or == null)
                throw new RuntimeException("This Querydata can not be collected : " + querydata);
            Tracedata tracedata = new Tracedata();
            tracedata.setObjectId(or.uniqueID()); //todo this might not be unique for long runs
            tracedata.setClazz(or.referenceType().name());
            tp.addTracedata(querydata.toString(), tracedata);
        }

        //recognizes corresponding tracepoint
        assignTracepointToQuerypoint(tp);

        //finds other tracepoints which have not found yet

        return tp;
//        return null;
    }

    //todo proofread
    //instead of keeping the list of visited tracepoint ,it can keep the list of remained tracepoints
    private void assignTracepointToQuerypoint(Tracepoint tpl) {
        String tracePointName = null;
//        List<Querypoint> querypoints = debugModel.getTracePoints();
//        List<String> visitedTracePointNames = getVisitedTracePointNames();
//        for (Querypoint querypoint : querypoints)
//        {
//            if (!visitedTracePointNames.contains(querypoint.getName()))
//            {
//                if (querypoint.getTraceQueryName().equals(tpl.getTraceQueryName()))
//                {
//                    if (querypoint.getLastAssignedTracePointLog() == null)
//                    {
//                        if (querypoint.getIndex() == tpl.getIndex())
//                        {
//                            tracePointName = querypoint.getName();
//                            break;
//                        }
//
//                    }else //if it is fixed
//                    {
//                        if (querypoint.getIndex() >=0 && querypoint.getLastAssignedTracePointLog().getIndex() == tpl.getIndex())
//                        {
//                            tracePointName = querypoint.getName();
//                            break;
//                        }
//                    }
//                }
//            }
//        }
        updateTracePoinLogTracePoint(tpl, tracePointName);
//        checkForDependentQuerypoints();

    }


    public void updateTracePoinLogTracePoint(Tracepoint tpl, String tracePointName)
    {
        if (tpl == null || tracePointName == null)
            return;
//        tpl.setTracePointName(tracePointName);
//        tracePointName_tracePointLog.put(tpl.getTracePointName(), tpl);
//        visitedTracePoints.add(tpl.getTracePointName());
//
//        debugModel.getTracePoint(tracePointName).setLastAssignedTracePointLog(tpl);
//
//        checkMutltiPointConstraintContaintsTracePoint(tpl.getTracePointName());
//        checkForDependentQuerypoints(tpl.getTracePointName());

//        if (tpl.getQuerypointName() != null)
//        {
//            log.info("... adds new Querypoint to RepositoryRuntime : " + tpl);
//        }
    }

    //todo check the correctness of this method carefully (mainly its recursive nature)
    private List<Tracepoint> checkForDependentQuerypoints(String tracePointName) {
//        List<Querypoint> querypoints = debugModel.getNegativeTracePointsDefinedByTracePoint(tracePointName);
//        if (querypoints == null)
//            return null;
//        List<Tracepoint> tracepoints = new ArrayList();
//        for (Querypoint querypoint : querypoints)
//        {
//            Tracepoint tpl = getTracePointLog(querypoint.getTraceQueryName(), querypoint.getIndex());
//            if (tpl != null)
//            {
//                updateTracePoinLogTracePoint(tpl, querypoint.getName());
//            }
//        }
//        return tracepoints;
        return null;
    }

    private void checkMutltiPointConstraintContaintsTracePoint(String tracePointName)
    {
//        for (String traceQueryName : traceQueryName_likely_tracePointLogs.keySet())
//        {
//            TraceQuery traceQuery = debugModel.getTraceQuery(traceQueryName);
//            for (int i=0 ; i<traceQuery.getMultipointConstraints().size() ; i++)
//            {
//                ConstraintMultipoint constraintMultipoint = traceQuery.getMultipointConstraints().get(i);
//                if (constraintMultipoint.getObjectTrace1().startsWith(tracePointName+"(")
//                   || constraintMultipoint.getObjectTrace2().startsWith(tracePointName+"("))
//                {
//                    List<Tracepoint> tracepoints = traceQueryName_likely_tracePointLogs.get(traceQueryName);
//
//                    List<Tracepoint> toDelete = new ArrayList();
//                    for (Tracepoint tracepoint : tracepoints)
//                    {
//                        if (tracepoint.getRemainedMultipointConstraintsToCheck().contains(i))
//                        {
//                            if (tracepoint.getTraceObjectLog(constraintMultipoint.getObjectTrace1()).getObjectId()
//                               == debugModel.getTracePoint(tracePointName).getLastAssignedTracePointLog()
//                                    .getTraceObjectLog(constraintMultipoint.getObjectTrace2()).getObjectId())
//                            {
//                                tracepoint.removeFromRemaindConstraints(i);
//                                if (tracepoint.getRemainedMultipointConstraintsToCheck().size() == 0)
//                                {
//                                    toDelete.add(tracepoint);
//                                    tracepoint.setTraceQueryName(traceQueryName);
//                                    tracepoint.setIndex(traceQueryName_tracePointLogs.get(traceQueryName).size());
//                                    traceQueryName_tracePointLogs.get(traceQueryName).add(tracepoint);
//                                    assignTracepointToQuerypoint(tracepoint);
//                                }
//                            }else
//                            {
//                                toDelete.add(tracepoint);
//                            }
//                        }
//                    }
//                    tracepoints.removeAll(toDelete);
//
//                }
//            }
//
//        }
    }



    public List<String> getVisitedTracePointNames() {
        return visitedTracePoints;
    }

    public Map<String, Tracepoint> getVisitedTracePoints() {
//        return tracePointName_tracePointLog;
        return null;
    }

    public List<Tracepoint> getVisitedTracePointsSortedByTime(){
//        List<Tracepoint> list = new ArrayList();
//        for (String tracePointName : visitedTracePoints)
//        {
//             list.add(tracePointName_tracePointLog.get(tracePointName));
//        }
//        Collections.sort(list, new Comparator<Tracepoint>(){
//            public int compare(Tracepoint o1, Tracepoint o2) {
//                if (o1.getJvmTime() > o2.getJvmTime())
//                    return +1;
//                if (o1.getJvmTime() < o2.getJvmTime())
//                    return -1;
//                if (o1.getJvmTime() == o2.getJvmTime())
//                {
//                    if (o1.getAddedTime() > o2.getAddedTime())
//                        return +1;
//                    if (o1.getAddedTime() < o2.getAddedTime())
//                        return -1;
//                }
//                return 0;
//            }
//        });
//        return list;
        return null;
    }

    public List<Tracepoint> getAllTracePointLogs()
    {
//        return tracepoints;
        return null;
    }
    public List<Tracepoint> getTracePointLogs(String traceQueryName)
    {
//        //todo isn't it needed to create a new list
//        List<Tracepoint> tracepoints = traceQueryName_tracePointLogs.get(traceQueryName);
//        return tracepoints;
        return null;
    }


    public List<Tracepoint> getLikelyTracePointLogs(String traceQueryName)
    {
//        return traceQueryName_likely_tracePointLogs.get(traceQueryName);
        return null;
    }


    //it supports negative indices
    public Tracepoint getTracePointLog(String traceQueryName, int index) {
//        List<Tracepoint> tpls = traceQueryName_tracePointLogs.get(traceQueryName);
//        if (tpls == null)
//            return null;
//        if (index >= 0 && index < tpls.size())
//            return tpls.get(index);
//        if (index < 0 && (index >= -(tpls.size())))
//        {
//            return tpls.get(tpls.size()+index);
//        }
        return null;
    }

    //todo it should be checked that no more tracequery result would be available
    //returns a negative number otherwise 0
    public int getNegativeIndex(Tracepoint tpl) {
//        if (tpl.getTraceQueryName() == null)
//            return 0;
//        String endPoint = null;
//        if (debugModel.getTraceQuery(tpl.getTraceQueryName()).getBasicTraceQuery().getConstraintTraceQuery().getBeforethread()!= null)
//                endPoint = debugModel.getTraceQuery(tpl.getTraceQueryName()).getBasicTraceQuery().getConstraintTraceQuery().getBeforethread().getData0();
//        if (!visitedTracePoints.contains(endPoint))
//            return 0;
//        int size = traceQueryName_tracePointLogs.get(tpl.getTraceQueryName()).size();
//        return -size+tpl.getIndex();
        return 0;
    }
}
