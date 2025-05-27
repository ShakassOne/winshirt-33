
import React, { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOptimizedAuth } from "@/context/OptimizedAuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = memo(({ children, requireAdmin = false }) => {
  const { isAuthenticated, isLoading, user } = useOptimizedAuth();
  const location = useLocation();
  
  console.log('[ProtectedRoute] Auth state:', { isAuthenticated, isLoading, requireAdmin, path: location.pathname });
  
  // Wait for auth status to be verified
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Vérification de l'authentification..." />
      </div>
    );
  }
  
  // Redirect to login if not authenticated, preserving the intended destination
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to /auth');
    return <Navigate to={`/auth?from=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // Check admin permissions if required
  if (requireAdmin) {
    // For now, we'll check if user email contains "admin" or is a specific admin email
    // In a real app, you'd check against a roles table in your database
    const isAdmin = user?.email?.includes('admin') || 
                   user?.email === 'alan@shakass.com' ||
                   user?.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      console.log('[ProtectedRoute] User not admin, redirecting to home');
      return <Navigate to="/" replace />;
    }
  }
  
  // Show protected content if authenticated (and admin if required)
  console.log('[ProtectedRoute] User authenticated and authorized, showing protected content');
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
