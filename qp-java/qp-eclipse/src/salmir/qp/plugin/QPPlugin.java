package salmir.qp.plugin;

import org.eclipse.core.runtime.IStatus;
import org.eclipse.core.runtime.Status;
import org.eclipse.jface.resource.ImageDescriptor;
import org.eclipse.ui.plugin.AbstractUIPlugin;
import org.osgi.framework.BundleContext;

import salmir.qp.core.IDebugSessionManager;
import salmir.qp.internal.core.DebugSessionManager;
import salmir.qp.standalone.Starter;

public class QPPlugin extends AbstractUIPlugin { 

	// The plug-in ID
	public static final String PLUGIN_ID = "salmir.qp.plugin";

	// The shared instance
	private static QPPlugin plugin;
	
	/**
	 * The constructor
	 */
	public QPPlugin() {
	}

	/*
	 * (non-Javadoc)
	 * @see org.eclipse.ui.plugin.AbstractUIPlugin#start(org.osgi.framework.BundleContext)
	 */
	public void start(BundleContext context) throws Exception {
		super.start(context);
		plugin = this;
		logInfo("QPPlugin starts ...");
	}

	/*
	 * (non-Javadoc)
	 * @see org.eclipse.ui.plugin.AbstractUIPlugin#stop(org.osgi.framework.BundleContext)
	 */
	public void stop(BundleContext context) throws Exception {
		plugin = null;
		super.stop(context);
		logInfo("QPPlugin stops.");
	}

	/**
	 * Returns the shared instance
	 *
	 * @return the shared instance
	 */
	public static QPPlugin getDefault() {
		return plugin;
	}

	/**
	 * Returns an image descriptor for the image file at the given
	 * plug-in relative path
	 *
	 * @param path the path
	 * @return the image descriptor
	 */
	public static ImageDescriptor getImageDescriptor(String path) {
		return imageDescriptorFromPlugin(PLUGIN_ID, path);
	}
	
	//TODO check these links for a more comprehensive logging approach
	// http://ekkes-corner.blogspot.com/2008/09/logging-in-osgi-enterprise-applications.html
	// http://stackoverflow.com/questions/223875/logging-in-eclipse-osgi-plugins
	public static void logInfo(String message){
		logInfo(message, null);
	}

	public static void logInfo(String message, Exception exception){
		plugin.getLog().log(
				new Status(IStatus.INFO, plugin.PLUGIN_ID, IStatus.OK,
		         message, exception));
	}
}
