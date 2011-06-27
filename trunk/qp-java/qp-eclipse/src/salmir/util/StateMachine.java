package salmir.util;

import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.HashMap;

//it is not thread-safe
//it is supposed all data passed to this object is valid
//It is the reason for all checks "assert" is used.

public class StateMachine {

  private Set<String> states = new HashSet<String>();
  //it is supposed that every transition only connects two states
  //sample: <start, {start, initialized, working}>
  private Map<String, String[]> transitions = new HashMap<String, String[]>();

  Object Owner;
  String initialState;
  String oldState;
  String state;

  boolean inTransition = false;
  String currentTransition = null;
  long lastChangeTime;


  public StateMachine(String[] stateNames, String initialStateName, String[][] transitionsData) {
      assert (stateNames != null);
      assert (initialStateName != null);
      assert (transitionsData != null);

      for (String state : stateNames) {
          states.add(state);
      }

      assert (states.contains(initialStateName));
      initialState = initialStateName;
                                              
      assert (transitionsData != null);

      for (int i = 0; i < transitionsData.length; i++) {
          //both states should be in the list of states
          assert (states.contains(transitionsData[i][1]));
          assert (states.contains(transitionsData[i][2]));

          transitions.put(transitionsData[i][0], transitionsData[i]);
      }

      this.oldState = null;
      state = initialState;
      lastChangeTime = System.currentTimeMillis();
  }

  public void startTransit(String transition) //throws Exception
  {
      assert (!inTransition): "The state machine is in transision: from '"
          					  + oldState + "' state by '" +currentTransition+"'";
      inTransition = true;
	  assert (transitions.containsKey(transition)): "The state machine does not contain this transition : " + transition;
      assert (state.equals(transitions.get(transition)[1])): "The from state of '" + transition + "' transition is not '" + state + "'";
      oldState = state;
      state = null;
      currentTransition = transition;
      lastChangeTime = System.currentTimeMillis();
  }

  public void endTransit() //throws Exception
  {
      assert (inTransition);
      state = transitions.get(currentTransition)[2];
      inTransition = false;
      currentTransition = null;
      lastChangeTime = System.currentTimeMillis();
  }

  public void doTransit(String transition)
  {
      startTransit(transition);
      endTransit();
  }

  public String getState() {
      return state;
  }

  public boolean isInTransition() {
      return inTransition;
  }

  public long getLastChangeTime() {
      return lastChangeTime;
  }

  public boolean isState(String stateName) {
      return stateName.equals(state); 
  }
}