
import React, { memo } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = memo(({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('[ProtectedRoute] Auth state:', { isAuthenticated, isLoading });
  
  // Wait for auth status to be verified
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Vérification de l'authentification..." />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }
  
  // Show protected content if authenticated
  console.log('[ProtectedRoute] User authenticated, showing protected content');
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
