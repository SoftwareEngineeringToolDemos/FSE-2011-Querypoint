package salmir.qp.core.concept;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Tracepoint {
    int id;
    String possibleTraceQueryName; //it cannot be null
    String traceQueryName; //it is not null if it is definitly a trace query result
    String querypointName; //it is not null if a trace point is assinged to it
    int possibleIndex; //indexof trace point in trace query resluts
    int index; //indexof trace point in trace query resluts
    List<Integer> remainedMultipointConstraintsToCheck = new ArrayList();

    Map<String, Tracedata> tracedataList = new HashMap();


    // additional data
    String threadName;
    int threadFrameCount;
    List<FrameInfo> frames = new ArrayList();

    long jvmTime;
    long addedTime;

    public Tracepoint(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPossibleTraceQueryName() {
        return possibleTraceQueryName;
    }

    public void setPossibleTraceQueryName(String possibleTraceQueryName) {
        this.possibleTraceQueryName = possibleTraceQueryName;
    }

    public String getTraceQueryName() {
        return traceQueryName;
    }

    public void setTraceQueryName(String traceQueryName) {
        this.traceQueryName = traceQueryName;
    }

    public String getQuerypointName() {
        return querypointName;
    }

    public void setQuerypointName(String querypointName) {
        this.querypointName = querypointName;
    }

    public int getPossibleIndex() {
        return possibleIndex;
    }

    public void setPossibleIndex(int possibleIndex) {
        this.possibleIndex = possibleIndex;
    }


    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getThreadName() {
        return threadName;
    }

    public void setThreadName(String threadName) {
        this.threadName = threadName;
    }

    public int getThreadFrameCount() {
        return threadFrameCount;
    }

    public void setThreadFrameCount(int threadFrameCount) {
        this.threadFrameCount = threadFrameCount;
    }

    public List<FrameInfo> getFrames() {
        return frames;
    }

    public void setFrames(List<FrameInfo> frames) {
        this.frames = frames;
    }

    public void addFrameInfo(String sourcePath, String methodName, int line, long codeIndex)
    {
        frames.add(new FrameInfo(sourcePath, methodName, line, codeIndex));
    }


    public List<Integer> getRemainedMultipointConstraintsToCheck() {
        return remainedMultipointConstraintsToCheck;
    }

    public void setRemainedMultipointConstraintsToCheck(List<Integer> remainedMultipointConstraintsToCheck) {
        this.remainedMultipointConstraintsToCheck = remainedMultipointConstraintsToCheck;
    }

    public void removeFromRemaindConstraints(Integer i) {
        remainedMultipointConstraintsToCheck.remove(i);
    }

    public void addTracedata(String name, Tracedata tracedata)
    {
        tracedataList.put(name, tracedata);
    }

    public Tracedata getTraceObjectLog(String name)
    {
        return tracedataList.get(name);
    }

    public long getJvmTime() {
        return jvmTime;
    }

    public void setJvmTime(long jvmTime) {
        this.jvmTime = jvmTime;
    }

    public long getAddedTime() {
        return addedTime;
    }

    public void setAddedTime(long addedTime) {
        this.addedTime = addedTime;
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append(id).append("--");
        sb.append(possibleTraceQueryName).append(":");
        sb.append(possibleIndex).append(":");
        sb.append(traceQueryName).append(":");
        sb.append(index).append(":");
        if (querypointName != null)
        {
            sb.append(querypointName);
        }
        else
        {
            sb.append("     ");
        }
        sb.append(";");
        sb.append(threadName).append(":").append(threadFrameCount);

        sb.append("\n");
        for (FrameInfo frame: frames)
        {
            sb.append(frame.toString());
            sb.append("\n");
        }

        sb.append("Time:" + jvmTime);
        sb.append("\n");
        sb.append("TraceObjectLogs:");
        sb.append("\n");
        for (String key : tracedataList.keySet())
        {
            sb.append(key).append(" : ").append(tracedataList.get(key));
            sb.append("\n");
        }
        return sb.toString();
    }


}
