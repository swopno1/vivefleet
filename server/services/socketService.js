import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

/**
 * A map of active users.
 * @type {Map<string, string>}
 */
export const activeUsers = new Map();

/**
 * Handles a new socket connection.
 * @param {import('socket.io').Socket} socket - The socket object.
 */
export const handleConnection = async (socket) => {
  const userId = socket.user.id;
  activeUsers.set(userId, socket.id);
  socket.broadcast.emit('user:online', { userId });
  logger.info(`User ${userId} connected.`);

  await syncOfflineMessages(socket);
};

/**
 * Handles a socket disconnection.
 * @param {import('socket.io').Socket} socket - The socket object.
 */
export const handleDisconnect = (socket) => {
  const userId = socket.user.id;
  activeUsers.delete(userId);
  socket.broadcast.emit('user:offline', { userId });
  logger.info(`User ${userId} disconnected.`);
};

/**
 * Handles a new message from a client.
 * @param {import('socket.io').Server} io - The Socket.IO server instance.
 * @param {import('socket.io').Socket} socket - The socket object.
 * @param {object} data - The message data.
 * @param {string} data.toUserId - The ID of the user to send the message to.
 * @param {string} data.content - The content of the message.
 * @param {string} data.timestamp - The timestamp of the message.
 */
export const handleSendMessage = async (io, socket, data) => {
  const { toUserId, content, timestamp } = data;
  const fromUserId = socket.user.id;

  const { data: storedMessage, error } = await supabase
    .from('messages')
    .insert([{ from_user_id: fromUserId, to_user_id: toUserId, content, timestamp, status: 'pending' }])
    .select()
    .single();

  if (error) {
    logger.error('Error storing message:', error);
    return;
  }

  const recipientSocketId = activeUsers.get(toUserId);
  if (recipientSocketId) {
    io.to(recipientSocketId).emit('message:send', storedMessage);
    await markMessageAsDelivered(storedMessage.id);
  }
};

/**
 * Handles a message delivered event from a client.
 * @param {string} messageId - The ID of the message that was delivered.
 */
export const handleMessageDelivered = async (messageId) => {
  await markMessageAsDelivered(messageId);
};

/**
 * Handles a network status update from a client.
 * @param {import('socket.io').Server} io - The Socket.IO server instance.
 * @param {object} data - The network status data.
 */
export const handleNetworkStatus = (io, data) => {
  io.emit('network:status', data);
};

const syncOfflineMessages = async (socket) => {
  const userId = socket.user.id;
  logger.info(`Checking for offline messages for user ${userId}.`);

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('to_user_id', userId)
    .eq('status', 'pending');

  if (error) {
    logger.error('Error fetching offline messages:', error);
    return;
  }

  if (messages && messages.length > 0) {
    logger.info(`Found ${messages.length} offline messages for user ${userId}.`);
    socket.emit('message:sync', messages);
    const messageIds = messages.map((m) => m.id);
    await markMessagesAsDelivered(messageIds);
  } else {
    logger.info(`No offline messages found for user ${userId}.`);
  }
};

const markMessageAsDelivered = async (messageId) => {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'delivered' })
    .eq('id', messageId);

  if (error) {
    logger.error(`Error marking message ${messageId} as delivered:`, error);
  }
};

const markMessagesAsDelivered = async (messageIds) => {
  const { error } = await supabase
    .from('messages')
    .update({ status: 'delivered' })
    .in('id', messageIds);

  if (error) {
    logger.error('Error marking messages as delivered:', error);
  } else {
    logger.info(`Successfully marked ${messageIds.length} messages as delivered.`);
  }
};
