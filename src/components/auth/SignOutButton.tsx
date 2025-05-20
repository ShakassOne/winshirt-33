
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;
  className?: string;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ variant = 'default', className = '' }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      console.log("Signing out user...");
      await signOut();
      
      // Forcer l'actualisation de la page après la déconnexion
      toast({
        title: "Déconnecté avec succès",
        description: "Vous avez été déconnecté de votre compte",
      });
      
      // Rediriger vers la page d'accueil et forcer un rechargement
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
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
