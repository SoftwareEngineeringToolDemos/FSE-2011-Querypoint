grammar ObjectRef;

options {
    output=AST;
    ASTLabelType=CommonTree;
//    k=10;
     backtrack=true;
     memoize=true;
}

tokens {
        OBJECTREF = '{objectref}';
        POINTNAME = '{pointname}';
        FRAME = '{frame}' ;
	REFERENCE = '{reference}' ;
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

    }
}


// instead of identifier pattern, I can also use (extend / super class)
// perhaps I should remove return type.

//method signature, object value (o.x.y = 'something')
// for args we just have 3 constraints, being an instance of a class set,
// constraints on values, or be exactly an object with specified reference.

/*------------------------------------------------------------------
 * PARSER RULES
 *------------------------------------------------------------------*/

objectref :  STR '(' STR ')' ':' STR 
         -> ^(OBJECTREF ^(POINTNAME STR) ^(FRAME STR) ^(REFERENCE STR));

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
    


STR:  ~('('|')'|':')* ;



    
