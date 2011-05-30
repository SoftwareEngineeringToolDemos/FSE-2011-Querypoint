package salmir.util.concurrent;

import salmir.util.StateMachine;

public abstract class ManageableThread extends Thread {

    private static class State {
        public final static String NOT_INITIALIZED = "not_initialized";
        public final static String INITIALIZED = "initialized";
        public final static String WORKING = "working";
        public final static String PAUSED = "paused";
        public final static String TERMINATED = "terminated";
    }

    private static class Transition{
        public final static String INIT = "init";
        public final static String START = "start";
        public final static String PAUSE = "pause";
        public final static String RESUME = "resume";
        public final static String TERMINATE = "terminated";
    }

    public final static String[] ALL_STATES = new String[]{
        State.NOT_INITIALIZED, State.INITIALIZED, State.WORKING,
        State.PAUSED, State.TERMINATED
    };

    public final static String[][] ALL_TRANSITIONS = new String[][]{
        {Transition.INIT, State.NOT_INITIALIZED, State.INITIALIZED},
        {Transition.START, State.INITIALIZED, State.WORKING},
        {Transition.PAUSE, State.WORKING, State.PAUSED},
        {Transition.RESUME, State.PAUSED, State.WORKING},
        {Transition.TERMINATE, State.PAUSED, State.TERMINATED}
    };

    protected volatile boolean paused = false;
    protected volatile boolean end = false;
    protected StateMachine threadState;

    protected ManageableThread(String name) {
        super(name);
        threadState = new StateMachine(ALL_STATES, State.NOT_INITIALIZED, ALL_TRANSITIONS);
    }

    public void run() {
        threadState.startTransit(Transition.INIT);
        init();
        threadState.endTransit();

        threadState.doTransit(Transition.START);
        while (!end) {
            while (paused && !end) {
                try {
                    sleep(100);
                } catch (InterruptedException e) {
                    // a document about interrupted Exception
                    // http://www.ibm.com/developerworks/java/library/j-jtp05236.html
                    Thread.currentThread().interrupt(); //to preserve interrupted info for thread
                }
            }
            try {
                process();
            } catch (RuntimeException e) //to catch all unexpected exceptions
            {
                //todo analyze the exception and appropriately manage it.
                e.printStackTrace();
            }
        }

        threadState.startTransit(Transition.TERMINATE);
        terminate();
        threadState.endTransit();
    }

    public synchronized void pause() {
        threadState.startTransit(Transition.PAUSE);
        paused = true;
        interrupt();
        notify();
        threadState.endTransit();
    }

    // "resume" already used in Thread class so we use another name.
    public synchronized void unpause() {
        threadState.startTransit(Transition.RESUME);
        paused = false;
        interrupt();
        notify();
        threadState.endTransit();
    }

    public synchronized void end() {
        end = true;
        interrupt();
        notify();
    }

    public StateMachine getThreadState(){
        return threadState;
    }

    public abstract void init();

    public abstract void process();

    public abstract void terminate();

}
