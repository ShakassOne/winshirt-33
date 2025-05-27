
import { useState } from 'react';
import { processExistingOrdersForLottery } from '@/services/order.service';
import { toast } from 'sonner';

export const useLotteryRetroprocessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processExistingOrders = async () => {
    setIsProcessing(true);
    try {
      await processExistingOrdersForLottery();
      toast.success('Toutes les commandes existantes ont été traitées pour les loteries');
      return { success: true };
    } catch (error) {
      console.error('Error processing existing orders:', error);
      toast.error('Erreur lors du traitement des commandes existantes');
      return { success: false, error };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processExistingOrders,
    isProcessing
  };
};
