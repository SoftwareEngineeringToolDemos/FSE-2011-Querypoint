package salmir.util;

import salmir.util.concurrent.AsynchronousMessageChannel;


public class AppContext {
    public static final int SYSTEM_ARGS = 0;
    public static final int ASYNC_CHANNEL = 10;

    private static int length = 100;
    private static Object[] objects = new Object[length];

    //id should not be less than 0 or greater than length-1
    public static void set(int id, Object obj) {
        objects[id] = obj;
    }

    public static Object get(int id) {
        return objects[id];
    }

    public static String[] getSystemArgs() {
        return (String[]) get(AppContext.SYSTEM_ARGS);
    }

    public static AsynchronousMessageChannel getAsyncChannel() {
        return ((AsynchronousMessageChannel) get(AppContext.ASYNC_CHANNEL));
    }


}
