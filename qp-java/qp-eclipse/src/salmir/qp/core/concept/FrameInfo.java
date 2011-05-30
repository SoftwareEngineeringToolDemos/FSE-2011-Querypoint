package salmir.qp.core.concept;


public class FrameInfo
{
    String sourcePath;
    String methodName;
    Integer line;
    long codeIndex;


    public FrameInfo(String sourcePath, String methodName, Integer line, long codeIndex) {
        this.sourcePath = sourcePath;
        this.methodName = methodName;
        this.line = line;
        this.codeIndex = codeIndex;
    }

    public String getSourcePath() {
        return sourcePath;
    }

    public void setSourcePath(String sourcePath) {
        this.sourcePath = sourcePath;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public Integer getLine() {
        return line;
    }

    public void setLine(Integer line) {
        this.line = line;
    }

    public long getCodeIndex() {
        return codeIndex;
    }

    public void setCodeIndex(long codeIndex) {
        this.codeIndex = codeIndex;
    }

    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append(sourcePath).append(":").append(methodName).append("():").append(line)
                .append("-c(").append(codeIndex).append(")");
        return sb.toString();
    }
}
