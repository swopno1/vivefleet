import winston from 'winston';
import 'winston-daily-rotate-file';
import config from '../config/index.js';

const transport = new winston.transports.DailyRotateFile({
  filename: 'server-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    transport,
  ],
});

export default logger;
