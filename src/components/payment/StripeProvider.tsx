
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY || '');

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500">
          Configuration Stripe manquante. Veuillez contacter l'administrateur.
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
