import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Create a server client for server-side auth
export async function createServerClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables.');
  }
  
  const cookieStore = cookies();
  
  return createClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value;
      },
      set(name, value, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Handle cookie errors in server components
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Handle cookie errors in server components
        }
      },
    },
  });
}