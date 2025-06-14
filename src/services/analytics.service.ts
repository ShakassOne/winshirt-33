import logger from '@/utils/logger';

import { supabase } from "@/integrations/supabase/client";

// Fonction pour tracker les événements e-commerce avec Google Analytics
export const trackEvent = (eventName: string, parameters: any = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    logger.log(`🔍 [Analytics] Event tracked: ${eventName}`, parameters);
  }
};

// Tracker l'ajout au panier
export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number) => {
  trackEvent('add_to_cart', {
    currency: 'EUR',
    value: price * quantity,
    items: [{
      item_id: productId,
      item_name: productName,
      price: price,
      quantity: quantity
    }]
  });
};

// Tracker le début du checkout
export const trackBeginCheckout = (cartItems: any[], totalValue: number) => {
  trackEvent('begin_checkout', {
    currency: 'EUR',
    value: totalValue,
    items: cartItems.map(item => ({
      item_id: item.productId,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });
};

// Tracker l'achat
export const trackPurchase = (orderId: string, totalValue: number, items: any[]) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'EUR',
    value: totalValue,
    items: items.map(item => ({
      item_id: item.product_id,
      item_name: item.products?.name || 'Produit',
      price: item.price,
      quantity: item.quantity
    }))
  });
};

// Tracker la consultation d'un produit
export const trackViewItem = (productId: string, productName: string, price: number, category: string) => {
  trackEvent('view_item', {
    currency: 'EUR',
    value: price,
    items: [{
      item_id: productId,
      item_name: productName,
      item_category: category,
      price: price
    }]
  });
};

// Tracker la participation à une loterie
export const trackLotteryParticipation = (lotteryId: string, lotteryName: string, ticketValue: number) => {
  trackEvent('lottery_participation', {
    lottery_id: lotteryId,
    lottery_name: lotteryName,
    value: ticketValue,
    currency: 'EUR'
  });
};

// Déclarer gtag pour TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export default {
  trackEvent,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
  trackViewItem,
  trackLotteryParticipation
};
