package salmir.tmp;
import java.io.File;


public class DeleteSVNFolders {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
        String path = "C:/Users/salmir/Desktop/tod2";
        File dir = new File(path);
        removeSVNDir(dir);
	}
	
	public static void removeSVNDir(File dir){
		File[] children = dir.listFiles();
		for (File child: children){
			if (child.isDirectory())
				if (child.getName().equals(".svn")){
					System.out.print(child.getPath());
					emptyDir(child);
					boolean deleted = child.delete();
					if (deleted)
					    System.out.println(" deleted!");
				}else
					removeSVNDir(child);
		}
	}
	
	public static void emptyDir(File dir){
		File[] children = dir.listFiles();
		for (File child: children){
			if (child.isDirectory())
				emptyDir(child);
			child.delete();
	    }
	}

}
