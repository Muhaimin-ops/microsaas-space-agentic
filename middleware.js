import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Role permissions mapping - defines which dashboard sections each role can access
const rolePermissions = {
  admin: ['*'], // Admin has access to all routes
  founder: ['', 'ideas', 'blueprints', 'profile'],
  developer: ['', 'blueprints', 'deployments', 'profile'],
  marketer: ['', 'analytics', 'settings', 'profile']
};

// Helper function to get user role from various sources
function getUserRole(user, userData) {
  // Check multiple places where role might be stored
  if (userData?.role) return userData.role;
  if (user?.user_metadata?.role) return user.user_metadata.role;
  if (user?.app_metadata?.role) return user.app_metadata.role;
  return 'founder'; // Default role for new users
}

// Helper function to check if role has permission for path
function hasPermission(role, pathname) {
  if (!role || !rolePermissions[role]) return false;
  
  // Admin can access everything
  if (rolePermissions[role].includes('*')) return true;
  
  // Extract the dashboard section from the path
  // e.g., /dashboard/settings -> settings
  const dashboardPath = pathname.replace(/^\/dashboard\/?/, '').split('/')[0] || '';
  
  // Check if the role has access to this section
  return rolePermissions[role].includes(dashboardPath);
}

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
      // If Supabase is not configured, redirect to login with error message
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('error', 'supabase_not_configured');
      return NextResponse.redirect(loginUrl);
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
    
    // Fetch user details from the users table to get role
    let userRole = 'founder'; // Default role
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      userRole = getUserRole(user, userData);
    } catch (error) {
      // If we can't fetch user data, try to get role from auth metadata
      userRole = getUserRole(user, null);
    }
    
    // Check role-based access for dashboard routes
    // Allow access to /dashboard (root) for all authenticated users
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      // Add role to response headers for client-side use
      response.headers.set('X-User-Role', userRole);
      return response;
    }
    
    // Check if user has permission to access this dashboard section
    if (!hasPermission(userRole, pathname)) {
      // Create an unauthorized response that shows access denied
      const url = new URL('/dashboard', request.url);
      url.searchParams.set('error', 'unauthorized');
      url.searchParams.set('attempted', pathname);
      url.searchParams.set('role', userRole);
      return NextResponse.redirect(url);
    }
    
    // Add role to response headers for client-side use
    response.headers.set('X-User-Role', userRole);
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};