// $ANTLR 3.1.1 C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g 2010-03-04 03:33:55

  package salmir.qp.query.grammar; 


import org.antlr.runtime.*;
import java.util.Stack;
import java.util.List;
import java.util.ArrayList;


import org.antlr.runtime.tree.*;

public class QueryParser extends Parser {
    public static final String[] tokenNames = new String[] {
        "<invalid>", "<EOR>", "<DOWN>", "<UP>", "STR", "WS", "'{'", "'}'"
    };
    public static final int T__7=7;
    public static final int EOF=-1;
    public static final int WS=5;
    public static final int STR=4;
    public static final int T__6=6;

    // delegates
    // delegators


        public QueryParser(TokenStream input) {
            this(input, new RecognizerSharedState());
        }
        public QueryParser(TokenStream input, RecognizerSharedState state) {
            super(input, state);
             
        }
        
    protected TreeAdaptor adaptor = new CommonTreeAdaptor();

    public void setTreeAdaptor(TreeAdaptor adaptor) {
        this.adaptor = adaptor;
    }
    public TreeAdaptor getTreeAdaptor() {
        return adaptor;
    }

    public String[] getTokenNames() { return QueryParser.tokenNames; }
    public String getGrammarFileName() { return "C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g"; }


        public static void main(String[] args) throws Exception {
            ANTLRInputStream input = new ANTLRInputStream(System.in);
    //        EventCLexer lexer = new EventCLexer(input);
      //      CommonTokenStream tokens = new CommonTokenStream(lexer);
        //    EventCParser parser = new EventCParser(tokens);
          //  EventCParser.eventC_return r = parser.eventC();
        }


    public static class query_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    // $ANTLR start "query"
    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:33:1: query : STR '{' ( ( query )+ | STR ) '}' ;
    public final QueryParser.query_return query() throws RecognitionException {
        QueryParser.query_return retval = new QueryParser.query_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token STR1=null;
        Token char_literal2=null;
        Token STR4=null;
        Token char_literal5=null;
        QueryParser.query_return query3 = null;


        CommonTree STR1_tree=null;
        CommonTree char_literal2_tree=null;
        CommonTree STR4_tree=null;
        CommonTree char_literal5_tree=null;

        try {
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:33:7: ( STR '{' ( ( query )+ | STR ) '}' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:33:10: STR '{' ( ( query )+ | STR ) '}'
            {
            root_0 = (CommonTree)adaptor.nil();

            STR1=(Token)match(input,STR,FOLLOW_STR_in_query69); 
            STR1_tree = (CommonTree)adaptor.create(STR1);
            root_0 = (CommonTree)adaptor.becomeRoot(STR1_tree, root_0);

            char_literal2=(Token)match(input,6,FOLLOW_6_in_query72); 
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:33:20: ( ( query )+ | STR )
            int alt2=2;
            int LA2_0 = input.LA(1);

            if ( (LA2_0==STR) ) {
                int LA2_1 = input.LA(2);

                if ( (LA2_1==6) ) {
                    alt2=1;
                }
                else if ( (LA2_1==7) ) {
                    alt2=2;
                }
                else {
                    NoViableAltException nvae =
                        new NoViableAltException("", 2, 1, input);

                    throw nvae;
                }
            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 2, 0, input);

                throw nvae;
            }
            switch (alt2) {
                case 1 :
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:33:21: ( query )+
                    {
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:33:21: ( query )+
                    int cnt1=0;
                    loop1:
                    do {
                        int alt1=2;
                        int LA1_0 = input.LA(1);

                        if ( (LA1_0==STR) ) {
                            alt1=1;
                        }


                        switch (alt1) {
                    	case 1 :
                    	    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:33:22: query
                    	    {
                    	    pushFollow(FOLLOW_query_in_query77);
                    	    query3=query();

                    	    state._fsp--;

                    	    adaptor.addChild(root_0, query3.getTree());

                    	    }
                    	    break;

                    	default :
                    	    if ( cnt1 >= 1 ) break loop1;
                                EarlyExitException eee =
                                    new EarlyExitException(1, input);
                                throw eee;
                        }
                        cnt1++;
                    } while (true);


                    }
                    break;
                case 2 :
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Query.g:33:30: STR
                    {
                    STR4=(Token)match(input,STR,FOLLOW_STR_in_query81); 
                    STR4_tree = (CommonTree)adaptor.create(STR4);
                    adaptor.addChild(root_0, STR4_tree);


                    }
                    break;

            }

            char_literal5=(Token)match(input,7,FOLLOW_7_in_query84); 

            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
    	retval.tree = (CommonTree)adaptor.errorNode(input, retval.start, input.LT(-1), re);

        }
        finally {
        }
        return retval;
    }
    // $ANTLR end "query"

    // Delegated rules


 

    public static final BitSet FOLLOW_STR_in_query69 = new BitSet(new long[]{0x0000000000000040L});
    public static final BitSet FOLLOW_6_in_query72 = new BitSet(new long[]{0x0000000000000010L});
    public static final BitSet FOLLOW_query_in_query77 = new BitSet(new long[]{0x0000000000000090L});
    public static final BitSet FOLLOW_STR_in_query81 = new BitSet(new long[]{0x0000000000000080L});
    public static final BitSet FOLLOW_7_in_query84 = new BitSet(new long[]{0x0000000000000002L});

}