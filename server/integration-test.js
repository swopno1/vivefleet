import { io } from 'socket.io-client';
import config from './config/index.js';
import logger from './utils/logger.js';

const SERVER_URL = `http://localhost:${config.port}`;
const JWT_TOKEN = 'YOUR_JWT_TOKEN'; // Replace with a valid JWT token

const socket = io(SERVER_URL, {
  auth: {
    token: JWT_TOKEN,
  },
});

socket.on('connect', () => {
  logger.info('Test client connected to the server.');

  // Test sending a message
  const messageData = {
    toUserId: 'RECIPIENT_USER_ID', // Replace with a valid recipient user ID
    content: 'This is a test message from the integration test script.',
    timestamp: new Date().toISOString(),
  };

  socket.emit('message:send', messageData);
  logger.info('Test message sent:', messageData);
});

socket.on('message:send', (message) => {
  logger.info('Test client received a message:', message);
});

socket.on('message:sync', (messages) => {
  logger.info('Test client received synced messages:', messages);
});

socket.on('disconnect', () => {
  logger.info('Test client disconnected from the server.');
});

socket.on('connect_error', (err) => {
  logger.error('Test client connection error:', err.message);
});

// Test health endpoint
fetch(`${SERVER_URL}/health`)
  .then((res) => res.json())
  .then((data) => logger.info('Health check:', data))
  .catch((err) => logger.error('Health check error:', err));

// Test node ping endpoint
fetch(`${SERVER_URL}/nodes/ping`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 'test-node-123',
    ip_address: '127.0.0.1',
  }),
})
  .then((res) => res.json())
  .then((data) => logger.info('Node ping:', data))
  .catch((err) => logger.error('Node ping error:', err));
