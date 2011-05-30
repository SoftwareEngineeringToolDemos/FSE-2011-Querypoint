package salmir.qp.standalone;

import com.sun.jdi.connect.Connector;
import com.sun.jdi.connect.AttachingConnector;
import com.sun.jdi.connect.IllegalConnectorArgumentsException;
import com.sun.jdi.connect.LaunchingConnector;
import com.sun.jdi.VirtualMachine;
import com.sun.jdi.Bootstrap;

import java.util.Map;
import java.util.List;
import java.util.Iterator;
import java.io.IOException;
import salmir.qp.core.concept.DebugTarget;

public class JavaDebugTarget extends AbstractDebugTarget{
	Connector connector;
    VirtualMachine vm;

    public JavaDebugTarget(String name, Connector connector, VirtualMachine vm) {
        super(name);
        this.connector = connector;
        this.vm = vm;
    }


    public Connector getConnector() {
        return connector;
    }

    public void setConnector(Connector connector) {
        this.connector = connector;
    }

    public VirtualMachine getVm() {
        return vm;
    }

    public void setVm(VirtualMachine vm) {
        this.vm = vm;
    }

    //todo change this method , perhaps to two methods
    // check out this page http://java.sun.com/javase/6/docs/technotes/guides/jpda/conninv.html#Invocation
    public static JavaDebugTarget getJavaDebugTarget_Attach(String processName, boolean isSocket, String name, String hostName, String port)
    {
        AttachingConnector ac = findAttachingConnector(isSocket);

        Map arguments = ac.defaultArguments();
        if (isSocket)
        {
            Connector.Argument portArg =
                           (Connector.Argument)arguments.get("port");
            if (portArg == null) {
                throw new Error("Bad Attaching connector");
            }
            portArg.setValue(port);
        }else
        {
            Connector.Argument mainArg =
                           (Connector.Argument)arguments.get("name");
            if (mainArg == null) {
                throw new Error("Bad Attaching connector");
            }
            mainArg.setValue(name);
        }

        VirtualMachine vm = null;
        try {
            vm = ac.attach(arguments);
        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (IllegalConnectorArgumentsException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }

        if (vm == null)
            System.out.println("ERROR: DebugConfig can not be initialized!");
        return  new JavaDebugTarget(processName, ac, vm);
    }

        /**
      * Find a com.sun.jdi.CommandLineLaunch connector
      */
     public static LaunchingConnector findLaunchingConnector() {
         List connectors = Bootstrap.virtualMachineManager().allConnectors();
         Iterator iter = connectors.iterator();
         while (iter.hasNext()) {
             Connector connector = (Connector)iter.next();
             if (connector.name().equals("com.sun.jdi.CommandLineLaunch")) {
                 return (LaunchingConnector)connector;
             }
         }
         throw new Error("No launching connector");
     }
     /**
      * Find a com.sun.jdi.CommandLineLaunch connector
      */
     public static AttachingConnector findAttachingConnector(boolean isSocket) {
         List connectors = Bootstrap.virtualMachineManager().attachingConnectors();
         Iterator iter = connectors.iterator();
         while (iter.hasNext()) {
             Connector connector = (Connector)iter.next();
//             System.out.println("connector processName :" + connector.processName());
             if (isSocket)
             {
                 if (connector.name().equals("com.sun.jdi.SocketAttach")) {
                     return (AttachingConnector)connector;
                 }
             }else
             {
                 if (connector.name().equals("com.sun.jdi.SharedMemoryAttach")) {
                     return (AttachingConnector)connector;
                 }
             }
         }
         throw new Error("No launching connector");
     }

}
