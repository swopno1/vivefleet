import { socketAuth } from '../middleware/socketAuth.js';
import { registerEventHandlers } from './eventHandlers.js';
import { activeUsers } from '../services/socketService.js';

export { activeUsers };

const initializeSocket = (io) => {
  io.use(socketAuth);
  io.on('connection', (socket) => {
    registerEventHandlers(io, socket);
  });
};

export default initializeSocket;
