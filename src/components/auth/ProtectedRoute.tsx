
import React, { memo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useOptimizedAuth } from "@/context/OptimizedAuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = memo(({ children }) => {
  const { isAuthenticated, isLoading } = useOptimizedAuth();
  const location = useLocation();
  
  console.log('[ProtectedRoute] Auth state:', { isAuthenticated, isLoading, path: location.pathname });
  
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
  
  // Show protected content if authenticated
  console.log('[ProtectedRoute] User authenticated, showing protected content');
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
