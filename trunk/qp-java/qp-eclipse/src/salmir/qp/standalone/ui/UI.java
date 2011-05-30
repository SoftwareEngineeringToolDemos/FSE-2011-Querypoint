package salmir.qp.standalone.ui;

import salmir.qp.core.concept.Tracepoint;
import salmir.util.AppContext;
import salmir.qp.standalone.view.View;
import salmir.util.concurrent.AsynchronousMessageChannel;
import salmir.util.concurrent.Message;

import javax.swing.*;
import java.awt.event.*;


public class UI {

    public static String ID = "UI";

    private static UI instance;
    AsynchronousMessageChannel asynchronousMessageChannel;

    public static UI getInstance() {
        if (instance == null) {
            instance = new UI();
        }
        return instance;
    }

    public UI() {
        asynchronousMessageChannel = AppContext.getAsyncChannel();
        UIComponents.getInstance();
    }

    public void show() {
        Runnable runnable = new Runnable() {
            public void run() {
                UIComponents.getInstance().createAndShow();
            }
        };
        // it is suggested that all interaction with swing is done in event-dispatcher thread
        SwingUtilities.invokeLater(runnable);

    }

    public void showExitPrompt(){
        Object[] options = {"yes", "no"};
        int answer = JOptionPane.showOptionDialog(
                (JFrame) UIComponents.getComponent(UIComponents.MAINFRAME),
                "Do you want to exit the debugger?", //
                "",
                JOptionPane.YES_NO_OPTION,
                JOptionPane.QUESTION_MESSAGE,
                null,
                options,
                options[1]);

        if (answer == JOptionPane.YES_OPTION) {
            dispatchEvent(new UIEvent(UIEvents.EVENT_EXIT, null));
        }

    }

    public void showQueryForm(){
        Runnable runnable = new Runnable() {
            public void run() {
                ((FormTraceQuery)(UIComponents.getComponent(UIComponents.FORM_TRACEQUERY))).setVisible(true);
            }
        };
        SwingUtilities.invokeLater(runnable);
    }

    private void showPopup(final int x, final int y) {
        Runnable runnable = new Runnable(){
            public void run(){
                final TraceUI traceUI = (TraceUI)UIComponents.getComponent(UIComponents.TRACE_UI);
                final Tracepoint tpl = traceUI.getTracepoint(x, y);
                JPopupMenu popup = new JPopupMenu();
//                if (tpl != null) {
                    JMenuItem menuItem = new JMenuItem("Print Info");
                    menuItem.addActionListener(new ActionListener() {
                        public void actionPerformed(ActionEvent e) {
                            //todo append is thread safe but this call can be done in another way
                            ((JTextArea) UIComponents.getComponent(UIComponents.LOG_AREA)).setText("");
//                    ((JTextArea) GUIComponents.getComponent(GUIComponents.LOG_AREA)).append(
//                            "\n--------------------------------------------------------------\n");
                            ((JTextArea) UIComponents.getComponent(UIComponents.LOG_AREA)).append(tpl.toString());
                        }
                    });
//            menuItem.addActionListener(this);
                    popup.add(menuItem);

//                    if (tpl.getTraceQueryName() != null && tpl.getQuerypointName() == null) {
//                        menuItem = new JMenuItem("Define a new point : " + tpl.getTraceQueryName() + "[" + tpl.getIndex() + "]");
//                        menuItem.addActionListener(new ActionListener() {
//                            public void actionPerformed(ActionEvent e) {
//                                Map<String, Object> props = new HashMap();
//                                props.put("Querypointdef", new QuerypointDef(tpl.getTraceQueryName() + "[" + tpl.getIndex() + "]"
//                                        , "", tpl.getTraceQueryName(), tpl.getIndex()));
//                                AppContext.getAsyncChannel().sendAsyncMessage(VIEW.ID, new Message("swing",
//                                        new ViewEvent(ViewActions.ACTION_ADD_POINT, e, props)));
//                            }
//                        });
//                        popup.add(menuItem);


                       // final int negativeIndex = AppContext.getRepositoryRuntime().getCurrentExecution().getNegativeIndex(tpl);
//                        int negativeIndex = 0;
//                        if (negativeIndex < 0) {
//                            menuItem = new JMenuItem("Define a new point : " + tpl.getTraceQueryName() + "[" + negativeIndex + "]");
//                            menuItem.addActionListener(new ActionListener() {
//                                public void actionPerformed(ActionEvent e) {
//                                    Map<String, Object> props = new HashMap();
//                                    props.put("Querypointdef", new QuerypointDef(tpl.getTraceQueryName() + "[" + negativeIndex + "]"
//                                            , "", tpl.getTraceQueryName(), negativeIndex));
//                                    AppContext.getAsyncChannel().sendAsyncMessage(VIEW.ID, new Message("swing",
//                                            new ViewEvent(ControllerActions.ACTION_ADD_POINT, e, props)));
//                                }
//                            });
//                            popup.add(menuItem);
//                        }
//                    }
//                }else{
//                    JMenuItem menuItem = new JCheckBoxMenuItem("Show Query Results", traceUI.isShowQueryResults());
//                    menuItem.addItemListener(new ItemListener() {
//
//                        public void itemStateChanged(ItemEvent e) {
//                            traceUI.setShowQueryResults(((JCheckBoxMenuItem)e.getItemSelectable()).getState());
//                        }
//                    });
//                    popup.add(menuItem);
//
//                    menuItem = new JCheckBoxMenuItem("Show Partial Query Results", traceUI.isShowPartialQueryResults());
//                    menuItem.addItemListener(new ItemListener() {
//
//                        public void itemStateChanged(ItemEvent e) {
//                            traceUI.setShowPartialQueryResults(((JCheckBoxMenuItem)e.getItemSelectable()).getState());
//                        }
//                    });
//                    popup.add(menuItem);
//                }

//                if (e.isPopupTrigger()) {
//                    popup.show(e.getComponent(),
//                            e.getX(), e.getY());
//                }
            }
        };
        SwingUtilities.invokeLater(runnable);
    }

    public void zoomTraceUI(int zoom){
        TraceUI traceUI = (TraceUI)UIComponents.getComponent(UIComponents.TRACE_UI);
        traceUI.zoom(zoom);
    }

    public void repaintTraceUI(){
        TraceUI traceUI = (TraceUI)UIComponents.getComponent(UIComponents.TRACE_UI);
        if (traceUI == null)
            return;
        if (!traceUI.isShowing() || traceUI.getSize().getWidth() == 0)
            return;
        traceUI.updateSize();
        traceUI.repaint();
    }


    public void dispatchEvent(UIEvent uiEvent) {
        if (uiEvent.getOriginalEvent() instanceof ActionEvent){
            ActionEvent e = (ActionEvent) uiEvent.getOriginalEvent();
            String newline = "\n";
            String s = ("Action event detected: "
                    + newline
                    + e.getActionCommand()
                    + newline
                    + e.paramString()
                    + newline
                    + "    Event source: " + e.getSource()
                    + newline);
            System.out.println(s);
        }
        asynchronousMessageChannel.sendAsyncMessage(View.ID,
                new Message(UI.ID, uiEvent));
    }

}
