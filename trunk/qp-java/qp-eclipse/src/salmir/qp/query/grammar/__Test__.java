import java.io.*;
import org.antlr.runtime.*;
import org.antlr.runtime.debug.DebugEventSocketProxy;

import salmir.qp.query.grammar.*;


public class __Test__ {

    public static void main(String args[]) throws Exception {
        ObjectRefLexer lex = new ObjectRefLexer(new ANTLRFileStream("C:\\salmir\\work\\epfl\\projects\\26_mbdebugging-prototype\\src\\java\\salmir\\qpdb\\query\\grammar\\.\\__Test___input.txt"));
        CommonTokenStream tokens = new CommonTokenStream(lex);

        ObjectRefParser g = new ObjectRefParser(tokens, null);
        try {
            g.objectref();
        } catch (RecognitionException e) {
            e.printStackTrace();
        }
    }
}