package salmir.qp.standalone;

import salmir.qp.reproduction.IReproducer;
import salmir.qp.reproduction.IReproduction;
import salmir.qp.reproduction.ReproducingException;
import salmir.util.StreamRedirectThread;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintStream;

public class BasicJavaReproducer implements IReproducer{

    String mainClassName;

    static String JDKPath = "C:\\Program Files\\Java\\jdk1.6.0_13\\";
	static String JDKClassPath = JDKPath+"jre\\lib\\";
	static String DEBUGArguments = "-agentlib:jdwp=transport=dt_socket,address=8000,server=y,pause=y ";
	static String JDKClassPathFull = JDKClassPath+"charsets.jar;" +
									 JDKClassPath+"deploy.jar;" +
									 JDKClassPath+"javaws.jar;" +
									 JDKClassPath+"jce.jar;" +
									 JDKClassPath+"jsse.jar;" +
									 JDKClassPath+"management-agent.jar;" +
									 JDKClassPath+"plugin.jar;" +
									 JDKClassPath+"resources.jar;" +
									 JDKClassPath+"rt.jar;" +
									 JDKClassPath+"tools.jar;" +
									 JDKClassPath+"ext\\dnsns.jar;" +
									 JDKClassPath+"ext\\localedata.jar;" +
									 JDKClassPath+"ext\\sunjce_provider.jar;" +
									 JDKClassPath+"ext\\sunmscapi.jar;" +
									 JDKClassPath+"ext\\sunpkcs11.jar;";
	static String ClassPath = ".\\qp-eclipse\\bin;.\\qp-test\\bin;";
	static String cmd = 
	    	"\""+JDKPath+"bin\\java\" " +
	    	DEBUGArguments +
	        "-Dfile.encoding=windows-1252 " +
	        "-classpath \" "+ JDKClassPathFull + ClassPath + "\" ";
	
    
	public BasicJavaReproducer(String mainClassName){
		this.mainClassName = mainClassName;
	}
	
	public IReproduction reproduce() throws ReproducingException {
        try {
            Process process = Runtime.getRuntime().exec(cmd + mainClassName);
            JavaQPDebugTarget basicDebugTarget = JavaQPDebugTarget.getJavaDebugTarget_Attach("main"
                             , true
                             , null, null,
                             "8000");

//              new BasicDebugTarget("main", process);

//getToBeMonitored_JavaProcess_Attach(//
//                    MonitoredProcess_Java.getToBeMonitored_JavaProcess_Attach(true
//                             , "javadebug", null,
//                             null); //


            PrintStream monitioredProcessOutput;  // Where monitored VM output goes
            try {
                monitioredProcessOutput = new PrintStream(new File("Process_"+
                        "JavaDebugTarget.log"));
            } catch (FileNotFoundException e) {
                //todo manage the exception
                throw new RuntimeException(e);
            }
            Thread errThread = new StreamRedirectThread("error reader",
                                             process.getErrorStream(),
                    monitioredProcessOutput);
            Thread outThread = new StreamRedirectThread("output reader",
                                             process.getInputStream(),
                    monitioredProcessOutput);
            errThread.start();
            outThread.start();


            IReproduction reproduction = new IReproduction();
            reproduction.setDebugTarget(basicDebugTarget);
            return reproduction;
        } catch (Exception e) {
            throw new ReproducingException(e);
        }
    }
	
	public boolean endReproduction(IReproduction reproduction){
		return true;
	}
}
