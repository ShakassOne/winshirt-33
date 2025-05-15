import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fonction pour rafraîchir manuellement la session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de la session:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST - avoid putting async logic directly in the callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        // Update state synchronously - no async operations here
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Defer additional actions via setTimeout to prevent UI freezes
        setTimeout(() => {
          // Afficher un toast pour les événements importants
          if (event === 'SIGNED_IN') {
            toast.success('Connexion réussie');
          } else if (event === 'SIGNED_OUT') {
            toast.info('Vous avez été déconnecté');
          } else if (event === 'USER_UPDATED') {
            toast.success('Votre compte a été mis à jour');
          }
        }, 0);
      }
    );

    // THEN check for existing session - keep this separate from the listener
    const checkExistingSession = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
      } catch (error) {
        console.error("Erreur lors de la récupération de la session:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkExistingSession();

    return () => {
      // Clean up subscription on unmount
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
