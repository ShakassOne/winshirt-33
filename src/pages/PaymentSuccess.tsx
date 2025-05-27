
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');
  
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !orderId) {
      setError("Paramètres de paiement manquants");
      setVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        console.log("Verifying payment for session:", sessionId, "order:", orderId);
        
        const { data, error } = await supabase.functions.invoke('verify-stripe-payment', {
          body: {
            sessionId,
            orderId,
          },
        });

        if (error) {
          console.error("Error verifying payment:", error);
          throw error;
        }

        if (data?.success) {
          setPaymentVerified(true);
          toast({
            title: "Paiement confirmé !",
            description: "Votre commande a été traitée avec succès.",
          });
        } else {
          setError("Le paiement n'a pas pu être vérifié");
        }
      } catch (err) {
        console.error("Error during payment verification:", err);
        setError("Erreur lors de la vérification du paiement");
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId]);

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="spinner"></div>
            <p className="mt-4">Vérification du paiement en cours...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !paymentVerified) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
          <div className="max-w-2xl mx-auto glass-card p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-xl font-bold mb-4">Problème avec le paiement</h1>
            <p className="mb-6">{error || "Le paiement n'a pas pu être vérifié"}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/cart')}>
                Retourner au panier
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Retourner à l'accueil</Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
        <div className="max-w-2xl mx-auto glass-card p-8 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center bg-green-500/20 rounded-full mb-6">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Paiement réussi !</h1>
          <p className="mb-2">Votre commande a été confirmée et traitée</p>
          <p className="text-gray-400 mb-6">Numéro de commande: {orderId}</p>
          
          <div className="mb-8 text-left bg-gray-800/50 rounded-lg p-4">
            <h2 className="font-semibold mb-2">Prochaines étapes</h2>
            <ul className="space-y-2 text-sm">
              <li>✅ Paiement confirmé</li>
              <li>📧 Email de confirmation envoyé</li>
              <li>📦 Votre commande est en cours de préparation</li>
              <li>🚚 Vous recevrez un email avec le suivi de livraison</li>
            </ul>
          </div>
          
          <p className="text-gray-400 mb-6">
            Un email de confirmation détaillé a été envoyé à votre adresse email
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to={`/order-confirmation/${orderId}`}>
                Voir ma commande
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/">
                Continuer mes achats
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
