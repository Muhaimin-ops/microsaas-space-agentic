import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY in environment.');
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    console.error('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY environment variables.');
    return null;
  }
  return supabase;
}

// Create a browser client for client-side auth
export function createBrowserClient() {
  // For client-side, we need the NEXT_PUBLIC_ prefixed variables
  const clientUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clientKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  
  if (!clientUrl || !clientKey) {
    console.error('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY environment variables.');
    return null;
  }
  return createClient(clientUrl, clientKey);
}

// Sign up a new user with metadata
export async function signUp(email, password, metadata = {}) {
  const client = createBrowserClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  
  if (error) throw error;
  
  // If successful, also insert user into the users table
  if (data.user) {
    const { error: insertError } = await client
      .from('users')
      .insert([{
        id: data.user.id,
        email: data.user.email,
        name: metadata.name || null,
        role: metadata.role || 'founder',
      }]);
    
    if (insertError) {
      console.error('Error inserting user into users table:', insertError);
    }
  }
  
  return data;
}

// Sign in an existing user
export async function signIn(email, password) {
  const client = createBrowserClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

// Sign out the current user
export async function signOut() {
  const client = createBrowserClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

// Get the current user
export async function getUser() {
  const client = createBrowserClient();
  if (!client) {
    return null;
  }
  const { data: { user }, error } = await client.auth.getUser();
  
  if (error) throw error;
  return user;
}

// Get the current session
export async function getSession() {
  const client = createBrowserClient();
  if (!client) {
    return null;
  }
  const { data: { session }, error } = await client.auth.getSession();
  
  if (error) throw error;
  return session;
}

// Send password reset email
export async function resetPassword(email) {
  const client = createBrowserClient();
  if (!client) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });
  
  if (error) throw error;
  return data;
}

export async function insertIdea(idea) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('validated_ideas')
    .insert([idea])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateIdea(id, updates) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('validated_ideas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getIdea(id) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('validated_ideas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function insertBlueprint(blueprint) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('blueprints')
    .insert([blueprint])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getCachedData(cacheKey) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('cache')
    .select('cache_value, expires_at')
    .eq('cache_key', cacheKey)
    .single();
  
  if (error || !data) return null;
  
  if (new Date(data.expires_at) < new Date()) {
    return null;
  }
  
  return data.cache_value;
}

export async function setCachedData(cacheKey, cacheValue, ttlSeconds = 3600) {
  const client = getSupabaseClient();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  
  const { error } = await client
    .from('cache')
    .upsert({
      cache_key: cacheKey,
      cache_value: cacheValue,
      expires_at: expiresAt
    }, {
      onConflict: 'cache_key'
    });
  
  if (error) throw error;
}
