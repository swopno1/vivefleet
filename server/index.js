import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Custom logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

import initializeSocket from './sockets/index.js';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Be more specific in production
  },
});

initializeSocket(io);

const PORT = process.env.PORT || 4000;

import routes from './routes/index.js';

app.use('/api', routes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
