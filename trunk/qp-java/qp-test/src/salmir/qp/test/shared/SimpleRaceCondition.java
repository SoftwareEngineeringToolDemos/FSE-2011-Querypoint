package salmir.qp.test.shared;

public class SimpleRaceCondition {
    static int t1cnt = 0;
    static int t2cnt = 0;
    static int total = 0;
    static boolean toContinue = true;
    static boolean stop = false;

    public static void main(String [] args)
    {
        Runnable rb1 = new Runnable(){
            public void run() {
                while (!stop){
                    while (toContinue){
                        t1cnt ++;
                        total++;
                    }
                }
            }
        };
        Runnable rb2 = new Runnable(){
            public void run() {
                while (!stop)
                {
                    while (toContinue){
                        t2cnt ++;
                        total++;
                    }
                }
            }
        };
        Thread t1 = new Thread(rb1);
        Thread t2 = new Thread(rb2);

        t1.start();
        t2.start();

        while (true)
        {
            toContinue = false;
//            int j=0;
//            for (int i=0 ; i<10000 ; i++)
//            {
//                j++;
//            }
            int two = t1cnt+t2cnt;
            int one = total;

            if (one != two)
            {
                stop = true;
                throw new RuntimeException("error! :" + total + " " + (t1cnt+t2cnt)
                        + "\n" + one + " " + two);
            }
            toContinue = true;
        }
    }
}
