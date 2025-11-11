import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/index.js';
import logger from './utils/logger.js';

const app = express();

// Middleware
app.use(cors({ origin: config.frontendUrl }));
app.use(helmet());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`[HTTP] ${req.method} ${req.originalUrl}`);
  next();
});

import initializeSocket from './sockets/index.js';
import retryMessageDelivery from './services/retryService.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
  },
});

initializeSocket(io);
retryMessageDelivery(io);

import routes from './routes/index.js';

app.use(routes);

server.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
