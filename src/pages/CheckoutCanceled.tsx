
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CheckoutCanceled = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Paiement annulé</h1>
        
        <p className="text-muted-foreground mb-8">
          Votre commande n'a pas été finalisée car le paiement a été annulé.
          Les articles de votre panier ont été conservés si vous souhaitez terminer votre achat ultérieurement.
        </p>
        
        <Button onClick={() => navigate('/cart')} className="bg-gradient-purple mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retourner au panier
        </Button>
        
        <Button onClick={() => navigate('/products')} variant="outline">
          Continuer vos achats
        </Button>
      </div>
    </div>
  );
};

export default CheckoutCanceled;
