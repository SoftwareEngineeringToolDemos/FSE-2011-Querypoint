package salmir.qp.core.concept;


public class Tracedata {
    int id;
    int traceObjectId;
    long objectId;
    String clazz;

    public Tracedata() {
    }

    public Tracedata(int id, int objectReferenceId) {
        this.id = id;
        this.traceObjectId = objectReferenceId;
    }


    public long getObjectId() {
        return objectId;
    }

    public void setObjectId(long objectId) {
        this.objectId = objectId;
    }

    public String getClazz() {
        return clazz;
    }

    public void setClazz(String clazz) {
        this.clazz = clazz;
    }

    public String toString()
    {
        return "ObjectId:" + objectId + " - Clazz:" + clazz;
    }
}
