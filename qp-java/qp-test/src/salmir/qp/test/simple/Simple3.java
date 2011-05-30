package salmir.qp.test.simple;

import java.util.List;
import java.util.ArrayList;

public class Simple3 {

    public static int x = 0;
    public static String z = null;
    public static String[] justTest = new String[4];

    public static void main(String[] args)
    {
        System.out.println(" Hello :)");
        z = "z";
        for (int i=0 ; i<50000 ; i = i+500)
        {
            x = x+87;
            System.out.println(x);
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
            myMethod(i+"");
        }

        System.out.println(" GoodBye! ");

        System.out.println("System.out.class : " + System.out.getClass());
    }

    public static void myMethod(String x)
    {
        justTest[3]= "dddd";
        int test1=0, test2=0;
        test2=test1++;
        String result = null;
        int hh;
        String y = null;
        if (x.length() < 4)
        {
            y = m1(x);
            y = m2(y);
        }
        else
        if (x.length() > 4)
        {
            y = m2(x);
            y = m1(x);
        }
        try
        {
            int var = 0;
            var++;
            z = y;
            result = alg(alg(y,x),x);
        }catch(Exception ex)
        {
            //ignore
        }
        System.out.println(result);
    }

    public static String m1(String x)
    {
        System.out.println(x);
        return x.concat(" ");
    }

    public static String m2(String x)
    {
        System.out.println(x);
        return x.substring(2);
    }

    public static String alg(String x, String y)
    {
        if (x == null)
            throw new RuntimeException("x should not be null.");
        return x.trim()+(y.substring(0,1));
    }

    public static class CPstructure{
        CPstructure cp;

        public CPstructure() {
        }

        public CPstructure getCp() {
            return cp;
        }

        public void setCp(CPstructure cp) {
            this.cp = cp;
        }
    }


    public static void myMethod2(int x)
    {
        justTest[3]= "dddd";
        int test1=0, test2=0;
        test2=test1++;
        String result = null;
        int hh;
        String y = null;
        int w = 0;
        if (y == null)
        {
            x = -1;
        }
        else
        if (y.length() == 0){
            x = 0;
        }else if (y.length() >  0){
            x = 5 * w;
        }
        x = x + 1;

    }

}
