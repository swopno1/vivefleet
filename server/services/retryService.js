import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';
import { activeUsers } from './socketService.js';

const RETRY_INTERVAL = 30000; // 30 seconds

const retryMessageDelivery = (io) => {
  setInterval(async () => {
    logger.info('Retrying pending messages...');
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('status', 'pending');

    if (error) {
      logger.error('Error fetching pending messages for retry:', error);
      return;
    }

    if (messages && messages.length > 0) {
      logger.info(`Found ${messages.length} pending messages to retry.`);
      for (const message of messages) {
        const recipientSocketId = activeUsers.get(message.to_user_id);
        if (recipientSocketId) {
          logger.info(`Attempting to redeliver message ${message.id} to user ${message.to_user_id}.`);
          io.to(recipientSocketId).emit('message:send', message);
          const { error: updateError } = await supabase
            .from('messages')
            .update({ status: 'delivered' })
            .eq('id', message.id);

          if (updateError) {
            logger.error(`Error updating message status on retry for message ${message.id}:`, updateError);
          } else {
            logger.info(`Successfully redelivered message ${message.id}.`);
          }
        }
      }
    } else {
      logger.info('No pending messages to retry.');
    }
  }, RETRY_INTERVAL);
};

export default retryMessageDelivery;
