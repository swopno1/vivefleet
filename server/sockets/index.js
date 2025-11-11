import { socketAuth } from '../middleware/socketAuth.js';
import { supabase } from '../lib/supabase.js';

const activeUsers = new Map();

export { activeUsers };

const initializeSocket = (io) => {
  io.use(socketAuth);

  io.on('connection', async (socket) => {
    const userId = socket.user.id;
    activeUsers.set(userId, socket.id);
    socket.broadcast.emit('user:online', { userId });

    // Deliver queued messages
    console.log(`User ${userId} connected, checking for offline messages.`);
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('to_user_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching offline messages:', error);
    }

    if (messages && messages.length > 0) {
      console.log(`Found ${messages.length} offline messages for user ${userId}.`);
      socket.emit('message:sync', messages);
      const messageIds = messages.map((m) => m.id);
      const { error: updateError } = await supabase
        .from('messages')
        .update({ status: 'delivered' })
        .in('id', messageIds);
      if (updateError) {
        console.error('Error marking messages as delivered:', updateError);
      } else {
        console.log(`Successfully marked ${messages.length} messages as delivered for user ${userId}.`);
      }
    } else {
      console.log(`No offline messages found for user ${userId}.`);
    }


    socket.on('message:send', async (data) => {
      const { toUserId, content, timestamp } = data;
      const fromUserId = socket.user.id;

      const { data: storedMessage, error } = await supabase
        .from('messages')
        .insert([{ from_user_id: fromUserId, to_user_id: toUserId, content, timestamp, status: 'pending' }])
        .select()
        .single();

      if (error) {
        console.error('Error storing message:', error);
        return;
      }


      const recipientSocketId = activeUsers.get(toUserId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('message:send', storedMessage);
        const { error: updateError } = await supabase
          .from('messages')
          .update({ status: 'delivered' })
          .eq('id', storedMessage.id);

        if (updateError) {
          console.error('Error updating message status:', updateError);
        }
      }
    });

    socket.on('message:delivered', async (messageId) => {
      const { error } = await supabase
        .from('messages')
        .update({ status: 'delivered' })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message status:', error);
      }
    });

    socket.on('disconnect', () => {
      activeUsers.delete(userId);
      socket.broadcast.emit('user:offline', { userId });
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export default initializeSocket;
