import { supabase } from './supabase.js';

const RETRY_INTERVAL = 30000; // 30 seconds

const retryMessageDelivery = (io, activeUsers) => {
  setInterval(async () => {
    console.log('Retrying pending messages...');
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending messages for retry:', error);
      return;
    }

    if (messages && messages.length > 0) {
      console.log(`Found ${messages.length} pending messages to retry.`);
      for (const message of messages) {
        const recipientSocketId = activeUsers.get(message.to_user_id);
        if (recipientSocketId) {
          console.log(`Attempting to redeliver message ${message.id} to user ${message.to_user_id}.`);
          io.to(recipientSocketId).emit('message:send', message);
          const { error: updateError } = await supabase
            .from('messages')
            .update({ status: 'delivered' })
            .eq('id', message.id);

          if (updateError) {
            console.error(`Error updating message status on retry for message ${message.id}:`, updateError);
          } else {
            console.log(`Successfully redelivered message ${message.id}.`);
          }
        }
      }
    } else {
      console.log('No pending messages to retry.');
    }
  }, RETRY_INTERVAL);
};

export default retryMessageDelivery;
