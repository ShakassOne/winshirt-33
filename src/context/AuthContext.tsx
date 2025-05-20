
import React, { createContext, useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    const setupAuth = async () => {
      setIsLoading(true);
      try {
        // Set up auth state listener FIRST to avoid race conditions
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state changed:", event);
            console.log("Session status:", currentSession ? "Active" : "None");
            
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
          }
        );

        // THEN check for existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession ? "Logged in" : "Not logged in");
        
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in user:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Sign in error:", error);
      } else {
        console.log("User signed in successfully:", data?.user?.id);
      }
      
      return { error };
    } catch (error) {
      console.error("Error during sign in:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log("Attempting to sign up user:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      
      if (error) {
        console.error("Sign up error:", error);
      } else {
        console.log("User signed up successfully:", data?.user?.id);
      }
      
      return { error, user: data?.user || null };
    } catch (error) {
      console.error("Error during sign up:", error);
      return { error, user: null };
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting to sign out user");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      // Explicitly clear user and session state
      setUser(null);
      setSession(null);
      
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error during sign out:", error);
      throw error;
    }
  };

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
