
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any, user: User | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleAuthChange = useCallback((event: string, currentSession: Session | null) => {
    console.log(`[Auth] Auth state changed: ${event}`, currentSession ? 'User logged in' : 'User logged out');
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const setupAuth = async () => {
      console.log('[Auth] Setting up auth...');
      setIsLoading(true);
      
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
        
        // Then check for existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log('[Auth] Initial session check completed', initialSession ? 'User found' : 'No user');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }
        
        return () => {
          console.log('[Auth] Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('[Auth] Error setting up auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const cleanup = setupAuth();
    
    return () => {
      mounted = false;
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [handleAuthChange]);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('[Auth] Attempting sign in for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('[Auth] Sign in result:', error ? 'Error' : 'Success');
      return { error };
    } catch (error) {
      console.error('[Auth] Sign in error:', error);
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    console.log('[Auth] Attempting sign up for:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      console.log('[Auth] Sign up result:', error ? 'Error' : 'Success');
      return { error, user: data?.user || null };
    } catch (error) {
      console.error('[Auth] Sign up error:', error);
      return { error, user: null };
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log('[Auth] Attempting sign out');
    try {
      await supabase.auth.signOut();
      console.log('[Auth] Sign out completed');
    } catch (error) {
      console.error("[Auth] Sign out error:", error);
    }
    
    // Clear state regardless of API result
    setUser(null);
    setSession(null);
    
    // Clear local storage
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
