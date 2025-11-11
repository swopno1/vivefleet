import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

export const socketAuth = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    logger.warn('Socket connection attempt with no token.');
    return next(new Error('Authentication error: No token provided'));
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      logger.warn(`Socket authentication failed for token: ${token}`, { error });
      return next(new Error(`Authentication error: ${error.message}`));
    }

    if (!user) {
      logger.warn(`Socket authentication failed for token: ${token}`);
      return next(new Error('Authentication error: Invalid token'));
    }

    socket.user = user;
    next();
  } catch (error) {
    logger.error('Internal server error during socket authentication.', { error });
    next(new Error('Internal server error'));
  }
};
