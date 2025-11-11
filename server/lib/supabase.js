import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase URL or Key not provided or invalid. Supabase client not initialized.');
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
