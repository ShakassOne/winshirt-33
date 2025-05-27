
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
        <div className="max-w-2xl mx-auto glass-card p-8 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center bg-red-500/20 rounded-full mb-6">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Paiement annulé</h1>
          <p className="mb-2">Votre paiement a été annulé</p>
          {orderId && (
            <p className="text-gray-400 mb-6">Commande: {orderId}</p>
          )}
          
          <div className="mb-8 text-left bg-gray-800/50 rounded-lg p-4">
            <h2 className="font-semibold mb-2">Que s'est-il passé ?</h2>
            <p className="text-sm text-gray-300">
              Vous avez annulé le processus de paiement. Votre commande est toujours en attente 
              et aucun montant n'a été débité de votre carte.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/payment" state={{ orderId }}>
                Réessayer le paiement
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/cart">
                Retourner au panier
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentCancelled;
