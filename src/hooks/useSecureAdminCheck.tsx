
import { useState, useEffect } from 'react';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';

export const useSecureAdminCheck = () => {
  const { user } = useOptimizedAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Fallback admin check using email for now
        // TODO: Replace with proper role-based system once user_roles table is available
        const adminEmails = ['alan@shakass.com', 'admin@example.com'];
        const userIsAdmin = adminEmails.includes(user.email || '');
        setIsAdmin(userIsAdmin);
        
        console.log('[useSecureAdminCheck] Admin check result:', { 
          email: user.email, 
          isAdmin: userIsAdmin 
        });
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, isLoading };
};
