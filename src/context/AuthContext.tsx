import logger from '@/utils/logger';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  const isInitializedRef = useRef(false);

  const handleAuthChange = useCallback((event: string, currentSession: Session | null) => {
    logger.log(`[Auth] Auth state changed: ${event}`, currentSession ? 'User logged in' : 'User logged out');
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    
    // Mark as initialized after first auth event
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    logger.log('[Auth] Setting up auth...');
    
    let cleanup: (() => void) | undefined;
    
    const setupAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
        cleanup = () => subscription.unsubscribe();
        
        // Then check for existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        logger.log('[Auth] Initial session check completed', initialSession ? 'User found' : 'No user');
        
        // Update state and mark as initialized
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        isInitializedRef.current = true;
        setIsLoading(false);
        
      } catch (error) {
        console.error('[Auth] Error setting up auth:', error);
        setIsLoading(false);
      }
    };

    setupAuth();
    
    return () => {
      logger.log('[Auth] Cleaning up auth subscription');
      cleanup?.();
    };
  }, [handleAuthChange]);

  const signIn = useCallback(async (email: string, password: string) => {
    logger.log('[Auth] Attempting sign in for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      logger.log('[Auth] Sign in result:', error ? 'Error' : 'Success');
      return { error };
    } catch (error) {
      console.error('[Auth] Sign in error:', error);
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    logger.log('[Auth] Attempting sign up for:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      logger.log('[Auth] Sign up result:', error ? 'Error' : 'Success');
      return { error, user: data?.user || null };
    } catch (error) {
      console.error('[Auth] Sign up error:', error);
      return { error, user: null };
    }
  }, []);

  const signOut = useCallback(async () => {
    logger.log('[Auth] Attempting sign out');
    try {
      await supabase.auth.signOut();
      logger.log('[Auth] Sign out completed');
      
      // Clear state
      setUser(null);
      setSession(null);
      
      
    } catch (error) {
      console.error("[Auth] Sign out error:", error);
      // Still clear local state even if API call fails
      setUser(null);
      setSession(null);
    }
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
