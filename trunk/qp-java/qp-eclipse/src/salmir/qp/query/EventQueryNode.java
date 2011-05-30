package salmir.qp.query;

import java.util.List;
import java.util.ArrayList;

public class EventQueryNode {

    String content;
    List<EventQueryNode> children = new ArrayList();
    Object bean;

    public EventQueryNode(String content) {
        this.content = content;
    }


    public void addChild(EventQueryNode qn)
    {
        children.add(qn);
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<EventQueryNode> getChildren() {
        return children;
    }

    public void setChildren(List<EventQueryNode> children) {
        this.children = children;
    }

    public Object getBean() {
        return bean;
    }

    public void setBean(Object bean) {
        this.bean = bean;
    }

    public EventQueryNode getChild(String name)
    {
        if (name == null)
            return null;
        String[] names = name.split("\\.");
        EventQueryNode qn = this;
        boolean found = false;
        for (String childName: names)
        {
            List<EventQueryNode> qnChildren = qn.getChildren();
            for (EventQueryNode child : qnChildren)
            {
                if (child.getContent().toLowerCase().equals(childName.toLowerCase()))
                {
                    qn = child;
                    found = true;
                    break;
                }
            }
            if (! found)
            {
                qn = null;
                break;

            }
            found = false;
        }
        return qn;
    }
    public String toString()
    {
        StringBuilder sb = new StringBuilder();
        sb.append(content+"\n");
        for (EventQueryNode child: children)
            sb.append(child);
        return sb.toString();
    }
}
