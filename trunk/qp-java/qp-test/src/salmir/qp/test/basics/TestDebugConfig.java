package salmir.qp.test.basics;

import salmir.qp.core.concept.Reproducer;
import salmir.qp.standalone.BasicJavaReproducer;

public class TestDebugConfig {

    public static void main(String args[])
    {
        testDebugConfig("simple.Simple");
    }
    
    public static void testDebugConfig(String className){
        try{
	    	System.out.println("...............>>>>>");
	    	Reproducer reproducer = new BasicJavaReproducer(className);
	    	reproducer.reproduce();
	    	
//	    	Process process = TestUtil.execClass(className);
	
//	        Thread errThread = new StreamRedirectThread("error reader",
//	                                             process.getErrorStream(),
//	                                             System.err);
//	        Thread outThread = new StreamRedirectThread("output reader",
//	                                             process.getInputStream(),
//	                                             System.out);
//	        errThread.start();
//	        outThread.start();
	        System.out.println("...............<<<<<");
        }catch(Exception exp){
        	exp.printStackTrace();
        }
    	
    }

}
