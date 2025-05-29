
import { useSecureAdminCheck } from '@/hooks/useSecureAdminCheck';

export const useAdminCheck = () => {
  const { isAdmin, isLoading } = useSecureAdminCheck();
  
  return { isAdmin, isLoading };
};
