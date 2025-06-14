
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Initialize Stripe only if the key is available
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

interface OptionalStripeProviderProps {
  children: React.ReactNode;
  required?: boolean;
}

const OptionalStripeProvider: React.FC<OptionalStripeProviderProps> = ({ 
  children, 
  required = false 
}) => {
  // Si Stripe n'est pas configuré et que c'est requis, afficher un message d'erreur
  if (!STRIPE_PUBLISHABLE_KEY && required) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500">
          Configuration Stripe manquante. Veuillez contacter l'administrateur.
        </div>
      </div>
    );
  }

  // Si Stripe n'est pas configuré mais pas requis, afficher les enfants sans wrapper
  if (!STRIPE_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  // Si Stripe est configuré, utiliser le provider normal
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default OptionalStripeProvider;
