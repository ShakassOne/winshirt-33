
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;
  className?: string;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ variant = 'default', className = '' }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      console.log("Initiating sign out process...");
      await signOut();
      
      toast.success("Déconnecté avec succès");
      
      // Force navigation to home page
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Erreur de déconnexion. Veuillez réessayer.");
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
