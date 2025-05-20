
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;
  className?: string;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ variant = 'default', className = '' }) => {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      console.log("Initiating sign out process...");
      await signOut();
      
      toast({
        title: "Déconnecté avec succès",
        description: "Vous avez été déconnecté de votre compte",
      });
      
      // Force page refresh to ensure all auth state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Button 
      variant={variant || 'default'} 
      className={className}
      onClick={handleSignOut}
    >
      Déconnexion
    </Button>
  );
};

export default SignOutButton;
