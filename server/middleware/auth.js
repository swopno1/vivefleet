import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    logger.warn('Authentication attempt with no token.');
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      logger.warn(`Authentication failed for token: ${token}`, { error });
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Internal server error during authentication.', { error });
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export { authenticateUser };
