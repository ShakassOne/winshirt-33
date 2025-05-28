
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';

export const useAdminCheck = () => {
  const { user } = useOptimizedAuth();
  
  const isAdmin = user?.email?.includes('admin') || 
                  user?.email === 'alan@shakass.com' ||
                  user?.user_metadata?.role === 'admin';
  
  return { isAdmin };
};
