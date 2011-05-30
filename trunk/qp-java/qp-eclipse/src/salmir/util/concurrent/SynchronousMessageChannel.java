package salmir.util.concurrent;

import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.SynchronousQueue;

//This is a channel from a sender thread to a receiver thread
public class SynchronousMessageChannel {

    int size;
    Map<String, BlockingQueue<Message>> syncQueueMap;


    public SynchronousMessageChannel(int size) {
        this.size = size;
        this.syncQueueMap = new ConcurrentHashMap<String, BlockingQueue<Message>>();
    }


    //the sender thread should wait until the receiver thread gets the message
    //At the momement this method has not been used.
    public void sendSyncMessage(Message message, String to) {
        BlockingQueue<Message> syncQueue = getSyncQueue(to);
        boolean success = false;
        try {
            syncQueue.put(message);
            success = true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); //to preserve interrupted info for thread
            throw new RuntimeException("Thread is interrupted and message did not send.", e);
        }
    }

    //the sender thread waits until it is processed
    public void sendAndWait(Message message, String to) {
        sendSyncMessage(message, to);
        while (message.isProcessed() == false) {
            try {
                message.wait();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); //to preserve interrupted info for thread
                throw new RuntimeException("Thread is interrupted and message is not processed yet.", e);
            }
        }
    }

    /* Methods are called by receiver */

    // to call notifyAll on this object the caller thread should
    // have this object's monitor. Synchronized keyword
    // is added to this method for this purpose

    public synchronized void messageProcessed(Message message) {
        message.setProcessed(true);
        message.notifyAll();
    }


    public Message getMessage(String id) {
        BlockingQueue<Message> asyncQueue = getSyncQueue(id);
        return asyncQueue.poll();
    }

    protected BlockingQueue<Message> getSyncQueue(String id){
        BlockingQueue<Message> bq = syncQueueMap.get(id);
        if (bq == null){
            bq = new SynchronousQueue();
            syncQueueMap.put(id, bq);
        }
        return bq;
    }

}
