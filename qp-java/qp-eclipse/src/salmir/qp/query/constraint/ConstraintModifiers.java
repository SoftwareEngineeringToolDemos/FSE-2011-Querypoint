package salmir.qp.query.constraint;

import org.apache.commons.beanutils.BeanUtils;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.lang.reflect.InvocationTargetException;


public class ConstraintModifiers extends Constraint {


    /*
    * Access modifier flag constants from <em>The Java Virtual
    * Machine Specification, Second Edition</em>, tables 4.1, 4.4,
    * 4.5, and 4.7.
    */

    /**
     * The <code>int</code> value representing the <code>public</code>
     * modifier.
     */
    public static final int PUBLIC = 0x00000001;

    /**
     * The <code>int</code> value representing the <code>private</code>
     * modifier.
     */
    public static final int PRIVATE = 0x00000002;

    /**
     * The <code>int</code> value representing the <code>protected</code>
     * modifier.
     */
    public static final int PROTECTED = 0x00000004;

    /**
     * The <code>int</code> value representing the <code>static</code>
     * modifier.
     */
    public static final int STATIC = 0x00000008;

    /**
     * The <code>int</code> value representing the <code>final</code>
     * modifier.
     */
    public static final int FINAL = 0x00000010;

    /**
     * The <code>int</code> value representing the <code>synchronized</code>
     * modifier.
     */
    public static final int SYNCHRONIZED = 0x00000020;

    /**
     * The <code>int</code> value representing the <code>volatile</code>
     * modifier.
     */
    public static final int VOLATILE = 0x00000040;

    /**
     * The <code>int</code> value representing the <code>transient</code>
     * modifier.
     */
    public static final int TRANSIENT = 0x00000080;

    /**
     * The <code>int</code> value representing the <code>native</code>
     * modifier.
     */
    public static final int NATIVE = 0x00000100;

    /**
     * The <code>int</code> value representing the <code>interface</code>
     * modifier.
     */
    public static final int INTERFACE = 0x00000200;

    /**
     * The <code>int</code> value representing the <code>abstract</code>
     * modifier.
     */
    public static final int ABSTRACT = 0x00000400;

    /**
     * The <code>int</code> value representing the <code>strictfp</code>
     * modifier.
     */
    public static final int STRICT = 0x00000800;


    int mod;

    List<String> data;

    static Map<String, ModifierItem> modifierItems = new HashMap();

    static{
        String name;
        int value;

        name = "public";
        value= PUBLIC;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "protected";
        value= PROTECTED;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "private";
        value= PRIVATE;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "abstract";
        value= ABSTRACT;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "static";
        value= STATIC;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "final";
        value= FINAL;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "transient";
        value= TRANSIENT;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "volatile";
        value= VOLATILE;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "synchronized";
        value= SYNCHRONIZED;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "native";
        value= NATIVE;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "strictfp";
        value= STRICT;
        modifierItems.put(name, new ModifierItem(name, value));

        name = "interface";
        value= INTERFACE;
        modifierItems.put(name, new ModifierItem(name, value));
    }

    public ConstraintModifiers() {
    }

    public List<String> getData() {
        return data;
    }

    public void setData(List<String> data) {
        this.data = data;

        for (ModifierItem modifier: modifierItems.values())
        {
            try {
                BeanUtils.setProperty(this, modifier.getName(), data.contains(modifier.getName()));
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e); //it should not happen
            } catch (InvocationTargetException e) {
                throw new RuntimeException(e); //it should not happen
            }
        }
    }

    public void setPublic(boolean b) {
        if (!b && isPublic()) mod = mod & PUBLIC;
    }

    public void setPrivate(boolean b) {
        if (!b && isPrivate()) mod = mod & PRIVATE ;
    }

    public void setProtected(boolean b) {
        if (!b && isProtected()) mod = mod & PROTECTED;
    }

    public void setStatic(boolean b) {
        if (!b && isStatic()) mod = mod & STATIC;
    }

    public void setFinal(boolean b) {
        if (!b && isFinal()) mod = mod & FINAL;
    }

    public void setSynchronized(boolean b) {
        if (!b && isSynchronized()) mod = mod & SYNCHRONIZED;
    }

    public void setVolatile(boolean b) {
        if (!b && isVolatile()) mod = mod & VOLATILE;
    }

    public void setTransient(boolean b) {
        if (!b && isTransient()) mod = mod & TRANSIENT;
    }

    public void setNative(boolean b) {
        if (!b && isNative()) mod = mod & NATIVE;
    }

    public void setInterface(boolean b) {
        if (!b && isInterface()) mod = mod & INTERFACE;
    }

    public void setAbstract(boolean b) {
        if (!b && isAbstract()) mod = mod & ABSTRACT;
    }

    public void setStrict(boolean b) {
        if (!b && isStrict()) mod = mod & STRICT;
    }

    public boolean isPublic() {
        return (mod & PUBLIC) != 0;
    }

    public boolean isPrivate() {
        return (mod & PRIVATE) != 0;
    }

    public boolean isProtected() {
        return (mod & PROTECTED) != 0;
    }

    public boolean isStatic() {
        return (mod & STATIC) != 0;
    }

    public boolean isFinal() {
        return (mod & FINAL) != 0;
    }

    public boolean isSynchronized() {
        return (mod & SYNCHRONIZED) != 0;
    }

    public boolean isVolatile() {
        return (mod & VOLATILE) != 0;
    }

    public boolean isTransient() {
        return (mod & TRANSIENT) != 0;
    }

    public boolean isNative() {
        return (mod & NATIVE) != 0;
    }

    public boolean isInterface() {
        return (mod & INTERFACE) != 0;
    }

    public boolean isAbstract() {
        return (mod & ABSTRACT) != 0;
    }

    public boolean isStrict() {
        return (mod & STRICT) != 0;
    }

    public String toString() {
        StringBuffer sb = new StringBuffer();
        int len;

        if ((mod & PUBLIC) != 0) sb.append("public ");
        if ((mod & PROTECTED) != 0) sb.append("protected ");
        if ((mod & PRIVATE) != 0) sb.append("private ");

        /* Canonical order */
        if ((mod & ABSTRACT) != 0) sb.append("abstract ");
        if ((mod & STATIC) != 0) sb.append("static ");
        if ((mod & FINAL) != 0) sb.append("final ");
        if ((mod & TRANSIENT) != 0) sb.append("transient ");
        if ((mod & VOLATILE) != 0) sb.append("volatile ");
        if ((mod & SYNCHRONIZED) != 0) sb.append("synchronized ");
        if ((mod & NATIVE) != 0) sb.append("native ");
        if ((mod & STRICT) != 0) sb.append("strictfp ");
        if ((mod & INTERFACE) != 0) sb.append("interface ");

        if ((len = sb.length()) > 0)    /* trim trailing space */
            return sb.toString().substring(0, len - 1);
        return "";
    }

    private static class ModifierItem
    {
        int value;
        String name;

        public ModifierItem(String name, int value) {
            this.name = name;
            this.value = value;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getValue() {
            return value;
        }

        public void setValue(int value) {
            this.value = value;
        }
    }
}
