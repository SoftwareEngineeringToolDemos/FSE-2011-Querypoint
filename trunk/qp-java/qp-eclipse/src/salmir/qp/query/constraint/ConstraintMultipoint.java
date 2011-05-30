package salmir.qp.query.constraint;

//todo for the moment there is only one multipoint conditino which checks equality of two objects in different points
//, later you should redesign and generalize it.
public class ConstraintMultipoint {
    String objectTrace1;
    String objectTrace2;

    public ConstraintMultipoint(String objectTrace1, String objectTrace2) {
        this.objectTrace1 = objectTrace1;
        this.objectTrace2 = objectTrace2;
    }


    public String getObjectTrace1() {
        return objectTrace1;
    }

    public void setObjectTrace1(String objectTrace1) {
        this.objectTrace1 = objectTrace1;
    }

    public String getObjectTrace2() {
        return objectTrace2;
    }

    public void setObjectTrace2(String objectTrace2) {
        this.objectTrace2 = objectTrace2;
    }
}


