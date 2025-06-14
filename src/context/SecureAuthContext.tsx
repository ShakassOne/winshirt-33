
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { enhancedErrorUtils, enhancedRateLimiter, passwordValidator, inputSanitizer } from '@/utils/enhancedSecurityHeaders';

interface SecureAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, additionalData?: any) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const SecureAuthContext = createContext<SecureAuthContextType | undefined>(undefined);

export const SecureAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
      // Rate limiting check
      const rateLimitKey = `signup_${email}`;
      const rateCheck = enhancedRateLimiter.checkRateLimit(rateLimitKey, 3, 300000); // 3 attempts per 5 minutes
      
      if (!rateCheck.allowed) {
        const error = new Error('Trop de tentatives d\'inscription. Veuillez réessayer plus tard.') as AuthError;
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { user: null, error };
      }

      // Validate email
      const emailValidation = inputSanitizer.validateEmail(email);
      if (!emailValidation.isValid) {
        const error = new Error(emailValidation.error) as AuthError;
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { user: null, error };
      }

      // Validate password strength
      const passwordValidation = passwordValidator.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        const error = new Error(passwordValidation.feedback.join('. ')) as AuthError;
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { user: null, error };
      }

      // Sanitize additional data
      const sanitizedData = additionalData ? {
        first_name: inputSanitizer.sanitizeUserInput(additionalData.first_name || '', 50),
        last_name: inputSanitizer.sanitizeUserInput(additionalData.last_name || '', 50),
      } : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: sanitizedData
        }
      });
      
      if (error) {
        enhancedErrorUtils.logSecurityEvent('Signup failed', { email, error: error.message });
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { user: null, error };
      }
      
      if (data.user) {
        enhancedRateLimiter.resetRateLimit(rateLimitKey);
        toast.success('Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.');
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      enhancedErrorUtils.logSecurityEvent('Unexpected signup error', error);
      const authError = error as AuthError;
      toast.error(enhancedErrorUtils.getUserFriendlyError(authError));
      return { user: null, error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Rate limiting check
      const rateLimitKey = `signin_${email}`;
      const rateCheck = enhancedRateLimiter.checkRateLimit(rateLimitKey, 5, 900000); // 5 attempts per 15 minutes
      
      if (!rateCheck.allowed) {
        const error = new Error('Trop de tentatives de connexion. Veuillez réessayer plus tard.') as AuthError;
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { user: null, error };
      }

      // Validate email
      const emailValidation = inputSanitizer.validateEmail(email);
      if (!emailValidation.isValid) {
        const error = new Error(emailValidation.error) as AuthError;
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { user: null, error };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        enhancedErrorUtils.logSecurityEvent('Login failed', { email, error: error.message });
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { user: null, error };
      }
      
      if (data.user) {
        enhancedRateLimiter.resetRateLimit(rateLimitKey);
        toast.success('Connexion réussie !');
      }
      
      return { user: data.user, error: null };
    } catch (error) {
      enhancedErrorUtils.logSecurityEvent('Unexpected login error', error);
      const authError = error as AuthError;
      toast.error(enhancedErrorUtils.getUserFriendlyError(authError));
      return { user: null, error: authError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        enhancedErrorUtils.logSecurityEvent('Logout error', error);
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        throw error;
      }
      toast.success('Déconnexion réussie');
    } catch (error) {
      enhancedErrorUtils.logSecurityEvent('Unexpected logout error', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Rate limiting check
      const rateLimitKey = `reset_${email}`;
      const rateCheck = enhancedRateLimiter.checkRateLimit(rateLimitKey, 2, 600000); // 2 attempts per 10 minutes
      
      if (!rateCheck.allowed) {
        const error = new Error('Trop de demandes de réinitialisation. Veuillez réessayer plus tard.') as AuthError;
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { error };
      }

      // Validate email
      const emailValidation = inputSanitizer.validateEmail(email);
      if (!emailValidation.isValid) {
        const error = new Error(emailValidation.error) as AuthError;
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { error };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth?mode=reset-password`,
      });
      
      if (error) {
        enhancedErrorUtils.logSecurityEvent('Password reset error', { email, error: error.message });
        toast.error(enhancedErrorUtils.getUserFriendlyError(error));
        return { error };
      }
      
      toast.success('Email de réinitialisation envoyé ! Vérifiez votre boîte de réception.');
      return { error: null };
    } catch (error) {
      enhancedErrorUtils.logSecurityEvent('Unexpected password reset error', error);
      const authError = error as AuthError;
      toast.error(enhancedErrorUtils.getUserFriendlyError(authError));
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

  return <SecureAuthContext.Provider value={value}>{children}</SecureAuthContext.Provider>;
};

export const useSecureAuth = () => {
  const context = useContext(SecureAuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
};
