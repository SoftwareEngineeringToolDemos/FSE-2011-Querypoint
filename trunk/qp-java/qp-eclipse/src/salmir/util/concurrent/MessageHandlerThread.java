package salmir.util.concurrent;

public class MessageHandlerThread {

    String id;
    MessageHandler messageHandler;
    public MessageHandlerThread(String id, MessageHandler messageHandler){
        this.id = id;
        this.messageHandler = messageHandler;
    }

    
}
