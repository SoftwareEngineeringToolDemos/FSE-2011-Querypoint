package salmir.qp.query;                      

import org.antlr.runtime.*;
import org.antlr.runtime.tree.CommonTree;
import org.apache.commons.beanutils.BeanUtils;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.lang.reflect.InvocationTargetException;

import salmir.qp.query.grammar.QueryLexer;
import salmir.qp.query.grammar.QueryParser;
import salmir.qp.query.constraint.Constants;
import salmir.util.UnexpectedEventException;

public class EventQueryParser {


    public EventQueryParser() {
    }

    public EventQuery parse(String query) throws EventQueryParseException {
        ANTLRStringStream input = new ANTLRStringStream(query);
        QueryLexer lexer = new QueryLexer(input);

        CommonTokenStream tokens = new CommonTokenStream(lexer);
        QueryParser parser = new QueryParser(tokens);
        QueryParser.query_return r = null;
        try {
            r = parser.query();
        } catch (RecognitionException e) {
            throw new EventQueryParseException(e);
        }

        CommonTree ct = (CommonTree)r.getTree();
        try {
            return new EventQuery(parse(ct));
        } catch (Exception e) {
            if (e instanceof EventQueryParseException)
                throw (EventQueryParseException)e;
            throw new EventQueryParseException(e);
        }
    }

    EventQueryNode parse(CommonTree ct) throws EventQueryParseException, IllegalAccessException, NoSuchMethodException, InvocationTargetException, InstantiationException {
        String nodeName = getTrimLowerCaseText(ct);
        EventQueryNodeType qnt = Constants.getEventQueryNodeTypeByName(nodeName);
        return parse(ct, qnt);
    }

    EventQueryNode parse(CommonTree ct, EventQueryNodeType qnt) throws EventQueryParseException,
            NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        String nodeName = getTrimLowerCaseText(ct);
        EventQueryNode qn = new EventQueryNode(nodeName);
        Object bean = null;
        Class beanClass = qnt.getBeanClass();
        bean = beanClass.newInstance();


        if (qnt.getLexer() != null)
        {
            ANTLRStringStream input = new ANTLRStringStream(ct.getChild(0).getText());
            Lexer lexer = qnt.getLexer().getConstructor(new Class[]{CharStream.class})
                     .newInstance(new Object[]{input});
            CommonTokenStream tokens = new CommonTokenStream(lexer);
            Parser parser = qnt.getParser().getConstructor(new Class[]{TokenStream.class})
                     .newInstance(new Object[]{tokens});
            ParserRuleReturnScope root = (ParserRuleReturnScope)qnt.getParser().getMethod(qnt.getName()).invoke(parser);
            ct = (CommonTree)root.getTree();
        }

        if (qnt.getChildrenNames().length > 0)
        {
            List<EventQueryNode> children = parseChildren(ct, qnt);
            qn.setChildren(children);

            for (EventQueryNode child : children)
            {
                try{
                    String propertyName = child.getContent().replace("[","(").replace("]",")"); //changes indexed property names to mapped property names
                    BeanUtils.setProperty(bean, propertyName, child.getBean());
                }catch(Exception exp)
                {
                    //todo manage the exception
                    throw new UnexpectedEventException(exp);
                }
            }
        }else  //like atomic, constraintmodifiers
        {
            StringBuilder childContent = new StringBuilder();
            List<String> data = new ArrayList<String>();
            if (ct.getChildren() != null)
            {
                for (CommonTree child : (List<CommonTree>)ct.getChildren())
                {
                    childContent.append(" " + child.getText());
                    data.add(child.getText());
                }
            }
            EventQueryNode childQN = new EventQueryNode(childContent.toString());
            try{
                BeanUtils.setProperty(bean, "data", data);
            }catch(Exception exp)
            {
                //todo mange the exception properly
                exp.printStackTrace();
            }

            qn.addChild(childQN);
        }

        qn.setBean(bean);
//        System.out.println("QN : " + qn.getContent());
        return qn;
    }


    List<EventQueryNode> parseChildren(CommonTree ct, EventQueryNodeType qnt) throws EventQueryParseException, IllegalAccessException, NoSuchMethodException, InvocationTargetException, InstantiationException {
        List<EventQueryNode> returnChildren = new ArrayList();

        List<CommonTree> children = ct.getChildren();
        if (children == null || children.size() == 0)
            throw new EventQueryParseException(
              "No constraintQuery has been defined for "
                + getFormattedString(ct) + getPositionString(ct));

        List<String> childNames = Arrays.asList(qnt.getChildrenNames());

        List<String> alreadyExist = new ArrayList<String>();
        for (CommonTree child : children)
        {
            //this name will be checked to be not redundant
            String propName = getTrimLowerCaseText(child);
            // this name will be checked to be one of valid children names
            String nameToCheck = propName;
            if (propName.indexOf('[') != -1)
            {
                int startIndex = propName.indexOf('[');
                nameToCheck = propName.substring(0, startIndex);
                nameToCheck = nameToCheck+"[]";
                int endIndex = propName.indexOf(']');
                if (endIndex == -1)
                    endIndex = propName.length()-1;
                String index = propName.substring(startIndex+1, endIndex);
                if ("*".equals(index))
                    propName = null; // it should not be checked , there might be more than one arg[*]
                else
                {
                    int intIndex;
                    try {
                        intIndex = Integer.parseInt(index);
                    }catch(NumberFormatException nfe)
                    {
                        throw new EventQueryParseException(
                       "The property index in [ ] should be a non-negative integer or * : "
                       + getFormattedString(child) + getPositionString(ct));
                    }

                    if (intIndex < 0)
                    {
                        throw new EventQueryParseException(
                       "The property index in [ ] should be a non-negative integer or * : "
                       + getFormattedString(child) + getPositionString(ct));
                    }
                    propName = propName.substring(0,startIndex)+"["
                               +index+"]";
                }
            }

            if (!childNames.contains(nameToCheck))
            {
                throw new EventQueryParseException(
               "The property name is wrong : "
               + getFormattedString(child) + getPositionString(ct) +
               "; valid property names : " + listToString(childNames));
            }
            if (propName != null)
            {
                if (alreadyExist.contains(propName))
                    throw new EventQueryParseException(
                   "The property has already been defined " + ":"
                   + getFormattedString(child) + getPositionString(ct) );
                alreadyExist.add(propName);
            }
            returnChildren.add(parse(child, salmir.qp.query.constraint.Constants.getChildNodeType(qnt,nameToCheck)));
        }

        return returnChildren;
    }



    // CommonTree Methods
    String getTrimLowerCaseText(CommonTree ct)
    {
        return ct.getText().trim().toLowerCase();
    }

    String getPositionString(CommonTree ct)
    {
        return " :(" + ct.getLine() + ":" + ct.getCharPositionInLine() + ")";
    }

    String getFormattedString(CommonTree ct)
    {
        return  ""+ ct.getText().trim() +"";
    }

    String listToString(List<String> list)
    {
        StringBuilder sb = new StringBuilder();
        for (int i=0 ; i<list.size() ; i++)
        {
            String item = list.get(i);
            sb.append(item);
            if (i<list.size()-1)
                sb.append(", ");
        }
        return sb.toString();
    }


}
