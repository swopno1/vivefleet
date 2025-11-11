import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

let supabase;

if (config.supabaseUrl && config.supabaseKey && config.supabaseUrl.startsWith('http')) {
  supabase = createClient(config.supabaseUrl, config.supabaseKey);
} else {
  logger.warn('Supabase URL or Key not provided or invalid. Supabase client not initialized.');
  supabase = {
    auth: {
      signUp: () => Promise.resolve({ error: { message: 'Supabase not initialized' } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not initialized' } }),
      getUser: () => Promise.resolve({ error: { message: 'Supabase not initialized' } }),
    },
    from: () => ({
      insert: () => Promise.resolve({ error: { message: 'Supabase not initialized' } }),
    }),
  };
}

export { supabase };
