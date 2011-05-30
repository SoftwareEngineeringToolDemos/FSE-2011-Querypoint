package salmir.qp.query;


import org.antlr.runtime.Lexer;
import org.antlr.runtime.Parser;

public class EventQueryNodeType {
    int id;
    String name;
    Class beanClass; // the bean classs
    String[] childrenNames;
    int[] childrenNodeTypes;
    Class<Lexer> lexer;
    Class<Parser> parser;

    public EventQueryNodeType(int id, String name, Class clazz, String[] childrenNames, int[] childrenNodeTypes)
    {
        this.id = id;
        this.name = name;
        this.beanClass = clazz;
        this.childrenNames = childrenNames;
        this.childrenNodeTypes = childrenNodeTypes;
    }


    public EventQueryNodeType(int id, String name, Class clazz, String[] childrenNames, int[] childrenNodeTypes,
                         Class lexer, Class parser) {

        this.id = id;
        this.name = name;
        this.beanClass = clazz;
        this.childrenNames = childrenNames;
        this.childrenNodeTypes = childrenNodeTypes;
        this.lexer = lexer;
        this.parser = parser;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Class getBeanClass() {
        return beanClass;
    }

    public void setBeanClass(Class beanClass) {
        this.beanClass = beanClass;
    }

    public String[] getChildrenNames() {
        return childrenNames;
    }

    public void setChildrenNames(String[] childrenNames) {
        this.childrenNames = childrenNames;
    }

    public int[] getChildrenNodeTypes() {
        return childrenNodeTypes;
    }

    public void setChildrenNodeTypes(int[] childrenNodeTypes) {
        this.childrenNodeTypes = childrenNodeTypes;
    }

    public Class<Lexer> getLexer() {
        return lexer;
    }

    public void setLexer(Class<Lexer> lexer) {
        this.lexer = lexer;
    }

    public Class<Parser> getParser() {
        return parser;
    }

    public void setParser(Class<Parser> parser) {
        this.parser = parser;
    }
}
