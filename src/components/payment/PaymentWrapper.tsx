
import React from 'react';
import OptionalStripeProvider from './OptionalStripeProvider';

interface PaymentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

  // Si Stripe n'est pas configuré, afficher le fallback ou un message par défaut
  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      fallback || (
        <div className="text-center p-4 text-gray-500">
          Les fonctionnalités de paiement ne sont pas disponibles actuellement.
        </div>
      )
    );
  }

  return (
    <OptionalStripeProvider required={true}>
      {children}
    </OptionalStripeProvider>
  );
};

export default PaymentWrapper;
