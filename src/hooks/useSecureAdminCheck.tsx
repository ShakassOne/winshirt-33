
import { useState, useEffect } from 'react';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { supabase } from '@/integrations/supabase/client';

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
        // Check user role from the user_roles table
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          const userIsAdmin = roleData !== null;
          setIsAdmin(userIsAdmin);
          
          console.log('[useSecureAdminCheck] Admin check result:', { 
            userId: user.id,
            email: user.email, 
            isAdmin: userIsAdmin 
          });
        }
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
