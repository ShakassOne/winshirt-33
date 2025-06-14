
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useDTFSupplierCheck } from '@/hooks/useDTFSupplierCheck';
import { enhancedErrorUtils } from '@/utils/enhancedSecurityHeaders';
import { Loader2 } from 'lucide-react';

interface EnhancedProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireDTFSupplier?: boolean;
  allowGuest?: boolean;
}

const EnhancedProtectedRoute: React.FC<EnhancedProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireDTFSupplier = false,
  allowGuest = false
}) => {
  const { user, isLoading: authLoading, session } = useOptimizedAuth();
  const { isAdmin, isLoading: adminLoading } = useAdminCheck();
  const { isDTFSupplier, isLoading: dtfLoading } = useDTFSupplierCheck();

  // Log access attempts for security monitoring
  useEffect(() => {
    if (!authLoading && !adminLoading && !dtfLoading) {
      const accessDetails = {
        userId: user?.id,
        userEmail: user?.email,
        isAdmin,
        isDTFSupplier,
        requireAdmin,
        requireDTFSupplier,
        allowGuest,
        path: window.location.pathname
      };

      if (!user && !allowGuest) {
        enhancedErrorUtils.logSecurityEvent('Unauthorized access attempt', accessDetails);
      } else if (requireAdmin && !isAdmin) {
        enhancedErrorUtils.logSecurityEvent('Admin access denied', accessDetails);
      } else if (requireDTFSupplier && !isDTFSupplier && !isAdmin) {
        enhancedErrorUtils.logSecurityEvent('DTF supplier access denied', accessDetails);
      }
    }
  }, [
    user, isAdmin, isDTFSupplier, requireAdmin, requireDTFSupplier, 
    allowGuest, authLoading, adminLoading, dtfLoading
  ]);

  // Show loading while checking authentication and permissions
  if (authLoading || (requireAdmin && adminLoading) || (requireDTFSupplier && dtfLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-winshirt-purple/20 via-transparent to-winshirt-blue/20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-winshirt-purple" />
          <p className="text-white/70">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated when required
  if (!user && !allowGuest) {
    return <Navigate to="/auth" replace />;
  }

  // Check admin permissions
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Check DTF supplier permissions
  if (requireDTFSupplier && !isDTFSupplier && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Validate session freshness for sensitive operations
  if ((requireAdmin || requireDTFSupplier) && session) {
    const sessionAge = Date.now() - new Date(session.expires_at || 0).getTime();
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours
    
    if (sessionAge > maxAge) {
      enhancedErrorUtils.logSecurityEvent('Session expired for sensitive operation', {
        sessionAge: sessionAge / 1000 / 60,
        userId: user?.id
      });
      return <Navigate to="/auth" replace />;
    }
  }

  return <>{children}</>;
};

export default EnhancedProtectedRoute;
