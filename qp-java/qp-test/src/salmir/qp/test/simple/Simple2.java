package salmir.qp.test.simple;

public class Simple2 {

    public static int x = 0;
    public static String z = null;
    public static void main(String[] args)
    {
        System.out.println("Start ....");
        z = "z";
        for (int i=0 ; i<10 ; i++)
        {
            x++;
            myMethod(i+"");
            System.out.println("The Defect point!");
        }
        myMethod(z);
        z = null;
        System.out.println(z);
        System.out.println(" GoodBye :) ");
    }

    public static void myMethod(String y)
    {
        System.out.println(y);
        System.out.println(x+"");
        System.out.println(z);
        if (y=="5")
            System.out.println("nonono");
        else if (y=="4")
            System.out.println("nonono");
        else
            System.out.println("nonono");

    }
}
