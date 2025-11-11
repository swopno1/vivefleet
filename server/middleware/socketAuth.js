import { supabase } from '../lib/supabase.js';

export const socketAuth = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    return next(new Error(`Authentication error: ${error.message}`));
  }

  if (!user) {
    return next(new Error('Authentication error: Invalid token'));
  }

  socket.user = user;
  next();
};
