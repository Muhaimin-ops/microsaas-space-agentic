import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured. Set SUPABASE_URL and SUPABASE_KEY in environment.');
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase not configured. Please set SUPABASE_URL and SUPABASE_KEY environment variables.');
  }
  return supabase;
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
