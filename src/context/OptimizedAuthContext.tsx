
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, additionalData?: any) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const OptimizedAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, additionalData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: additionalData
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return { user: null, error };
      }
      
      if (data.user) {
        toast.success('Compte créé avec succès !');
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Unexpected signup error:', error);
      const authError = error as AuthError;
      toast.error('Erreur lors de la création du compte');
      return { user: null, error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return { user: null, error };
      }
      
      if (data.user) {
        toast.success('Connexion réussie !');
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Unexpected login error:', error);
      const authError = error as AuthError;
      toast.error('Erreur lors de la connexion');
      return { user: null, error: authError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Erreur lors de la déconnexion');
        throw error;
      }
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Unexpected logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth?mode=reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Email de réinitialisation envoyé !');
      return { error: null };
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      const authError = error as AuthError;
      toast.error('Erreur lors de la réinitialisation');
      return { error: authError };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useOptimizedAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useOptimizedAuth must be used within an OptimizedAuthProvider');
  }
  return context;
};
