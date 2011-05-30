package salmir.qp.core.concept;


public interface Reproducer {

    //initialize
	public Reproduction reproduce() throws ReproductionException;

	public boolean endReproduction(Reproduction reproduction);

}
