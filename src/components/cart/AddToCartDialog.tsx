
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AddToCartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export const AddToCartDialog: React.FC<AddToCartDialogProps> = ({
  isOpen,
  onClose,
  productName
}) => {
  const navigate = useNavigate();

  const handleGoToCart = () => {
    navigate('/cart');
    onClose();
  };

  const handleContinueShopping = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <ShoppingCart className="h-5 w-5" />
            Produit ajouté !
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-white/80">
            <span className="font-medium">{productName}</span> a été ajouté à votre panier.
          </p>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleGoToCart}
              className="flex-1 bg-gradient-purple hover:opacity-90"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Voir le panier
            </Button>
            
            <Button 
              onClick={handleContinueShopping}
              variant="outline"
              className="flex-1"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Continuer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
