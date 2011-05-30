// $ANTLR 3.1.1 C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g 2010-03-04 03:33:55

  package salmir.qp.query.grammar; 


import org.antlr.runtime.*;
import java.util.Stack;
import java.util.List;
import java.util.ArrayList;

public class QueryLexer extends Lexer {
    public static final int T__7=7;
    public static final int EOF=-1;
    public static final int WS=5;
    public static final int STR=4;
    public static final int T__6=6;

    // delegates
    // delegators

    public QueryLexer() {;} 
    public QueryLexer(CharStream input) {
        this(input, new RecognizerSharedState());
    }
    public QueryLexer(CharStream input, RecognizerSharedState state) {
        super(input,state);

    }
    public String getGrammarFileName() { return "C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g"; }

    // $ANTLR start "T__6"
    public final void mT__6() throws RecognitionException {
        try {
            int _type = T__6;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:7:6: ( '{' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:7:8: '{'
            {
            match('{'); 

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "T__6"

    // $ANTLR start "T__7"
    public final void mT__7() throws RecognitionException {
        try {
            int _type = T__7;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:8:6: ( '}' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:8:8: '}'
            {
            match('}'); 

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }
    // $ANTLR end "T__7"

    // $ANTLR start "WS"
    public final void mWS() throws RecognitionException {
        try {
            int _type = WS;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:43:5: ( ( ' ' | '\\r' | '\\t' | '\\u000C' | '\\n' ) )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:43:9: ( ' ' | '\\r' | '\\t' | '\\u000C' | '\\n' )
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
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:57:4: ( (~ ( '{' | '}' ) )* )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:57:7: (~ ( '{' | '}' ) )*
            {
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:57:7: (~ ( '{' | '}' ) )*
            loop1:
            do {
                int alt1=2;
                int LA1_0 = input.LA(1);

                if ( ((LA1_0>='\u0000' && LA1_0<='z')||LA1_0=='|'||(LA1_0>='~' && LA1_0<='\uFFFF')) ) {
                    alt1=1;
                }


                switch (alt1) {
            	case 1 :
            	    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:57:7: ~ ( '{' | '}' )
            	    {
            	    if ( (input.LA(1)>='\u0000' && input.LA(1)<='z')||input.LA(1)=='|'||(input.LA(1)>='~' && input.LA(1)<='\uFFFF') ) {
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
        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:1:8: ( T__6 | T__7 | WS | STR )
        int alt2=4;
        switch ( input.LA(1) ) {
        case '{':
            {
            alt2=1;
            }
            break;
        case '}':
            {
            alt2=2;
            }
            break;
        case '\t':
        case '\n':
        case '\f':
        case '\r':
        case ' ':
            {
            int LA2_3 = input.LA(2);

            if ( ((LA2_3>='\u0000' && LA2_3<='z')||LA2_3=='|'||(LA2_3>='~' && LA2_3<='\uFFFF')) ) {
                alt2=4;
            }
            else {
                alt2=3;}
            }
            break;
        default:
            alt2=4;}

        switch (alt2) {
            case 1 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:1:10: T__6
                {
                mT__6(); 

                }
                break;
            case 2 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:1:15: T__7
                {
                mT__7(); 

                }
                break;
            case 3 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:1:20: WS
                {
                mWS(); 

                }
                break;
            case 4 :
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:1:23: STR
                {
                mSTR(); 

                }
                break;

        }

    }


 

}