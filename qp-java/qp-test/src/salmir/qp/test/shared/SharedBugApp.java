package salmir.qp.test.shared;

public class SharedBugApp implements Runnable{
	public static final int ITERATIONS = 10;
	int shared = 0;
//	static Object lock = new Object();
	public int increaseShared(){
		int x = shared;
		x++;
		shared = x;
		return shared;
	}
	
	public int getX()
	{
		return 0;
	}
	
	public class MyThread implements Runnable
	{
		public MyThread()
		{
			
		}
		//@Override
		public void run() {
			for (int i=0; i<ITERATIONS ; i++)
			{
				increaseShared();
			}
		}
	}

	public void run()
	{
        System.out.println("Shared : " + shared);
        Thread t1 = new Thread(new SharedBugApp.MyThread());
        Thread t2 = new Thread(new SharedBugApp.MyThread());
        t1.start();
        t2.start();
        while (true)
        {
        	if (!t1.isAlive() && !t2.isAlive())
        	    break;
        }
	
        System.out.println("Shared : " + shared);
        
	}
	
	public static void main(String args[])
    {
        SharedBugApp sharedBugApp = new SharedBugApp();
        sharedBugApp.run();
    }
}
