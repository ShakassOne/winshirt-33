
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useDTFSupplierCheck } from '@/hooks/useDTFSupplierCheck';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireDTFSupplier?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireDTFSupplier = false
}) => {
  const { user, isLoading: authLoading } = useOptimizedAuth();
  const { isAdmin, isLoading: adminLoading } = useAdminCheck();
  const { isDTFSupplier, isLoading: dtfLoading } = useDTFSupplierCheck();

  if (authLoading || (requireAdmin && adminLoading) || (requireDTFSupplier && dtfLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireDTFSupplier && !isDTFSupplier && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
