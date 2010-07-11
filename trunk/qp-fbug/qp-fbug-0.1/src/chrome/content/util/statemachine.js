// This script should be loaded in QPFBUG.Classes object

with (QPFBUG.Lang){
with (QPFBUG.Classes){

    //--------------------------------- StateMachine --------------------------------
    // This object works like a state machine and is usually used for keeping
    // the state of an object or component.
    // A transition has a name, from and to values.
    this.StateMachine =
        function(){

            // []String states
            // String initial
            // [][3]String transitions
            this.Constructor = function(states, initial, transitions){
                var assert = QPFBUG.Lang.assert;
                // non of the values can be null
                assert(!states && !initial && !transitions);
                // the initial state should be one of the states.
                assert(states.indexOf(initial)!=-1);
                //[]String states: state names
                this.states = states;
                //String   initial: initial state name
                this.initial = initial;

                for (i = 0; i < transitions.length; i++) {
                    //both from and to states should be in the list of states
                    assert(states.indexOf(transitions[i][1]!=-1));
                    assert(states.indexOf(transitions[i][2])!=-1);
                    this.transitions[transitions[i][0]] = transitions[i];
                }

                //map<String,[3]String> transitions: all transitions
                this.transitions = transitions;
                //String: current state
                this.state = initial;
                //boolean: it is true if state machin is in transition
                this.inTransition = false;
                //String
                this.currentTransition = null;
                //long: last change time
                this.lastChangeTime = currentTimeMillis();
            };

            this.Constructor.prototype = {

                //String transition: transition name
                startTransit: function(transition)
                {
                    assert(this.transitions.indexOf(transition)!=-1);
                    assert(this.state == this.transitions[transition][1], this.state);
                    this.inTransition = true;
                    this.state = null;
                    this.currentTransition = transition;
                    this.lastChangeTime = currentTimeMillis();
                },

                endTransit: function()
                {
                    assert(inTransition);
                    this.state = this.transitions[this.currentTransition][2];
                    this.inTransition = false;
                    this.currentTransition = null;
                    this.lastChangeTime = currentTimeMillis();
                },

                doTransit : function(transition)
                {
                    this.startTransit(transition);
                    this.endTransit();
                },

                getState : function() {
                    return this.state;
                },

                isInTransition : function() {
                    return this.inTransition;
                },

                getLastChangeTime : function() {
                    return this.lastChangeTime;
                },

                isState : function(stateName) {
                    return (stateName == this.state);
                }
            };
            return Constructor;
        }();

}}


