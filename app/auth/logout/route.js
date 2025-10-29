import { NextResponse } from 'next/server';
import { createServerClient } from '../../../lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerClient();
    
    await supabase.auth.signOut();
    
    return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }
}

export async function POST() {
  return GET();
}