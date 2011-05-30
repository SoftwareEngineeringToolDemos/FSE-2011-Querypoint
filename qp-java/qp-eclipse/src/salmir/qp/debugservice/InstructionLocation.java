package salmir.qp.debugservice;

public class InstructionLocation {

    String className;
    int line;
    long codeIndex;


    public InstructionLocation(String className, int index) {
        this.className = className;
        this.line = index;
    }


    public InstructionLocation(String className, int line, long codeIndex) {
        this.className = className;
        this.line = line;
        this.codeIndex = codeIndex;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public int getLine() {
        return line;
    }

    public void setLine(int line) {
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
        sb.append(className).append(":").append(line).append(":").append(codeIndex);
        return sb.toString();
    }
}
