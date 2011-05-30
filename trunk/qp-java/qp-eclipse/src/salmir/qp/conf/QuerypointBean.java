package salmir.qp.conf;


public class QuerypointBean {

    String identifier;
    String description;

    String basicQuery = null;
    String checkPoint = null; //bsh
    String assertPoint = null;   //bsh
    String showPoint = null;   //bsh
    String pausePoint = null;   //bsh

    int index;
    //additional info
    //todo I have to keep the original query that defines this point, like: last change of variable x.

    public QuerypointBean(String identifier, String description, String query, String checkPoint, String assertPoint,
                         String pausePoint, String showPoint, int index) {
        this.identifier = identifier;
        this.description = description;
        this.basicQuery = query;
        this.checkPoint = checkPoint;
        this.assertPoint = assertPoint;
        this.pausePoint = pausePoint;
        this.showPoint = showPoint;
        this.index = index;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getAssertPoint() {
        return assertPoint;
    }

    public void setAssertPoint(String assertPoint) {
        this.assertPoint = assertPoint;
    }


    public String getCheckPoint() {
        return checkPoint;
    }

    public void setCheckPoint(String checkPoint) {
        this.checkPoint = checkPoint;
    }


    public String getPausePoint() {
        return pausePoint;
    }

    public void setPausePoint(String pausePoint) {
        this.pausePoint = pausePoint;
    }

    public String getBasicQuery() {
        return basicQuery;
    }

    public void setBasicQuery(String basicQuery) {
        this.basicQuery = basicQuery;
    }

    public String getShowPoint() {
        return showPoint;
    }

    public void setShowPoint(String showPoint) {
        this.showPoint = showPoint;
    }

}
