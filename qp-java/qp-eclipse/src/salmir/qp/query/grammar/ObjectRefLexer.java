// $ANTLR 3.1.1 C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g 2010-02-02 23:19:13

  package salmir.qp.query.grammar; 


import org.antlr.runtime.*;
import java.util.Stack;
import java.util.List;
import java.util.ArrayList;

public class ObjectRefLexer extends Lexer {
    public static final int POINTNAME=5;
    public static final int T__12=12;
    public static final int OBJECTREF=4;
    public static final int EOF=-1;
    public static final int WS=9;
    public static final int REFERENCE=7;
    public static final int T__10=10;
    public static final int STR=8;
    public static final int FRAME=6;
    public static final int T__11=11;

    // delegates
    // delegators

    public ObjectRefLexer() {;} 
    public ObjectRefLexer(CharStream input) {
        this(input, new RecognizerSharedState());
    }
    public ObjectRefLexer(CharStream input, RecognizerSharedState state) {
        super(input,state);

    }
    public String getGrammarFileName() { return "C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g"; }

    // $ANTLR start "OBJECTREF"
    public final void mOBJECTREF() throws RecognitionException {
        try {
            int _type = OBJECTREF;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:7:11: ( '{objectref}' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:7:13: '{objectref}'
            {
            match("{objectref}"); 


            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "OBJECTREF"

    // $ANTLR start "POINTNAME"
    public final void mPOINTNAME() throws RecognitionException {
        try {
            int _type = POINTNAME;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:8:11: ( '{pointname}' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:8:13: '{pointname}'
            {
            match("{pointname}"); 


            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "POINTNAME"

    // $ANTLR start "FRAME"
    public final void mFRAME() throws RecognitionException {
        try {
            int _type = FRAME;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:9:7: ( '{frame}' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:9:9: '{frame}'
            {
            match("{frame}"); 


            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "FRAME"

    // $ANTLR start "REFERENCE"
    public final void mREFERENCE() throws RecognitionException {
        try {
            int _type = REFERENCE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:10:11: ( '{reference}' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:10:13: '{reference}'
            {
            match("{reference}"); 


            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "REFERENCE"

    // $ANTLR start "T__10"
    public final void mT__10() throws RecognitionException {
        try {
            int _type = T__10;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:11:7: ( '(' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:11:9: '('
            {
            match('('); 

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "T__10"

    // $ANTLR start "T__11"
    public final void mT__11() throws RecognitionException {
        try {
            int _type = T__11;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:12:7: ( ')' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:12:9: ')'
            {
            match(')'); 

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "T__11"

    // $ANTLR start "T__12"
    public final void mT__12() throws RecognitionException {
        try {
            int _type = T__12;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:13:7: ( ':' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:13:9: ':'
            {
            match(':'); 

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "T__12"

    // $ANTLR start "WS"
    public final void mWS() throws RecognitionException {
        try {
            int _type = WS;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:57:5: ( ( ' ' | '\\r' | '\\t' | '\\u000C' | '\\n' ) )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:57:9: ( ' ' | '\\r' | '\\t' | '\\u000C' | '\\n' )
            {
            if ( (input.LA(1)>='\t' && input.LA(1)<='\n')||(input.LA(1)>='\f' && input.LA(1)<='\r')||input.LA(1)==' ' ) {
                input.consume();

            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                recover(mse);
                throw mse;}


                        skip();
                    

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "WS"

    // $ANTLR start "STR"
    public final void mSTR() throws RecognitionException {
        try {
            int _type = STR;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:71:4: ( (~ ( '(' | ')' | ':' ) )* )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:71:7: (~ ( '(' | ')' | ':' ) )*
            {
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:71:7: (~ ( '(' | ')' | ':' ) )*
            loop1:
            do {
                int alt1=2;
                int LA1_0 = input.LA(1);

                if ( ((LA1_0>='\u0000' && LA1_0<='\'')||(LA1_0>='*' && LA1_0<='9')||(LA1_0>=';' && LA1_0<='\uFFFF')) ) {
                    alt1=1;
                }


                switch (alt1) {
            	case 1 :
            	    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:71:7: ~ ( '(' | ')' | ':' )
            	    {
            	    if ( (input.LA(1)>='\u0000' && input.LA(1)<='\'')||(input.LA(1)>='*' && input.LA(1)<='9')||(input.LA(1)>=';' && input.LA(1)<='\uFFFF') ) {
            	        input.consume();

            	    }
            	    else {
            	        MismatchedSetException mse = new MismatchedSetException(null,input);
            	        recover(mse);
            	        throw mse;}


            	    }
            	    break;

            	default :
            	    break loop1;
                }
            } while (true);


            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "STR"

    public void mTokens() throws RecognitionException {
        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:8: ( OBJECTREF | POINTNAME | FRAME | REFERENCE | T__10 | T__11 | T__12 | WS | STR )
        int alt2=9;
        alt2 = dfa2.predict(input);
        switch (alt2) {
            case 1 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:10: OBJECTREF
                {
                mOBJECTREF(); 

                }
                break;
            case 2 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:20: POINTNAME
                {
                mPOINTNAME(); 

                }
                break;
            case 3 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:30: FRAME
                {
                mFRAME(); 

                }
                break;
            case 4 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:36: REFERENCE
                {
                mREFERENCE(); 

                }
                break;
            case 5 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:46: T__10
                {
                mT__10(); 

                }
                break;
            case 6 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:52: T__11
                {
                mT__11(); 

                }
                break;
            case 7 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:58: T__12
                {
                mT__12(); 

                }
                break;
            case 8 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:64: WS
                {
                mWS(); 

                }
                break;
            case 9 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:1:67: STR
                {
                mSTR(); 

                }
                break;

        }

    }


    protected DFA2 dfa2 = new DFA2(this);
    static final String DFA2_eotS =
        "\2\6\3\uffff\1\13\1\uffff\4\6\1\uffff\22\6\1\42\3\6\1\uffff\7\6"+
        "\1\55\1\56\1\57\3\uffff";
    static final String DFA2_eofS =
        "\60\uffff";
    static final String DFA2_minS =
        "\1\11\1\146\3\uffff\1\0\1\uffff\1\142\1\157\1\162\1\145\1\uffff"+
        "\1\152\1\151\1\141\1\146\1\145\1\156\1\155\1\145\1\143\1\164\1\145"+
        "\1\162\1\164\1\156\1\175\1\145\1\162\1\141\1\0\1\156\1\145\1\155"+
        "\1\uffff\1\143\1\146\2\145\3\175\3\0\3\uffff";
    static final String DFA2_maxS =
        "\1\173\1\162\3\uffff\1\uffff\1\uffff\1\142\1\157\1\162\1\145\1"+
        "\uffff\1\152\1\151\1\141\1\146\1\145\1\156\1\155\1\145\1\143\1\164"+
        "\1\145\1\162\1\164\1\156\1\175\1\145\1\162\1\141\1\uffff\1\156\1"+
        "\145\1\155\1\uffff\1\143\1\146\2\145\3\175\3\uffff\3\uffff";
    static final String DFA2_acceptS =
        "\2\uffff\1\5\1\6\1\7\1\uffff\1\11\4\uffff\1\10\26\uffff\1\3\12"+
        "\uffff\1\1\1\2\1\4";
    static final String DFA2_specialS =
        "\5\uffff\1\3\30\uffff\1\2\13\uffff\1\0\1\4\1\1\3\uffff}>";
    static final String[] DFA2_transitionS = {
            "\2\5\1\uffff\2\5\22\uffff\1\5\7\uffff\1\2\1\3\20\uffff\1\4"+
            "\100\uffff\1\1",
            "\1\11\10\uffff\1\7\1\10\1\uffff\1\12",
            "",
            "",
            "",
            "\50\6\2\uffff\20\6\1\uffff\uffc5\6",
            "",
            "\1\14",
            "\1\15",
            "\1\16",
            "\1\17",
            "",
            "\1\20",
            "\1\21",
            "\1\22",
            "\1\23",
            "\1\24",
            "\1\25",
            "\1\26",
            "\1\27",
            "\1\30",
            "\1\31",
            "\1\32",
            "\1\33",
            "\1\34",
            "\1\35",
            "\1\36",
            "\1\37",
            "\1\40",
            "\1\41",
            "\50\6\2\uffff\20\6\1\uffff\uffc5\6",
            "\1\43",
            "\1\44",
            "\1\45",
            "",
            "\1\46",
            "\1\47",
            "\1\50",
            "\1\51",
            "\1\52",
            "\1\53",
            "\1\54",
            "\50\6\2\uffff\20\6\1\uffff\uffc5\6",
            "\50\6\2\uffff\20\6\1\uffff\uffc5\6",
            "\50\6\2\uffff\20\6\1\uffff\uffc5\6",
            "",
            "",
            ""
    };

    static final short[] DFA2_eot = DFA.unpackEncodedString(DFA2_eotS);
    static final short[] DFA2_eof = DFA.unpackEncodedString(DFA2_eofS);
    static final char[] DFA2_min = DFA.unpackEncodedStringToUnsignedChars(DFA2_minS);
    static final char[] DFA2_max = DFA.unpackEncodedStringToUnsignedChars(DFA2_maxS);
    static final short[] DFA2_accept = DFA.unpackEncodedString(DFA2_acceptS);
    static final short[] DFA2_special = DFA.unpackEncodedString(DFA2_specialS);
    static final short[][] DFA2_transition;

    static {
        int numStates = DFA2_transitionS.length;
        DFA2_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA2_transition[i] = DFA.unpackEncodedString(DFA2_transitionS[i]);
        }
    }

    class DFA2 extends DFA {

        public DFA2(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 2;
            this.eot = DFA2_eot;
            this.eof = DFA2_eof;
            this.min = DFA2_min;
            this.max = DFA2_max;
            this.accept = DFA2_accept;
            this.special = DFA2_special;
            this.transition = DFA2_transition;
        }
        public String getDescription() {
            return "1:1: Tokens : ( OBJECTREF | POINTNAME | FRAME | REFERENCE | T__10 | T__11 | T__12 | WS | STR );";
        }
        public int specialStateTransition(int s, IntStream _input) throws NoViableAltException {
            IntStream input = _input;
        	int _s = s;
            switch ( s ) {
                    case 0 : 
                        int LA2_42 = input.LA(1);

                        s = -1;
                        if ( ((LA2_42>='\u0000' && LA2_42<='\'')||(LA2_42>='*' && LA2_42<='9')||(LA2_42>=';' && LA2_42<='\uFFFF')) ) {s = 6;}

                        else s = 45;

                        if ( s>=0 ) return s;
                        break;
                    case 1 : 
                        int LA2_44 = input.LA(1);

                        s = -1;
                        if ( ((LA2_44>='\u0000' && LA2_44<='\'')||(LA2_44>='*' && LA2_44<='9')||(LA2_44>=';' && LA2_44<='\uFFFF')) ) {s = 6;}

                        else s = 47;

                        if ( s>=0 ) return s;
                        break;
                    case 2 : 
                        int LA2_30 = input.LA(1);

                        s = -1;
                        if ( ((LA2_30>='\u0000' && LA2_30<='\'')||(LA2_30>='*' && LA2_30<='9')||(LA2_30>=';' && LA2_30<='\uFFFF')) ) {s = 6;}

                        else s = 34;

                        if ( s>=0 ) return s;
                        break;
                    case 3 : 
                        int LA2_5 = input.LA(1);

                        s = -1;
                        if ( ((LA2_5>='\u0000' && LA2_5<='\'')||(LA2_5>='*' && LA2_5<='9')||(LA2_5>=';' && LA2_5<='\uFFFF')) ) {s = 6;}

                        else s = 11;

                        if ( s>=0 ) return s;
                        break;
                    case 4 : 
                        int LA2_43 = input.LA(1);

                        s = -1;
                        if ( ((LA2_43>='\u0000' && LA2_43<='\'')||(LA2_43>='*' && LA2_43<='9')||(LA2_43>=';' && LA2_43<='\uFFFF')) ) {s = 6;}

                        else s = 46;

                        if ( s>=0 ) return s;
                        break;
            }
            NoViableAltException nvae =
                new NoViableAltException(getDescription(), 2, _s, input);
            error(nvae);
            throw nvae;
        }
    }
 

}