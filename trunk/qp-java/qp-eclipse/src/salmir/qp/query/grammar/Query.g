grammar Query;

options {
    output=AST;
    ASTLabelType=CommonTree;
}

@header{
  package salmir.qpdb.query.grammar; 
}


@lexer::header {
  package salmir.qpdb.query.grammar; 
}

@members {
    public static void main(String[] args) throws Exception {
        ANTLRInputStream input = new ANTLRInputStream(System.in);
//        EventCLexer lexer = new EventCLexer(input);
  //      CommonTokenStream tokens = new CommonTokenStream(lexer);
    //    EventCParser parser = new EventCParser(tokens);
      //  EventCParser.eventC_return r = parser.eventC();
    }
}
    
     

/*------------------------------------------------------------------
 * PARSER RULES
 *------------------------------------------------------------------*/

query :  STR^ '{'! ((query)+|STR) '}'!;

/*------------------------------------------------------------------
 * LEXER RULES
 *------------
 
 ------------------------------------------------------*/


WS  
    :   (
             ' '
        |    '\r'
        |    '\t'
        |    '\u000C'
        |    '\n'
        ) 
        {
            skip();
        }   
    ;
    


STR:  ~('{'|'}')* ;



    
