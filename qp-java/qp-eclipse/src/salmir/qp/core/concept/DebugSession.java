package salmir.qp.core.concept;

import salmir.qp.conf.DebugConfig;

import java.util.List;


public interface DebugSession {
	
    public Querypoint addQuerypoint();

    public void startReproduction();

    public void pauseReproduction();

    public void resumeReproduction();

    public void stopReproduction();

    public void reproduce();

    public void destroy();

    public boolean isReproductionAlive();

    public boolean isReproductionPaused();

    public boolean isReproductionStopped();

    public long getReproductionLifeTime();

    public long getReproductionLiveTime();
}
