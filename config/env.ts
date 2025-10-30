import "dotenv/config";

export const ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_KEY: process.env.SUPABASE_KEY || "",
  API_URL: process.env.API_URL || "",
};
