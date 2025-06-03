
import { useState, useEffect } from 'react';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useDTFSupplierCheck = () => {
  const { user } = useOptimizedAuth();
  const [isDTFSupplier, setIsDTFSupplier] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDTFSupplierRole = async () => {
      if (!user) {
        setIsDTFSupplier(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check user role from the user_roles table
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .in('role', ['dtf_supplier', 'admin'])
          .maybeSingle();

        if (error) {
          console.error('Error checking DTF supplier role:', error);
          setIsDTFSupplier(false);
        } else {
          const userIsDTFSupplier = roleData !== null;
          setIsDTFSupplier(userIsDTFSupplier);
          
          console.log('[useDTFSupplierCheck] DTF supplier check result:', { 
            userId: user.id,
            email: user.email, 
            isDTFSupplier: userIsDTFSupplier 
          });
        }
      } catch (error) {
        console.error('Error in DTF supplier check:', error);
        setIsDTFSupplier(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkDTFSupplierRole();
  }, [user]);

  return { isDTFSupplier, isLoading };
};
