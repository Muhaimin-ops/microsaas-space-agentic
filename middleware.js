import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Create response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Check if this is a protected route
  const isProtectedRoute = pathname.startsWith('/dashboard');
  
  if (isProtectedRoute) {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      // If Supabase is not configured, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Create a Supabase client with the request cookies
    const supabase = createClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request,
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    });

    // Check if we have a session
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      // No user session, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};