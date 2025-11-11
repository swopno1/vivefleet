import { supabase } from '../lib/supabase.js';

export const getMessageHistory = async (req, res) => {
  const { userId: otherUserId } = req.params;
  const currentUserId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`(from_user_id.eq.${currentUserId},and(to_user_id.eq.${otherUserId})), (from_user_id.eq.${otherUserId},and(to_user_id.eq.${currentUserId}))`)
      .order('timestamp', { ascending: true });

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ error: 'Failed to fetch message history' });
  }
};
