
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Utiliser la clé publique Stripe (elle doit commencer par pk_)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QVqALQZp9KyWcDgY6jDMoOpJRnqF0JM8ePEOOw7PH4h7jOBPeYLDrWdcVh5OIVuZsQlVi9TgjyB4iHdyLr7O8QL00a3VGQnLx');

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
