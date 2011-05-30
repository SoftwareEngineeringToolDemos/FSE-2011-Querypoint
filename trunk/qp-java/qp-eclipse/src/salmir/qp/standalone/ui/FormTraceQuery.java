package salmir.qp.standalone.ui;

import salmir.qp.conf.QuerypointBean;

import javax.swing.*;

import java.awt.*;


public class FormTraceQuery {

    JPanel panelTop;
    JPanel panelMiddle;
    JPanel panelBottom;



    JDialog dialogQuery;
    JTextField nameArea;
    JTextArea basicQueryArea;
    JTextArea dynamicQueryArea;


    public FormTraceQuery(JFrame mainFrame) {

        //todo mainFrame should not be null
        assert (mainFrame != null);

        dialogQuery = new JDialog(mainFrame, "Add Query");

        //panelTop
        panelTop = new JPanel();
        panelTop.setLayout(new GridBagLayout());

        panelTop.add(new JLabel("Name : "), getGridBagConstraints(0, 0));

        nameArea = new JTextField();
        nameArea.setEditable(true);
        nameArea.setColumns(50);
        panelTop.add(nameArea);

        dialogQuery.add(panelTop, BorderLayout.NORTH);

        //panelMiddle
        panelMiddle = new JPanel();
        panelMiddle.setLayout(new GridBagLayout());
        panelMiddle.add(new JLabel("Basic Query : "), getGridBagConstraints(0, 0));

        basicQueryArea = new JTextArea();
        basicQueryArea.setEditable(true);
        basicQueryArea.setColumns(50);
        basicQueryArea.setRows(2);

        JScrollPane scroll = new JScrollPane(basicQueryArea);
        panelMiddle.add(scroll, getGridBagConstraints(1, 0));

        panelMiddle.add(new JLabel("Conditions Script : "), getGridBagConstraints(0, 1));
        dynamicQueryArea = new JTextArea();
        dynamicQueryArea.setEditable(true);
        dynamicQueryArea.setColumns(50);
        dynamicQueryArea.setRows(4);

        JScrollPane scroll2 = new JScrollPane(dynamicQueryArea);
        panelMiddle.add(scroll2, getGridBagConstraints(1, 1));

        dialogQuery.add(panelMiddle, BorderLayout.CENTER);

        panelBottom = new JPanel();
        panelBottom.add(new JButton((Action) UIEvents.getListener(UIEvents.EVENT_ADD_QUERY)));

        dialogQuery.add(panelBottom, BorderLayout.SOUTH);
        dialogQuery.pack();

        dialogQuery.setLocationRelativeTo(mainFrame);
        dialogQuery.setModal(true);
//        dialogQuery.setDefaultCloseOperation(WindowConstants.DO_NOTHING_ON_CLOSE);

    }

    public GridBagConstraints getGridBagConstraints(int x, int y) {
        GridBagConstraints c;
        c = new GridBagConstraints();
        c.gridx = x;
        c.gridwidth = 1;
        c.gridy = y;
        c.fill = GridBagConstraints.HORIZONTAL;
        return c;
//        c.anchor = GridBagConstraints.CENTER;
//        c.fill = GridBagConstraints.HORIZONTAL;
//        c.ipady = 0;       //reset to default
//        c.weighty = 1.0;   //request any extra vertical space
//        c.anchor = GridBagConstraints.PAGE_END; //bottom of space
//        c.insets = new Insets(0,0,0,0);  //top padding
    }

    public QuerypointBean getQuerypointBean() {
        String name = nameArea.getText();
        String basicQuery = basicQueryArea.getText();
        String dynamicQuery = dynamicQueryArea.getText();
        QuerypointBean querypointBean = new QuerypointBean(name, "", basicQuery, dynamicQuery, null, null, null, -1);
        return querypointBean;
    }

    public void setVisible(boolean visible) {
        dialogQuery.pack();
        dialogQuery.setVisible(visible);
    }
}
