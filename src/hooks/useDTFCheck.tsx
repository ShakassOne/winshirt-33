
import { useState, useEffect } from 'react';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useDTFCheck = () => {
  const { user } = useOptimizedAuth();
  const [isDTFSupplier, setIsDTFSupplier] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDTFRole = async () => {
      if (!user) {
        setIsDTFSupplier(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'dtf_supplier')
          .maybeSingle();

        if (error) {
          console.error('Error checking DTF role:', error);
          setIsDTFSupplier(false);
        } else {
          const userIsDTFSupplier = roleData !== null;
          setIsDTFSupplier(userIsDTFSupplier);
          
          console.log('[useDTFCheck] DTF check result:', { 
            userId: user.id,
            email: user.email, 
            isDTFSupplier: userIsDTFSupplier 
          });
        }
      } catch (error) {
        console.error('Error in DTF check:', error);
        setIsDTFSupplier(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkDTFRole();
  }, [user]);

  return { isDTFSupplier, isLoading };
};
