import logger from '@/utils/logger';

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Clé publique Stripe (test)
const stripePublishableKey = 'pk_test_51RG3RwQZp9KyWcDgNqtcHRoqMDR9pa2QzxVgaItN32kXpllhwRFYHMaaOUmn9jAZ56duJwIZ4OIFEVlYcd2pa6O600qTFJdlH8';

// Debug détaillé
logger.log('=== STRIPE CONFIGURATION DEBUG ===');
logger.log('Environment variables:', {
  VITE_STRIPE_PUBLISHABLE_KEY: stripePublishableKey ? 'PRESENT' : 'MISSING',
  raw_value: stripePublishableKey
});

// Vérification stricte de la présence de la clé
if (!stripePublishableKey) {
  console.error('❌ STRIPE_PUBLISHABLE_KEY is missing! Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.');
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// Debug du chargement de Stripe
if (stripePromise) {
  stripePromise.then((stripe) => {
    logger.log('✅ Stripe loaded successfully:', !!stripe);
  }).catch((error) => {
    console.error('❌ Error loading Stripe:', error);
  });
} else {
  console.error('❌ Stripe promise is null - key is missing');
}

interface StripeProviderProps {
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  // Si pas de clé, afficher un message d'erreur
  if (!stripePublishableKey) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h3 className="font-bold">Configuration Stripe manquante</h3>
        <p>La clé publique Stripe n'est pas configurée. Veuillez ajouter VITE_STRIPE_PUBLISHABLE_KEY à vos variables d'environnement.</p>
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
