package salmir.util.concurrent;

import javax.swing.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

//This is a channel from a sender thread to a receiver thread
public class AsynchronousMessageChannel {

    int size;
    Map<String, BlockingQueue<Message>> asyncQueueMap;


    public AsynchronousMessageChannel(int size) {
        this.size = size;
        this.asyncQueueMap = new ConcurrentHashMap<String, BlockingQueue<Message>>();
    }

    public void sendAsyncMessage(List<String> tos, Message message){
        for (String to : tos){
            sendAsyncMessage(to, message);
        }

    }

    /* Methods are called by sender */
    //the sender just puts the message and gets back to its job. No wait!
    public void sendAsyncMessage(String to, Message message) {

        BlockingQueue<Message> asyncQueue = getAsyncQueue(to);
        boolean success = asyncQueue.offer(message);
        if (!success)
            throw new RuntimeException("AsyncQueue has not any more space to receive the new item.");
    }

    public Message getMessage(String id) {
        BlockingQueue<Message> asyncQueue = getAsyncQueue(id);
        return asyncQueue.poll();
    }


    protected BlockingQueue<Message> getAsyncQueue(String id){
        BlockingQueue<Message> bq = asyncQueueMap.get(id);
        if (bq == null){
            bq = new ArrayBlockingQueue(size);
            asyncQueueMap.put(id, bq);
        }
        return bq;
    }
}
