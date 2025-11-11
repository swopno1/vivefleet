import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

/**
 * Gets the message history between the current user and another user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
export const getMessageHistory = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`(from_user_id.eq.${currentUserId},and(to_user_id.eq.${userId})), (from_user_id.eq.${userId},and(to_user_id.eq.${currentUserId}))`)
      .order('timestamp', { ascending: true });

    if (error) {
      logger.error('Error fetching message history:', error);
      return res.status(500).json({ error: 'Error fetching message history' });
    }

    res.status(200).json(data);
  } catch (error) {
    logger.error('Error in getMessageHistory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
