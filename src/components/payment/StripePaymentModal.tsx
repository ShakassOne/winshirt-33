
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckoutFormData } from '@/types/cart.types';
import { CartItem } from '@/types/supabase.types';
import { Loader2, CreditCard, Lock } from 'lucide-react';

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
  checkoutData: CheckoutFormData;
  items: CartItem[];
  total: number;
  orderId: string;
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  checkoutData,
  items,
  total,
  orderId
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Créer le PaymentIntent quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && !clientSecret) {
      createPaymentIntent();
    }
  }, [isOpen]);

  const createPaymentIntent = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          orderId,
          amount: Math.round(total * 100), // Convertir en centimes
          currency: 'eur',
          checkoutData,
          items
        }
      });

      if (error) throw error;
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Erreur lors de la création du PaymentIntent:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser le paiement",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${checkoutData.firstName} ${checkoutData.lastName}`,
            email: checkoutData.email,
            phone: checkoutData.phone,
            address: {
              line1: checkoutData.address,
              city: checkoutData.city,
              postal_code: checkoutData.postalCode,
              country: checkoutData.country,
            },
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Mettre à jour le statut de la commande
        await supabase.functions.invoke('update-order-payment', {
          body: {
            orderId,
            paymentIntentId: paymentIntent.id,
            status: 'paid'
          }
        });

        toast({
          title: "Paiement réussi !",
          description: "Votre commande a été confirmée.",
        });

        onSuccess(orderId);
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast({
        title: "Erreur de paiement",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  // Calculer le sous-total (total sans livraison)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = total - subtotal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiement sécurisé
          </DialogTitle>
          <DialogDescription>
            Finalisez votre commande de {total.toFixed(2)} €
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Résumé de la commande */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Récapitulatif</h4>
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Livraison</span>
              <span>{shippingCost.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between font-medium text-base border-t pt-2">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>

          {/* Informations de livraison */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Livraison</h4>
            <p className="text-sm text-gray-600">
              {checkoutData.firstName} {checkoutData.lastName}<br />
              {checkoutData.address}<br />
              {checkoutData.postalCode} {checkoutData.city}<br />
              {checkoutData.country}
            </p>
          </div>

          {/* Formulaire de paiement */}
          {clientSecret && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Informations de carte</label>
                <div className="border rounded-lg p-3">
                  <CardElement options={cardElementOptions} />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Lock className="h-3 w-3" />
                <span>Paiement sécurisé par Stripe</span>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={!stripe || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    `Payer ${total.toFixed(2)} €`
                  )}
                </Button>
              </div>
            </form>
          )}

          {!clientSecret && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Initialisation du paiement...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StripePaymentModal;
