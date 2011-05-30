// $ANTLR 3.1.1 C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g 2010-02-02 23:19:12

  package salmir.qp.query.grammar; 


import org.antlr.runtime.*;
import java.util.Stack;
import java.util.List;
import java.util.ArrayList;


import org.antlr.runtime.tree.*;

public class ObjectRefParser extends Parser {
    public static final String[] tokenNames = new String[] {
        "<invalid>", "<EOR>", "<DOWN>", "<UP>", "OBJECTREF", "POINTNAME", "FRAME", "REFERENCE", "STR", "WS", "'('", "')'", "':'"
    };
    public static final int POINTNAME=5;
    public static final int T__12=12;
    public static final int OBJECTREF=4;
    public static final int WS=9;
    public static final int EOF=-1;
    public static final int REFERENCE=7;
    public static final int T__10=10;
    public static final int STR=8;
    public static final int FRAME=6;
    public static final int T__11=11;

    // delegates
    // delegators


        public ObjectRefParser(TokenStream input) {
            this(input, new RecognizerSharedState());
        }
        public ObjectRefParser(TokenStream input, RecognizerSharedState state) {
            super(input, state);
             
        }
        
    protected TreeAdaptor adaptor = new CommonTreeAdaptor();

    public void setTreeAdaptor(TreeAdaptor adaptor) {
        this.adaptor = adaptor;
    }
    public TreeAdaptor getTreeAdaptor() {
        return adaptor;
    }

    public String[] getTokenNames() { return ObjectRefParser.tokenNames; }
    public String getGrammarFileName() { return "C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g"; }


        public static void main(String[] args) throws Exception {
            ANTLRInputStream input = new ANTLRInputStream(System.in);

        }


    public static class objectref_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    // $ANTLR start "objectref"
    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:46:1: objectref : STR '(' STR ')' ':' STR -> ^( OBJECTREF ^( POINTNAME STR ) ^( FRAME STR ) ^( REFERENCE STR ) ) ;
    public final ObjectRefParser.objectref_return objectref() throws RecognitionException {
        ObjectRefParser.objectref_return retval = new ObjectRefParser.objectref_return();
        retval.start = input.LT(1);
        int objectref_StartIndex = input.index();
        CommonTree root_0 = null;

        Token STR1=null;
        Token char_literal2=null;
        Token STR3=null;
        Token char_literal4=null;
        Token char_literal5=null;
        Token STR6=null;

        CommonTree STR1_tree=null;
        CommonTree char_literal2_tree=null;
        CommonTree STR3_tree=null;
        CommonTree char_literal4_tree=null;
        CommonTree char_literal5_tree=null;
        CommonTree STR6_tree=null;
        RewriteRuleTokenStream stream_10=new RewriteRuleTokenStream(adaptor,"token 10");
        RewriteRuleTokenStream stream_STR=new RewriteRuleTokenStream(adaptor,"token STR");
        RewriteRuleTokenStream stream_11=new RewriteRuleTokenStream(adaptor,"token 11");
        RewriteRuleTokenStream stream_12=new RewriteRuleTokenStream(adaptor,"token 12");

        try {
            if ( state.backtracking>0 && alreadyParsedRule(input, 1) ) { return retval; }
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:46:11: ( STR '(' STR ')' ':' STR -> ^( OBJECTREF ^( POINTNAME STR ) ^( FRAME STR ) ^( REFERENCE STR ) ) )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:46:14: STR '(' STR ')' ':' STR
            {
            STR1=(Token)match(input,STR,FOLLOW_STR_in_objectref147);  
            stream_STR.add(STR1);

            char_literal2=(Token)match(input,10,FOLLOW_10_in_objectref149);  
            stream_10.add(char_literal2);

            STR3=(Token)match(input,STR,FOLLOW_STR_in_objectref151);  
            stream_STR.add(STR3);

            char_literal4=(Token)match(input,11,FOLLOW_11_in_objectref153);  
            stream_11.add(char_literal4);

            char_literal5=(Token)match(input,12,FOLLOW_12_in_objectref155);  
            stream_12.add(char_literal5);

            STR6=(Token)match(input,STR,FOLLOW_STR_in_objectref157);  
            stream_STR.add(STR6);



            // AST REWRITE
            // elements: STR, STR, STR
            // token labels: 
            // rule labels: retval
            // token list labels: 
            // rule list labels: 
            retval.tree = root_0;
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"token retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            // 47:10: -> ^( OBJECTREF ^( POINTNAME STR ) ^( FRAME STR ) ^( REFERENCE STR ) )
            {
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:47:13: ^( OBJECTREF ^( POINTNAME STR ) ^( FRAME STR ) ^( REFERENCE STR ) )
                {
                CommonTree root_1 = (CommonTree)adaptor.nil();
                root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(OBJECTREF, "OBJECTREF"), root_1);

                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:47:25: ^( POINTNAME STR )
                {
                CommonTree root_2 = (CommonTree)adaptor.nil();
                root_2 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(POINTNAME, "POINTNAME"), root_2);

                adaptor.addChild(root_2, stream_STR.nextNode());

                adaptor.addChild(root_1, root_2);
                }
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:47:42: ^( FRAME STR )
                {
                CommonTree root_2 = (CommonTree)adaptor.nil();
                root_2 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(FRAME, "FRAME"), root_2);

                adaptor.addChild(root_2, stream_STR.nextNode());

                adaptor.addChild(root_1, root_2);
                }
                // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\ObjectRef.g:47:55: ^( REFERENCE STR )
                {
                CommonTree root_2 = (CommonTree)adaptor.nil();
                root_2 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(REFERENCE, "REFERENCE"), root_2);

                adaptor.addChild(root_2, stream_STR.nextNode());

                adaptor.addChild(root_1, root_2);
                }

                adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;
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
    // $ANTLR end "objectref"

    // Delegated rules


 

    public static final BitSet FOLLOW_STR_in_objectref147 = new BitSet(new long[]{0x0000000000000400L});
    public static final BitSet FOLLOW_10_in_objectref149 = new BitSet(new long[]{0x0000000000000100L});
    public static final BitSet FOLLOW_STR_in_objectref151 = new BitSet(new long[]{0x0000000000000800L});
    public static final BitSet FOLLOW_11_in_objectref153 = new BitSet(new long[]{0x0000000000001000L});
    public static final BitSet FOLLOW_12_in_objectref155 = new BitSet(new long[]{0x0000000000000100L});
    public static final BitSet FOLLOW_STR_in_objectref157 = new BitSet(new long[]{0x0000000000000002L});

}