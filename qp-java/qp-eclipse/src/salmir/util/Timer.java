package salmir.util;

//It is not thread-safe
public class Timer {

    public static class State {
        public static final String NOT_STARTED = "not_started";
        public static final String WORKING = "working";
        public static final String PAUSED = "paused";
    }

    public static class Transition{
        public static final String START = "start";
        public static final String PAUSE = "pause";
        public static final String RESUME = "resume";
        public static final String RESET = "reset";
    }

    public static final String[] ALL_STATES = {State.NOT_STARTED, State.PAUSED, State.WORKING};
    public static final String[][] ALL_TRANSITIONS = new String[][]{
            {Transition.START, State.NOT_STARTED, State.WORKING},
            {Transition.PAUSE, State.WORKING, State.PAUSED},
            {Transition.RESUME, State.PAUSED, State.WORKING},
            {Transition.RESET, State.PAUSED, State.NOT_STARTED},
    };
    private StateMachine stateMachine;

    private long startTime;
    private long lastStartTime;
    private long lastPauseTime;
    private long recordedTime; //TODO define a default value for recordedTime or throw an exception if Timeer is not started.


    public Timer() {
        stateMachine = new StateMachine(ALL_STATES, State.NOT_STARTED, ALL_TRANSITIONS);
    }

    public void start() {
        stateMachine.startTransit(Transition.START);

        startTime = System.currentTimeMillis();
        lastStartTime = System.currentTimeMillis();

        stateMachine.endTransit();
    }

    public void reset() {
        stateMachine.startTransit(Transition.RESET);
        lastStartTime = 0;
        lastPauseTime = 0;
        recordedTime = 0;
        stateMachine.endTransit();
    }

    public void pause() {
        stateMachine.startTransit(Transition.PAUSE);

        lastPauseTime = System.currentTimeMillis();
        recordedTime += lastPauseTime - lastStartTime;

        stateMachine.endTransit();
    }

    public void resume() {
        stateMachine.startTransit(Transition.RESUME);

        lastStartTime = System.currentTimeMillis();

        stateMachine.endTransit();
    }


    public long getRecordedTime() {
        if (State.PAUSED.equals(stateMachine.getState()))
            return recordedTime;
        else
            return recordedTime + (System.currentTimeMillis() - lastStartTime);
    }

    public long getWholeTime(){
        return System.currentTimeMillis() - startTime;
    }

    public long getPassedTime() {
        return System.currentTimeMillis() - startTime;
    }
}
