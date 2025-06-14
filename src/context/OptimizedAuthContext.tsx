import logger from '@/utils/logger';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedAuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any, user: User | null }>;
  signOut: () => Promise<void>;
}

const OptimizedAuthContext = createContext<OptimizedAuthContextType | undefined>(undefined);

export const useOptimizedAuth = () => {
  const context = useContext(OptimizedAuthContext);
  if (context === undefined) {
    throw new Error('useOptimizedAuth must be used within an OptimizedAuthProvider');
  }
  return context;
};

export const OptimizedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isInitializedRef = useRef(false);
  const authStateListenerRef = useRef<any>(null);

  const handleAuthChange = useCallback((event: string, currentSession: Session | null) => {
    logger.log(`[OptimizedAuth] Auth state changed: ${event}`, currentSession ? 'User logged in' : 'User logged out');
    
    // Stabilisation des mises à jour d'état
    setSession(prev => {
      if (prev?.access_token === currentSession?.access_token) {
        return prev; // Évite les mises à jour inutiles
      }
      return currentSession;
    });
    
    setUser(prev => {
      const newUser = currentSession?.user ?? null;
      if (prev?.id === newUser?.id) {
        return prev; // Évite les mises à jour inutiles
      }
      return newUser;
    });
    
    // Marquer comme initialisé après le premier événement
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    logger.log('[OptimizedAuth] Setting up optimized auth...');
    
    let isActive = true;
    
    const setupAuth = async () => {
      try {
        // Configuration du listener d'état d'auth en premier
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
        authStateListenerRef.current = subscription;
        
        // Vérification de la session existante
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (isActive) {
          logger.log('[OptimizedAuth] Initial session check completed', initialSession ? 'User found' : 'No user');
          
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          isInitializedRef.current = true;
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error('[OptimizedAuth] Error setting up auth:', error);
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    setupAuth();
    
    return () => {
      isActive = false;
      logger.log('[OptimizedAuth] Cleaning up auth subscription');
      authStateListenerRef.current?.unsubscribe();
    };
  }, [handleAuthChange]);

  const signIn = useCallback(async (email: string, password: string) => {
    logger.log('[OptimizedAuth] Attempting sign in for:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      logger.log('[OptimizedAuth] Sign in result:', error ? 'Error' : 'Success');
      return { error };
    } catch (error) {
      console.error('[OptimizedAuth] Sign in error:', error);
      return { error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    logger.log('[OptimizedAuth] Attempting sign up for:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      logger.log('[OptimizedAuth] Sign up result:', error ? 'Error' : 'Success');
      return { error, user: data?.user || null };
    } catch (error) {
      console.error('[OptimizedAuth] Sign up error:', error);
      return { error, user: null };
    }
  }, []);

  const signOut = useCallback(async () => {
    logger.log('[OptimizedAuth] Attempting sign out');
    try {
      await supabase.auth.signOut();
      logger.log('[OptimizedAuth] Sign out completed');
      
      // Nettoyage optimisé de l'état
      setUser(null);
      setSession(null);
      
    } catch (error) {
      console.error("[OptimizedAuth] Sign out error:", error);
      // Nettoyer l'état local même si l'appel API échoue
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

  return <OptimizedAuthContext.Provider value={value}>{children}</OptimizedAuthContext.Provider>;
};

export default OptimizedAuthProvider;
