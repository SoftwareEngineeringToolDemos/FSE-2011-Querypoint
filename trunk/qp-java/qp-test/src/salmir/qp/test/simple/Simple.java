package salmir.qp.test.simple;


public class Simple {
    public static void main(String[] args)
    {
        System.out.println("Hi :) ....");
        for (int i=0 ; i<10 ; i++)
        {
            System.out.println("The Defect point!");
            if (i==5)
            {
                System.out.println("This is a BUG!");
            }
        }
        System.out.println(".... GoodBye!");
    }
}
