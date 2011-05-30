package salmir.tmp;

import salmir.util.AppContext;
import salmir.qp.standalone.ui.UI;
import salmir.qp.standalone.view.View;
import salmir.util.concurrent.AsynchronousMessageChannel;

public class Test {
    public static void main(String[] args) {
        AppContext.set(AppContext.ASYNC_CHANNEL, new AsynchronousMessageChannel(50));
        View.getInstance().start();
        UI.getInstance().show();
//        UI.getInstance().showExitPrompt();
//        UI.getInstance().showPopup(10,10);
    }

}
