import {
  handleConnection,
  handleDisconnect,
  handleSendMessage,
  handleMessageDelivered,
  handleNetworkStatus,
} from '../services/socketService.js';

export const registerEventHandlers = (io, socket) => {
  handleConnection(socket);

  socket.on('disconnect', () => handleDisconnect(socket));
  socket.on('message:send', (data) => handleSendMessage(io, socket, data));
  socket.on('message:delivered', (messageId) => handleMessageDelivered(messageId));
  socket.on('network:status', (data) => handleNetworkStatus(io, data));
};
