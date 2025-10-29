"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "../../lib/supabase";

const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient();
    
    if (!supabase) {
      console.warn('Supabase is not configured. Auth features will be disabled.');
      setLoading(false);
      return;
    }
    
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          // Fetch additional user details from the users table
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData) {
            setUserDetails(userData);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange?.(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Fetch additional user details
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userData) {
            setUserDetails(userData);
          }
        } else {
          setUser(null);
          setUserDetails(null);
        }
        
        if (event === 'SIGNED_OUT') {
          router.push('/auth/login');
        }
      }
    ) || {};

    // Cleanup subscription on unmount
    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [router]);

  const signOut = async () => {
    const supabase = createBrowserClient();
    if (!supabase) {
      console.warn('Supabase not configured');
      return;
    }
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserDetails(null);
      router.push('/auth/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshUser = async () => {
    const supabase = createBrowserClient();
    if (!supabase) {
      console.warn('Supabase not configured');
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch additional user details
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (userData) {
          setUserDetails(userData);
        }
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const value = {
    user: user ? { ...user, ...userDetails } : null,
    loading,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}