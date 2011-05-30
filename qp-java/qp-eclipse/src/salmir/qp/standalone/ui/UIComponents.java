package salmir.qp.standalone.ui;


import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseListener;
import java.awt.event.MouseWheelListener;
import java.awt.event.WindowListener;
import java.util.HashMap;

public class UIComponents {

    static UIComponents instance;

    public static int LOG_AREA = 0;
    public static int MAINFRAME = 1;
    public static int BASIC_QUERY_AREA = 2;
    public static int DYNAMIC_QUERY_AREA = 3;
    public static int FORM_TRACEQUERY = 4;
    public static int TRACE_UI = 5;
    static HashMap<Integer, Object> components = new HashMap();

    JFrame mainFrame;

    JPanel panelMain;
    JPanel panelButtons;

    JScrollPane scrollTraceLine;
    JScrollPane scrollLogger;

    JButton buttonStart;
    JButton buttonPause;
    JButton buttonReRun;
    JButton buttonPrint;

    JButton buttonQuery;

    JTextArea logArea;

    FormTraceQuery formTraceQuery;

    TraceUI traceUI;

    public static UIComponents getInstance() {
        if (instance == null) {
            instance = new UIComponents();
        }
        return instance;
    }

    public UIComponents() {
    }

    public void createAndShow() {
        buildComponents();
        mainFrame.setVisible(true);
    }

    private void buildComponents() {
        makeMainFrame();

        setComponent(MAINFRAME, mainFrame);
        setComponent(LOG_AREA, logArea);

        formTraceQuery = new FormTraceQuery(mainFrame);
        setComponent(FORM_TRACEQUERY, formTraceQuery);
        setComponent(TRACE_UI, traceUI);

    }

    private void makeMainFrame() {
        mainFrame = new JFrame(" Querypoint Debugger");
        makePanelMain();
        Dimension dimention = Toolkit.getDefaultToolkit().getScreenSize();

        mainFrame.setResizable(false);
        mainFrame.add(panelMain);
        mainFrame.pack(); // to set sub component sizes to their preferred sizes

        //set frame location
        int x = (int) (dimention.getWidth() - mainFrame.getSize().getWidth()) / 2;
        int y = (int) (dimention.getHeight() - mainFrame.getSize().getHeight()) / 2;
        mainFrame.setLocation(x, y);

        mainFrame.setDefaultCloseOperation(WindowConstants.DO_NOTHING_ON_CLOSE);
        mainFrame.addWindowListener((WindowListener) UIEvents.getListener(UIEvents.EVENT_EXIT_PROMPT));

    }

    private void makePanelMain() {
        //todo, is it better to put these lines in init()  method
        panelMain = new JPanel();

        makePanelButtons();
        makeScrollTraceLine();
        makeScrollLogger();

        panelMain.setLayout(new BorderLayout());
        panelMain.add(panelButtons, BorderLayout.PAGE_START);

        JSplitPane splitPane = new JSplitPane(JSplitPane.VERTICAL_SPLIT,
                scrollTraceLine, scrollLogger);
        splitPane.setOneTouchExpandable(true);

        panelMain.add(splitPane);

    }

    private void makePanelButtons() {
        panelButtons = new JPanel();
        buttonStart = new JButton((Action) UIEvents.getListener(UIEvents.EVENT_START));
        buttonPause = new JButton((Action) UIEvents.getListener(UIEvents.EVENT_PAUSE));
        buttonReRun = new JButton((Action) UIEvents.getListener(UIEvents.EVENT_RERUN));
        buttonPrint = new JButton((Action) UIEvents.getListener(UIEvents.EVENT_PRINT));
        buttonQuery = new JButton((Action) UIEvents.getListener(UIEvents.EVENT_QUERY_FORM));

        panelButtons.add(buttonStart);
        panelButtons.add(buttonPause);
        panelButtons.add(buttonReRun);
        panelButtons.add(buttonPrint);
        panelButtons.add(buttonQuery);
    }


    private void makeScrollTraceLine() {
        traceUI = new TraceUI();
        MouseListener popupListener = (MouseListener) UIEvents.getListener(UIEvents.EVENT_TRACE_POPUP);
        traceUI.addMouseListener(popupListener);
        MouseWheelListener zoomListener = (MouseWheelListener) UIEvents.getListener(UIEvents.EVENT_TRACE_ZOOM);
        traceUI.addMouseWheelListener(zoomListener);
//        traceUI.addMouseMotionListener(mouseAdapter);
        scrollTraceLine = new JScrollPane(traceUI);
//        scrollTraceLine.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_NEVER);

    }

    private void makeScrollLogger() {
        logArea = new JTextArea();
        logArea.setColumns(70);
        logArea.setRows(20);
        scrollLogger = new JScrollPane(logArea);
    }


    public static Object getComponent(int id) {
        return components.get(id);
    }

    //todo who has the right to set a component
    public static void setComponent(int id, Object component) {
        components.put(id, component);
    }
}
