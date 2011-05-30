package salmir.qp.test.shared;

public class SimpleRaceCondition2 {
    static boolean flag1 = true;
    static boolean flag2 = true;
    static boolean loopDone1 = true;
    static boolean loopDone2 = true;

    static boolean toContinue = false;
    static boolean stop = false;

    public static void main(String [] args)
    {
        Runnable rb1 = new Runnable(){
            public void run() {
                while (!stop){

                    while (toContinue){
                        loopDone1 = false;
                        flag1 = !flag1;
                        flag2 = !flag2;
                        loopDone1 = true;
                    }
                }
            }
        };
        Runnable rb2 = new Runnable(){
            public void run() {
                while (!stop)
                {
                    while (toContinue){
                        loopDone2 = false;
                        flag1 = !flag1;
                        flag2 = !flag2;
                        loopDone2 = true;
                    }
                }
            }
        };
        Thread t1 = new Thread(rb1);
        Thread t2 = new Thread(rb2);

        t1.start();
        t2.start();

        toContinue = true;
        int i = 0;
        for (; i<10000000000D ; i++)
        {
            if (flag1 && !flag2)
            {
                toContinue = false;
                //let both loops finishes;
                while (! (loopDone1&&loopDone2) )
                {

                }
//                System.out.println(i + " * " + loopDone1 + " : " + loopDone2);
                System.out.println(i + " - " + flag1 + " : " + flag2);
                if (flag1 && !flag2) //now it means both loop finished and flags are not equal;
                {
                    stop = true;
                    break;
                }
                toContinue = true;
            }
        }
        System.out.println(i + " - " + flag1 + " : " + flag2);
    }
}


//  Important: it seems that i has still a bug, needs more testing.