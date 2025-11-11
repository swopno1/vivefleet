import { supabase } from '../lib/supabase.js';

/**
 * Registers a new user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
const register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([
        { id: user.id, username, email, public_key: null },
      ]);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    return res.status(201).json({ user, profile });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * Logs in an existing user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ user, session });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export { register, login };
