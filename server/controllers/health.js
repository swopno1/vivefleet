import logger from '../utils/logger.js';

let startTime = new Date();

/**
 * Gets the health status of the server.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
export const getHealth = (req, res) => {
  try {
    const uptime = (new Date() - startTime) / 1000;
    res.status(200).json({ status: 'ok', uptime });
  } catch (error) {
    logger.error('Error in getHealth:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
