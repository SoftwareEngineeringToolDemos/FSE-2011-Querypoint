package salmir.qp.standalone.ui;

import salmir.qp.core.IDebugSession;
import salmir.qp.core.concept.Tracepoint;
import salmir.qp.engine.Engine;

import static java.awt.Color.*;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseEvent;
import java.awt.geom.Arc2D;
import java.awt.geom.Rectangle2D;
import java.awt.geom.Line2D;
import java.awt.geom.Point2D;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

// The methods of this class shlould only be called by Swing Thread
// Different types of swing listners can directly call these class methods because they
//    are executed in Swing Thread. 
// View is responsible to call repaint which asks Swing Thread to call paint

public class TraceUI extends JPanel {

    public Thread thread;
    public long sleepAmount = 1000;
    private int w, h;
    private BufferedImage bimg;
    private Graphics2D big;
    private Font font = new Font("Times New Roman", Font.PLAIN, 10);
    private Runtime r = Runtime.getRuntime();
    private int columnInc;
    private int pts[];
    private int ptNum;
    private int ascent, descent;
    private Rectangle graphOutlineRect = new Rectangle();
    private Rectangle2D mfRect = new Rectangle2D.Float();
    private Rectangle2D muRect = new Rectangle2D.Float();
    private Line2D graphLine = new Line2D.Float();
    private Color graphColor = new Color(46, 139, 87);
    private Color mfColor = new Color(0, 100, 0);
    private String usedStr;
    private int oneSecondLength = 10;
    boolean showQueryResults = true;
    boolean showPartialQueryResults = true;

    private int lineLength = 0;
    Dimension prefSize = new Dimension(750, 180);
    Map<Point2D, Tracepoint> shapes;


    public TraceUI() {
        setBackground(WHITE);
        setToolTipText("Trace UIComponents");
    }

    public Dimension getMinimumSize() {
        return getPreferredSize();
    }

    public Dimension getMaximumSize() {
        return getPreferredSize();
    }

    public void setPreferredSize(Dimension d) {
        prefSize = d;
    }

    public Dimension getPreferredSize() {
        return prefSize;
    }

    public void updateSize() {

        IDebugSession debugSession = Engine.getInstance().getDebugSession();
        if (debugSession != null && debugSession.isReproductionAlive()) {
            long passedTime = debugSession.getReproductionLifeTime();
            lineLength = (int) (passedTime / 1000 * oneSecondLength) + 10 * 10; //AppContext.getRepositoryRuntime().getCurrentExecution().getAllTracepoints().size();

            w = Math.max(750, lineLength + 20);
            h = 180;

            bimg = (BufferedImage) createImage(w, h);
            big = bimg.createGraphics();
            big.setFont(font);
            FontMetrics fm = big.getFontMetrics(font);
            ascent = (int) fm.getAscent();
            descent = (int) fm.getDescent();
            setPreferredSize(new Dimension(w, h));
            //it is called to update container scrollpane
            revalidate();
        }
    }


    public void paint(Graphics g) {

        if (big == null) {
            return;
        }

        big.setBackground(getBackground());
        big.clearRect(0, 0, w, h);


        // .. Draw allocated and used strings ..
        big.setColor(GREEN);

        IDebugSession debugSession = Engine.getInstance().getDebugSession();
        if (debugSession != null) {// && (debugSession.isAlive()) {
            long passedTime = debugSession.getReproductionLifeTime();
            usedStr = "passedTime: " + passedTime / 1000 + " s";
            big.drawString(usedStr, 4, h - descent);

            // Calculate remaining size
            float ssH = ascent + descent;
            float remainingHeight = (float) (h - (ssH * 2) - 0.5f);
            float remainingWidth = (float) (w - 20);

            // .. Draw History Graph ..
            int graphX = 10;
            int graphH = (int) remainingHeight;

            big.setColor(Color.RED);
            String status;
            if (debugSession.isReproductionAlive()) {
                if (debugSession.isReproductionPaused())
                    status = "||";
                else

                    status = ">>";
            } else {
                status = "[]";
            }
            big.drawString(status, graphX - 8, graphH);


            big.setColor(graphColor);
            graphLine.setLine(graphX, graphH, lineLength + 10, graphH);
            big.draw(graphLine);

            shapes = new HashMap();

            // draw points
            java.util.List<Tracepoint> list = new ArrayList();// AppContext.getRepositoryRuntime().getCurrentExecution().getAllTracepoints();

            int adjustValue = 0;
            int lastPlace = 0;
            int lastR = 5;
            for (int i = 0; i < list.size(); i++) {

                Tracepoint tpl = list.get(i);

                if (tpl.getQuerypointName() == null && !showQueryResults)
                    continue;
                if (tpl.getTraceQueryName() == null && !showPartialQueryResults)
                    continue;

                big.setColor(getColor(tpl));

                int r = 4;
                int h = 40;
                if (tpl.getQuerypointName() != null) {
                    r = 10;
                    h = 80;
                }

                long time = tpl.getJvmTime();
                int place = (int) ((time / 1000) * oneSecondLength) + 10;
                if (place + adjustValue <= lastPlace + lastR + r) {
                    adjustValue = lastR + r - (place - lastPlace);
                }
                place += adjustValue;

                graphLine.setLine(place, graphH, place, graphH - h);
                big.draw(graphLine);

                Arc2D graphArc = new Arc2D.Float();

                graphArc.setArc(place - r, graphH - h - r, 2 * r, 2 * r, 0, 360, Arc2D.OPEN);
                shapes.put(new Point2D.Double(place, graphH - h), tpl);
                big.draw(graphArc);
                big.fill(graphArc);

                String pointName = tpl.getQuerypointName();
                if (pointName != null) {
                    int width = big.getFontMetrics().stringWidth(pointName);
                    big.drawString(pointName, place - width / 2, ascent);
                }

                lastPlace = place;
                lastR = r;
            }

            // draw query results
        }
        g.drawImage(bimg, 0, 0, this);
    }

    public void zoom(int value) {
        if (value > 0 && oneSecondLength >= 100)
            return;
//        System.out.println("Value : "+value);
        int newValue = oneSecondLength;
        newValue += Math.ceil(newValue * (value * .05));

        newValue = Math.min(100, newValue);
        newValue = Math.max(1, newValue);
        oneSecondLength = newValue;
//        System.out.println("OneSecondLength : " + oneSecondLength);
    }

    //todo change this method
    public Tracepoint getTracepoint(int x, int y) {
//        if (shapes == null)
//            return null;
//        for (Point2D point2D : shapes.keySet()) {
//            Tracepoint tp = shapes.get(point2D);
//            long time = tp.getJvmTime();
//            double distance = Point2D.distance(x, y, point2D.getX(), point2D.getY());
//            if (tp.getQuerypointName() != null && distance <= 10) {
//                return tp;
//            }
//            if (tp.getQuerypointName() == null && distance <= 4) {
//                return tp;
//            }
//        }
        return null;
    }

    private Color getColor(Tracepoint tpl) {
        int value = 0;
//        int value = AppContext.getRepositoryRuntime().getDebugModel().
//                getTraceQuery(tpl.getPossibleTraceQueryName()).getId();
//        int colorValue = value - 5 * (value / 5);
//        Color color;
//        switch (colorValue) {
//            case 0:
//                color = Color.blue;
//                break;
//            case 1:
//                color = Color.green;
//                break;
//            case 2:
//                color = Color.orange;
//                break;
//            case 3:
//                color = Color.red;
//                break;
//            case 4:
//                color = Color.pink;
//                break;
//            default:
//                color = Color.black;
//        }
//
//        if (tpl.getTraceQueryName() == null)
//            return color.brighter().brighter();
//        return color.darker();
        return Color.black;
    }

    public String getToolTipText(MouseEvent e) {
//        Tracepoint tp = getTracepoint(e.getX(), e.getY());
//        if (tp != null) {
//            String qpName = tp.getQuerypointName();
//            if (qpName != null)
//                return qpName;
//            return tp.getPossibleTraceQueryName() + "[" + tp.getIndex() + "]";
//        }
        return "Trace UIComponents";
    }


    public boolean isShowQueryResults() {
        return showQueryResults;
    }

    public void setShowQueryResults(boolean showQueryResults) {
        this.showQueryResults = showQueryResults;
    }

    public boolean isShowPartialQueryResults() {
        return showPartialQueryResults;
    }

    public void setShowPartialQueryResults(boolean showPartialQueryResults) {
        this.showPartialQueryResults = showPartialQueryResults;
    }
}