package salmir.qp.plugin.basics;

import org.eclipse.debug.core.DebugPlugin;

import salmir.qp.core.concept.DebugTarget;
import salmir.qp.core.concept.Reproducer;
import salmir.qp.core.concept.ReproductionException;

public class EclipseReproducer implements Reproducer {

	@Override
	public boolean reproduce() throws ReproductionException {
		DebugPlugin.getDefault().getLaunchManager();
		return false;
	}

	@Override
	public boolean endReproduction() {
		return false;
	}

	@Override
	public DebugTarget getDebugTarget(String name) {
		return null;
	}

}
