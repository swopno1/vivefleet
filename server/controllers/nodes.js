import { supabase } from '../lib/supabase.js';
import logger from '../utils/logger.js';

/**
 * Updates the status of a node.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
export const ping = async (req, res) => {
  const { id, ip_address } = req.body;
  if (!id || !ip_address) {
    return res.status(400).json({ error: 'Missing id or ip_address' });
  }

  try {
    const { data, error } = await supabase
      .from('nodes')
      .upsert({ id, ip_address, last_seen: new Date() }, { onConflict: 'id' });

    if (error) {
      logger.error('Error updating node:', error);
      return res.status(500).json({ error: 'Error updating node' });
    }

    res.status(200).json({ message: 'Node status updated' });
  } catch (error) {
    logger.error('Error in ping:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Gets a list of all nodes. (Admin only)
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
export const getNodes = async (req, res) => {
  // This is a placeholder for admin-only logic
  // In a real application, you would check for an admin role here
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data, error } = await supabase.from('nodes').select('*');

    if (error) {
      logger.error('Error fetching nodes:', error);
      return res.status(500).json({ error: 'Error fetching nodes' });
    }

    res.status(200).json(data);
  } catch (error) {
    logger.error('Error in getNodes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
