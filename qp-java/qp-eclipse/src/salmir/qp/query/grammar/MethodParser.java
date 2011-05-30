// $ANTLR 3.1.1 C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g 2010-02-02 21:39:52

  package salmir.qp.query.grammar;


import org.antlr.runtime.*;
import java.util.Stack;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

import org.antlr.runtime.tree.*;

public class MethodParser extends Parser {
    public static final String[] tokenNames = new String[] {
        "<invalid>", "<EOR>", "<DOWN>", "<UP>", "METHOD", "NAME", "MODIFIERS", "RETURNTYPE", "IDENTIFIERPATTERN", "WS", "IdentifierStart", "IdentifierPart", "SurrogateIdentifer", "'void'", "'['", "']'", "'.'", "'boolean'", "'char'", "'byte'", "'short'", "'int'", "'long'", "'float'", "'double'", "'public'", "'protected'", "'private'", "'static'", "'abstract'", "'final'", "'native'", "'synchronized'", "'transient'", "'volatile'", "'strictfp'"
    };
    public static final int IdentifierPart=11;
    public static final int T__35=35;
    public static final int T__28=28;
    public static final int T__23=23;
    public static final int IDENTIFIERPATTERN=8;
    public static final int T__20=20;
    public static final int WS=9;
    public static final int T__13=13;
    public static final int METHOD=4;
    public static final int T__21=21;
    public static final int T__19=19;
    public static final int T__33=33;
    public static final int T__14=14;
    public static final int T__22=22;
    public static final int T__29=29;
    public static final int T__30=30;
    public static final int MODIFIERS=6;
    public static final int T__17=17;
    public static final int IdentifierStart=10;
    public static final int T__31=31;
    public static final int EOF=-1;
    public static final int T__27=27;
    public static final int T__32=32;
    public static final int T__16=16;
    public static final int T__24=24;
    public static final int T__26=26;
    public static final int T__25=25;
    public static final int NAME=5;
    public static final int T__34=34;
    public static final int T__18=18;
    public static final int SurrogateIdentifer=12;
    public static final int RETURNTYPE=7;
    public static final int T__15=15;

    // delegates
    // delegators


        public MethodParser(TokenStream input) {
            this(input, new RecognizerSharedState());
        }
        public MethodParser(TokenStream input, RecognizerSharedState state) {
            super(input, state);
            this.state.ruleMemo = new HashMap[31+1];
             
             
        }
        
    protected TreeAdaptor adaptor = new CommonTreeAdaptor();

    public void setTreeAdaptor(TreeAdaptor adaptor) {
        this.adaptor = adaptor;
    }
    public TreeAdaptor getTreeAdaptor() {
        return adaptor;
    }

    public String[] getTokenNames() { return MethodParser.tokenNames; }
    public String getGrammarFileName() { return "C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g"; }


        public static void main(String[] args) throws Exception {
            ANTLRInputStream input = new ANTLRInputStream(System.in);

        }


    public static class method_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    // $ANTLR start "method"
    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:43:1: method : ( ( modifiers )? IDENTIFIERPATTERN -> ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( NAME IDENTIFIERPATTERN ) ) | ( modifiers )? ( type | 'void' ) IDENTIFIERPATTERN -> ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( RETURNTYPE ^( NAME ( type )? ( 'void' )? ) ) ^( NAME IDENTIFIERPATTERN ) ) );
    public final MethodParser.method_return method() throws RecognitionException {
        MethodParser.method_return retval = new MethodParser.method_return();
        retval.start = input.LT(1);
        int method_StartIndex = input.index();
        CommonTree root_0 = null;

        Token IDENTIFIERPATTERN2=null;
        Token string_literal5=null;
        Token IDENTIFIERPATTERN6=null;
        MethodParser.modifiers_return modifiers1 = null;

        MethodParser.modifiers_return modifiers3 = null;

        MethodParser.type_return type4 = null;


        CommonTree IDENTIFIERPATTERN2_tree=null;
        CommonTree string_literal5_tree=null;
        CommonTree IDENTIFIERPATTERN6_tree=null;
        RewriteRuleTokenStream stream_13=new RewriteRuleTokenStream(adaptor,"token 13");
        RewriteRuleTokenStream stream_IDENTIFIERPATTERN=new RewriteRuleTokenStream(adaptor,"token IDENTIFIERPATTERN");
        RewriteRuleSubtreeStream stream_type=new RewriteRuleSubtreeStream(adaptor,"rule type");
        RewriteRuleSubtreeStream stream_modifiers=new RewriteRuleSubtreeStream(adaptor,"rule modifiers");
        try {
            if ( state.backtracking>0 && alreadyParsedRule(input, 1) ) { return retval; }
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:44:5: ( ( modifiers )? IDENTIFIERPATTERN -> ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( NAME IDENTIFIERPATTERN ) ) | ( modifiers )? ( type | 'void' ) IDENTIFIERPATTERN -> ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( RETURNTYPE ^( NAME ( type )? ( 'void' )? ) ) ^( NAME IDENTIFIERPATTERN ) ) )
            int alt4=2;
            alt4 = dfa4.predict(input);
            switch (alt4) {
                case 1 :
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:46:9: ( modifiers )? IDENTIFIERPATTERN
                    {
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:46:9: ( modifiers )?
                    int alt1=2;
                    int LA1_0 = input.LA(1);

                    if ( ((LA1_0>=25 && LA1_0<=35)) ) {
                        alt1=1;
                    }
                    else if ( (LA1_0==IDENTIFIERPATTERN) ) {
                        int LA1_2 = input.LA(2);

                        if ( (synpred1_Method()) ) {
                            alt1=1;
                        }
                    }
                    switch (alt1) {
                        case 1 :
                            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:0:0: modifiers
                            {
                            pushFollow(FOLLOW_modifiers_in_method159);
                            modifiers1=modifiers();

                            state._fsp--;
                            if (state.failed) return retval;
                            if ( state.backtracking==0 ) stream_modifiers.add(modifiers1.getTree());

                            }
                            break;

                    }

                    IDENTIFIERPATTERN2=(Token)match(input,IDENTIFIERPATTERN,FOLLOW_IDENTIFIERPATTERN_in_method170); if (state.failed) return retval; 
                    if ( state.backtracking==0 ) stream_IDENTIFIERPATTERN.add(IDENTIFIERPATTERN2);



                    // AST REWRITE
                    // elements: modifiers, IDENTIFIERPATTERN
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( state.backtracking==0 ) {
                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    // 48:10: -> ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( NAME IDENTIFIERPATTERN ) )
                    {
                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:48:13: ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( NAME IDENTIFIERPATTERN ) )
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(METHOD, "METHOD"), root_1);

                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:48:22: ^( MODIFIERS ( modifiers )? )
                        {
                        CommonTree root_2 = (CommonTree)adaptor.nil();
                        root_2 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(MODIFIERS, "MODIFIERS"), root_2);

                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:48:34: ( modifiers )?
                        if ( stream_modifiers.hasNext() ) {
                            adaptor.addChild(root_2, stream_modifiers.nextTree());

                        }
                        stream_modifiers.reset();

                        adaptor.addChild(root_1, root_2);
                        }
                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:48:46: ^( NAME IDENTIFIERPATTERN )
                        {
                        CommonTree root_2 = (CommonTree)adaptor.nil();
                        root_2 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(NAME, "NAME"), root_2);

                        adaptor.addChild(root_2, stream_IDENTIFIERPATTERN.nextNode());

                        adaptor.addChild(root_1, root_2);
                        }

                        adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}
                    }
                    break;
                case 2 :
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:49:9: ( modifiers )? ( type | 'void' ) IDENTIFIERPATTERN
                    {
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:49:9: ( modifiers )?
                    int alt2=2;
                    switch ( input.LA(1) ) {
                        case 25:
                        case 26:
                        case 27:
                        case 28:
                        case 29:
                        case 30:
                        case 31:
                        case 32:
                        case 33:
                        case 34:
                        case 35:
                            {
                            alt2=1;
                            }
                            break;
                        case IDENTIFIERPATTERN:
                            {
                            int LA2_2 = input.LA(2);

                            if ( (synpred3_Method()) ) {
                                alt2=1;
                            }
                            }
                            break;
                        case 17:
                        case 18:
                        case 19:
                        case 20:
                        case 21:
                        case 22:
                        case 23:
                        case 24:
                            {
                            int LA2_3 = input.LA(2);

                            if ( (synpred3_Method()) ) {
                                alt2=1;
                            }
                            }
                            break;
                        case 13:
                            {
                            int LA2_4 = input.LA(2);

                            if ( (synpred3_Method()) ) {
                                alt2=1;
                            }
                            }
                            break;
                    }

                    switch (alt2) {
                        case 1 :
                            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:0:0: modifiers
                            {
                            pushFollow(FOLLOW_modifiers_in_method208);
                            modifiers3=modifiers();

                            state._fsp--;
                            if (state.failed) return retval;
                            if ( state.backtracking==0 ) stream_modifiers.add(modifiers3.getTree());

                            }
                            break;

                    }

                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:50:9: ( type | 'void' )
                    int alt3=2;
                    int LA3_0 = input.LA(1);

                    if ( (LA3_0==IDENTIFIERPATTERN||(LA3_0>=17 && LA3_0<=24)) ) {
                        alt3=1;
                    }
                    else if ( (LA3_0==13) ) {
                        alt3=2;
                    }
                    else {
                        if (state.backtracking>0) {state.failed=true; return retval;}
                        NoViableAltException nvae =
                            new NoViableAltException("", 3, 0, input);

                        throw nvae;
                    }
                    switch (alt3) {
                        case 1 :
                            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:50:10: type
                            {
                            pushFollow(FOLLOW_type_in_method220);
                            type4=type();

                            state._fsp--;
                            if (state.failed) return retval;
                            if ( state.backtracking==0 ) stream_type.add(type4.getTree());

                            }
                            break;
                        case 2 :
                            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:51:13: 'void'
                            {
                            string_literal5=(Token)match(input,13,FOLLOW_13_in_method234); if (state.failed) return retval; 
                            if ( state.backtracking==0 ) stream_13.add(string_literal5);


                            }
                            break;

                    }

                    IDENTIFIERPATTERN6=(Token)match(input,IDENTIFIERPATTERN,FOLLOW_IDENTIFIERPATTERN_in_method254); if (state.failed) return retval; 
                    if ( state.backtracking==0 ) stream_IDENTIFIERPATTERN.add(IDENTIFIERPATTERN6);



                    // AST REWRITE
                    // elements: type, modifiers, IDENTIFIERPATTERN, 13
                    // token labels: 
                    // rule labels: retval
                    // token list labels: 
                    // rule list labels: 
                    if ( state.backtracking==0 ) {
                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"token retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    // 53:27: -> ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( RETURNTYPE ^( NAME ( type )? ( 'void' )? ) ) ^( NAME IDENTIFIERPATTERN ) )
                    {
                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:53:30: ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( RETURNTYPE ^( NAME ( type )? ( 'void' )? ) ) ^( NAME IDENTIFIERPATTERN ) )
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(METHOD, "METHOD"), root_1);

                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:53:39: ^( MODIFIERS ( modifiers )? )
                        {
                        CommonTree root_2 = (CommonTree)adaptor.nil();
                        root_2 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(MODIFIERS, "MODIFIERS"), root_2);

                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:53:51: ( modifiers )?
                        if ( stream_modifiers.hasNext() ) {
                            adaptor.addChild(root_2, stream_modifiers.nextTree());

                        }
                        stream_modifiers.reset();

                        adaptor.addChild(root_1, root_2);
                        }
                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:53:63: ^( RETURNTYPE ^( NAME ( type )? ( 'void' )? ) )
                        {
                        CommonTree root_2 = (CommonTree)adaptor.nil();
                        root_2 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(RETURNTYPE, "RETURNTYPE"), root_2);

                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:53:76: ^( NAME ( type )? ( 'void' )? )
                        {
                        CommonTree root_3 = (CommonTree)adaptor.nil();
                        root_3 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(NAME, "NAME"), root_3);

                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:53:83: ( type )?
                        if ( stream_type.hasNext() ) {
                            adaptor.addChild(root_3, stream_type.nextTree());

                        }
                        stream_type.reset();
                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:53:89: ( 'void' )?
                        if ( stream_13.hasNext() ) {
                            adaptor.addChild(root_3, stream_13.nextNode());

                        }
                        stream_13.reset();

                        adaptor.addChild(root_2, root_3);
                        }

                        adaptor.addChild(root_1, root_2);
                        }
                        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:53:99: ^( NAME IDENTIFIERPATTERN )
                        {
                        CommonTree root_2 = (CommonTree)adaptor.nil();
                        root_2 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(NAME, "NAME"), root_2);

                        adaptor.addChild(root_2, stream_IDENTIFIERPATTERN.nextNode());

                        adaptor.addChild(root_1, root_2);
                        }

                        adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;}
                    }
                    break;

            }
            retval.stop = input.LT(-1);

            if ( state.backtracking==0 ) {

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
    	retval.tree = (CommonTree)adaptor.errorNode(input, retval.start, input.LT(-1), re);

        }
        finally {
            if ( state.backtracking>0 ) { memoize(input, 1, method_StartIndex); }
        }
        return retval;
    }
    // $ANTLR end "method"

    public static class type_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    // $ANTLR start "type"
    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:57:1: type : ( classOrInterfaceType ( '[' ']' )* | primitiveType ( '[' ']' )* );
    public final MethodParser.type_return type() throws RecognitionException {
        MethodParser.type_return retval = new MethodParser.type_return();
        retval.start = input.LT(1);
        int type_StartIndex = input.index();
        CommonTree root_0 = null;

        Token char_literal8=null;
        Token char_literal9=null;
        Token char_literal11=null;
        Token char_literal12=null;
        MethodParser.classOrInterfaceType_return classOrInterfaceType7 = null;

        MethodParser.primitiveType_return primitiveType10 = null;


        CommonTree char_literal8_tree=null;
        CommonTree char_literal9_tree=null;
        CommonTree char_literal11_tree=null;
        CommonTree char_literal12_tree=null;

        try {
            if ( state.backtracking>0 && alreadyParsedRule(input, 2) ) { return retval; }
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:58:5: ( classOrInterfaceType ( '[' ']' )* | primitiveType ( '[' ']' )* )
            int alt7=2;
            int LA7_0 = input.LA(1);

            if ( (LA7_0==IDENTIFIERPATTERN) ) {
                alt7=1;
            }
            else if ( ((LA7_0>=17 && LA7_0<=24)) ) {
                alt7=2;
            }
            else {
                if (state.backtracking>0) {state.failed=true; return retval;}
                NoViableAltException nvae =
                    new NoViableAltException("", 7, 0, input);

                throw nvae;
            }
            switch (alt7) {
                case 1 :
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:58:9: classOrInterfaceType ( '[' ']' )*
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_classOrInterfaceType_in_type308);
                    classOrInterfaceType7=classOrInterfaceType();

                    state._fsp--;
                    if (state.failed) return retval;
                    if ( state.backtracking==0 ) adaptor.addChild(root_0, classOrInterfaceType7.getTree());
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:59:9: ( '[' ']' )*
                    loop5:
                    do {
                        int alt5=2;
                        int LA5_0 = input.LA(1);

                        if ( (LA5_0==14) ) {
                            alt5=1;
                        }


                        switch (alt5) {
                    	case 1 :
                    	    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:59:10: '[' ']'
                    	    {
                    	    char_literal8=(Token)match(input,14,FOLLOW_14_in_type319); if (state.failed) return retval;
                    	    if ( state.backtracking==0 ) {
                    	    char_literal8_tree = (CommonTree)adaptor.create(char_literal8);
                    	    adaptor.addChild(root_0, char_literal8_tree);
                    	    }
                    	    char_literal9=(Token)match(input,15,FOLLOW_15_in_type321); if (state.failed) return retval;
                    	    if ( state.backtracking==0 ) {
                    	    char_literal9_tree = (CommonTree)adaptor.create(char_literal9);
                    	    adaptor.addChild(root_0, char_literal9_tree);
                    	    }

                    	    }
                    	    break;

                    	default :
                    	    break loop5;
                        }
                    } while (true);


                    }
                    break;
                case 2 :
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:60:9: primitiveType ( '[' ']' )*
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_primitiveType_in_type333);
                    primitiveType10=primitiveType();

                    state._fsp--;
                    if (state.failed) return retval;
                    if ( state.backtracking==0 ) adaptor.addChild(root_0, primitiveType10.getTree());
                    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:61:9: ( '[' ']' )*
                    loop6:
                    do {
                        int alt6=2;
                        int LA6_0 = input.LA(1);

                        if ( (LA6_0==14) ) {
                            alt6=1;
                        }


                        switch (alt6) {
                    	case 1 :
                    	    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:61:10: '[' ']'
                    	    {
                    	    char_literal11=(Token)match(input,14,FOLLOW_14_in_type344); if (state.failed) return retval;
                    	    if ( state.backtracking==0 ) {
                    	    char_literal11_tree = (CommonTree)adaptor.create(char_literal11);
                    	    adaptor.addChild(root_0, char_literal11_tree);
                    	    }
                    	    char_literal12=(Token)match(input,15,FOLLOW_15_in_type346); if (state.failed) return retval;
                    	    if ( state.backtracking==0 ) {
                    	    char_literal12_tree = (CommonTree)adaptor.create(char_literal12);
                    	    adaptor.addChild(root_0, char_literal12_tree);
                    	    }

                    	    }
                    	    break;

                    	default :
                    	    break loop6;
                        }
                    } while (true);


                    }
                    break;

            }
            retval.stop = input.LT(-1);

            if ( state.backtracking==0 ) {

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
    	retval.tree = (CommonTree)adaptor.errorNode(input, retval.start, input.LT(-1), re);

        }
        finally {
            if ( state.backtracking>0 ) { memoize(input, 2, type_StartIndex); }
        }
        return retval;
    }
    // $ANTLR end "type"

    public static class classOrInterfaceType_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    // $ANTLR start "classOrInterfaceType"
    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:66:1: classOrInterfaceType : IDENTIFIERPATTERN ( '.' IDENTIFIERPATTERN )* ;
    public final MethodParser.classOrInterfaceType_return classOrInterfaceType() throws RecognitionException {
        MethodParser.classOrInterfaceType_return retval = new MethodParser.classOrInterfaceType_return();
        retval.start = input.LT(1);
        int classOrInterfaceType_StartIndex = input.index();
        CommonTree root_0 = null;

        Token IDENTIFIERPATTERN13=null;
        Token char_literal14=null;
        Token IDENTIFIERPATTERN15=null;

        CommonTree IDENTIFIERPATTERN13_tree=null;
        CommonTree char_literal14_tree=null;
        CommonTree IDENTIFIERPATTERN15_tree=null;

        try {
            if ( state.backtracking>0 && alreadyParsedRule(input, 3) ) { return retval; }
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:67:5: ( IDENTIFIERPATTERN ( '.' IDENTIFIERPATTERN )* )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:67:9: IDENTIFIERPATTERN ( '.' IDENTIFIERPATTERN )*
            {
            root_0 = (CommonTree)adaptor.nil();

            IDENTIFIERPATTERN13=(Token)match(input,IDENTIFIERPATTERN,FOLLOW_IDENTIFIERPATTERN_in_classOrInterfaceType385); if (state.failed) return retval;
            if ( state.backtracking==0 ) {
            IDENTIFIERPATTERN13_tree = (CommonTree)adaptor.create(IDENTIFIERPATTERN13);
            adaptor.addChild(root_0, IDENTIFIERPATTERN13_tree);
            }
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:68:9: ( '.' IDENTIFIERPATTERN )*
            loop8:
            do {
                int alt8=2;
                int LA8_0 = input.LA(1);

                if ( (LA8_0==16) ) {
                    alt8=1;
                }


                switch (alt8) {
            	case 1 :
            	    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:68:10: '.' IDENTIFIERPATTERN
            	    {
            	    char_literal14=(Token)match(input,16,FOLLOW_16_in_classOrInterfaceType396); if (state.failed) return retval;
            	    if ( state.backtracking==0 ) {
            	    char_literal14_tree = (CommonTree)adaptor.create(char_literal14);
            	    adaptor.addChild(root_0, char_literal14_tree);
            	    }
            	    IDENTIFIERPATTERN15=(Token)match(input,IDENTIFIERPATTERN,FOLLOW_IDENTIFIERPATTERN_in_classOrInterfaceType398); if (state.failed) return retval;
            	    if ( state.backtracking==0 ) {
            	    IDENTIFIERPATTERN15_tree = (CommonTree)adaptor.create(IDENTIFIERPATTERN15);
            	    adaptor.addChild(root_0, IDENTIFIERPATTERN15_tree);
            	    }

            	    }
            	    break;

            	default :
            	    break loop8;
                }
            } while (true);


            }

            retval.stop = input.LT(-1);

            if ( state.backtracking==0 ) {

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
    	retval.tree = (CommonTree)adaptor.errorNode(input, retval.start, input.LT(-1), re);

        }
        finally {
            if ( state.backtracking>0 ) { memoize(input, 3, classOrInterfaceType_StartIndex); }
        }
        return retval;
    }
    // $ANTLR end "classOrInterfaceType"

    public static class primitiveType_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    // $ANTLR start "primitiveType"
    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:72:1: primitiveType : ( 'boolean' | 'char' | 'byte' | 'short' | 'int' | 'long' | 'float' | 'double' );
    public final MethodParser.primitiveType_return primitiveType() throws RecognitionException {
        MethodParser.primitiveType_return retval = new MethodParser.primitiveType_return();
        retval.start = input.LT(1);
        int primitiveType_StartIndex = input.index();
        CommonTree root_0 = null;

        Token set16=null;

        CommonTree set16_tree=null;

        try {
            if ( state.backtracking>0 && alreadyParsedRule(input, 4) ) { return retval; }
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:73:5: ( 'boolean' | 'char' | 'byte' | 'short' | 'int' | 'long' | 'float' | 'double' )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:
            {
            root_0 = (CommonTree)adaptor.nil();

            set16=(Token)input.LT(1);
            if ( (input.LA(1)>=17 && input.LA(1)<=24) ) {
                input.consume();
                if ( state.backtracking==0 ) adaptor.addChild(root_0, (CommonTree)adaptor.create(set16));
                state.errorRecovery=false;state.failed=false;
            }
            else {
                if (state.backtracking>0) {state.failed=true; return retval;}
                MismatchedSetException mse = new MismatchedSetException(null,input);
                throw mse;
            }


            }

            retval.stop = input.LT(-1);

            if ( state.backtracking==0 ) {

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
    	retval.tree = (CommonTree)adaptor.errorNode(input, retval.start, input.LT(-1), re);

        }
        finally {
            if ( state.backtracking>0 ) { memoize(input, 4, primitiveType_StartIndex); }
        }
        return retval;
    }
    // $ANTLR end "primitiveType"

    public static class modifiers_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    // $ANTLR start "modifiers"
    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:84:1: modifiers : ( 'public' | 'protected' | 'private' | 'static' | 'abstract' | 'final' | 'native' | 'synchronized' | 'transient' | 'volatile' | 'strictfp' )* ;
    public final MethodParser.modifiers_return modifiers() throws RecognitionException {
        MethodParser.modifiers_return retval = new MethodParser.modifiers_return();
        retval.start = input.LT(1);
        int modifiers_StartIndex = input.index();
        CommonTree root_0 = null;

        Token set17=null;

        CommonTree set17_tree=null;

        try {
            if ( state.backtracking>0 && alreadyParsedRule(input, 5) ) { return retval; }
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:85:5: ( ( 'public' | 'protected' | 'private' | 'static' | 'abstract' | 'final' | 'native' | 'synchronized' | 'transient' | 'volatile' | 'strictfp' )* )
            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:86:5: ( 'public' | 'protected' | 'private' | 'static' | 'abstract' | 'final' | 'native' | 'synchronized' | 'transient' | 'volatile' | 'strictfp' )*
            {
            root_0 = (CommonTree)adaptor.nil();

            // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:86:5: ( 'public' | 'protected' | 'private' | 'static' | 'abstract' | 'final' | 'native' | 'synchronized' | 'transient' | 'volatile' | 'strictfp' )*
            loop9:
            do {
                int alt9=2;
                int LA9_0 = input.LA(1);

                if ( ((LA9_0>=25 && LA9_0<=35)) ) {
                    alt9=1;
                }


                switch (alt9) {
            	case 1 :
            	    // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:
            	    {
            	    set17=(Token)input.LT(1);
            	    if ( (input.LA(1)>=25 && input.LA(1)<=35) ) {
            	        input.consume();
            	        if ( state.backtracking==0 ) adaptor.addChild(root_0, (CommonTree)adaptor.create(set17));
            	        state.errorRecovery=false;state.failed=false;
            	    }
            	    else {
            	        if (state.backtracking>0) {state.failed=true; return retval;}
            	        MismatchedSetException mse = new MismatchedSetException(null,input);
            	        throw mse;
            	    }


            	    }
            	    break;

            	default :
            	    break loop9;
                }
            } while (true);


            }

            retval.stop = input.LT(-1);

            if ( state.backtracking==0 ) {

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);
            }
        }
        catch (RecognitionException re) {
            reportError(re);
            recover(input,re);
    	retval.tree = (CommonTree)adaptor.errorNode(input, retval.start, input.LT(-1), re);

        }
        finally {
            if ( state.backtracking>0 ) { memoize(input, 5, modifiers_StartIndex); }
        }
        return retval;
    }
    // $ANTLR end "modifiers"

    // $ANTLR start synpred1_Method
    public final void synpred1_Method_fragment() throws RecognitionException {   
        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:46:9: ( modifiers )
        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:46:9: modifiers
        {
        pushFollow(FOLLOW_modifiers_in_synpred1_Method159);
        modifiers();

        state._fsp--;
        if (state.failed) return ;

        }
    }
    // $ANTLR end synpred1_Method

    // $ANTLR start synpred3_Method
    public final void synpred3_Method_fragment() throws RecognitionException {   
        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:49:9: ( modifiers )
        // C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\Method.g:49:9: modifiers
        {
        pushFollow(FOLLOW_modifiers_in_synpred3_Method208);
        modifiers();

        state._fsp--;
        if (state.failed) return ;

        }
    }
    // $ANTLR end synpred3_Method

    // Delegated rules

    public final boolean synpred1_Method() {
        state.backtracking++;
        int start = input.mark();
        try {
            synpred1_Method_fragment(); // can never throw exception
        } catch (RecognitionException re) {
            System.err.println("impossible: "+re);
        }
        boolean success = !state.failed;
        input.rewind(start);
        state.backtracking--;
        state.failed=false;
        return success;
    }
    public final boolean synpred3_Method() {
        state.backtracking++;
        int start = input.mark();
        try {
            synpred3_Method_fragment(); // can never throw exception
        } catch (RecognitionException re) {
            System.err.println("impossible: "+re);
        }
        boolean success = !state.failed;
        input.rewind(start);
        state.backtracking--;
        state.failed=false;
        return success;
    }


    protected DFA4 dfa4 = new DFA4(this);
    static final String DFA4_eotS =
        "\5\uffff";
    static final String DFA4_eofS =
        "\2\uffff\1\4\2\uffff";
    static final String DFA4_minS =
        "\3\10\2\uffff";
    static final String DFA4_maxS =
        "\2\43\1\20\2\uffff";
    static final String DFA4_acceptS =
        "\3\uffff\1\2\1\1";
    static final String DFA4_specialS =
        "\5\uffff}>";
    static final String[] DFA4_transitionS = {
            "\1\2\4\uffff\1\3\3\uffff\10\3\13\1",
            "\1\2\4\uffff\1\3\3\uffff\10\3\13\1",
            "\1\3\5\uffff\1\3\1\uffff\1\3",
            "",
            ""
    };

    static final short[] DFA4_eot = DFA.unpackEncodedString(DFA4_eotS);
    static final short[] DFA4_eof = DFA.unpackEncodedString(DFA4_eofS);
    static final char[] DFA4_min = DFA.unpackEncodedStringToUnsignedChars(DFA4_minS);
    static final char[] DFA4_max = DFA.unpackEncodedStringToUnsignedChars(DFA4_maxS);
    static final short[] DFA4_accept = DFA.unpackEncodedString(DFA4_acceptS);
    static final short[] DFA4_special = DFA.unpackEncodedString(DFA4_specialS);
    static final short[][] DFA4_transition;

    static {
        int numStates = DFA4_transitionS.length;
        DFA4_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA4_transition[i] = DFA.unpackEncodedString(DFA4_transitionS[i]);
        }
    }

    class DFA4 extends DFA {

        public DFA4(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 4;
            this.eot = DFA4_eot;
            this.eof = DFA4_eof;
            this.min = DFA4_min;
            this.max = DFA4_max;
            this.accept = DFA4_accept;
            this.special = DFA4_special;
            this.transition = DFA4_transition;
        }
        public String getDescription() {
            return "43:1: method : ( ( modifiers )? IDENTIFIERPATTERN -> ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( NAME IDENTIFIERPATTERN ) ) | ( modifiers )? ( type | 'void' ) IDENTIFIERPATTERN -> ^( METHOD ^( MODIFIERS ( modifiers )? ) ^( RETURNTYPE ^( NAME ( type )? ( 'void' )? ) ) ^( NAME IDENTIFIERPATTERN ) ) );";
        }
    }
 

    public static final BitSet FOLLOW_modifiers_in_method159 = new BitSet(new long[]{0x0000000000000100L});
    public static final BitSet FOLLOW_IDENTIFIERPATTERN_in_method170 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_modifiers_in_method208 = new BitSet(new long[]{0x0000000001FE2100L});
    public static final BitSet FOLLOW_type_in_method220 = new BitSet(new long[]{0x0000000000000100L});
    public static final BitSet FOLLOW_13_in_method234 = new BitSet(new long[]{0x0000000000000100L});
    public static final BitSet FOLLOW_IDENTIFIERPATTERN_in_method254 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_classOrInterfaceType_in_type308 = new BitSet(new long[]{0x0000000000004002L});
    public static final BitSet FOLLOW_14_in_type319 = new BitSet(new long[]{0x0000000000008000L});
    public static final BitSet FOLLOW_15_in_type321 = new BitSet(new long[]{0x0000000000004002L});
    public static final BitSet FOLLOW_primitiveType_in_type333 = new BitSet(new long[]{0x0000000000004002L});
    public static final BitSet FOLLOW_14_in_type344 = new BitSet(new long[]{0x0000000000008000L});
    public static final BitSet FOLLOW_15_in_type346 = new BitSet(new long[]{0x0000000000004002L});
    public static final BitSet FOLLOW_IDENTIFIERPATTERN_in_classOrInterfaceType385 = new BitSet(new long[]{0x0000000000010002L});
    public static final BitSet FOLLOW_16_in_classOrInterfaceType396 = new BitSet(new long[]{0x0000000000000100L});
    public static final BitSet FOLLOW_IDENTIFIERPATTERN_in_classOrInterfaceType398 = new BitSet(new long[]{0x0000000000010002L});
    public static final BitSet FOLLOW_set_in_primitiveType0 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_set_in_modifiers525 = new BitSet(new long[]{0x0000000FFE000002L});
    public static final BitSet FOLLOW_modifiers_in_synpred1_Method159 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_modifiers_in_synpred3_Method208 = new BitSet(new long[]{0x0000000000000002L});

}