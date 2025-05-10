
import { useState, useEffect } from 'react';
import { Lottery } from '@/types/supabase.types';

export const useLotteryState = (product: any, lotteries: Lottery[]) => {
  const [selectedLotteryIds, setSelectedLotteryIds] = useState<string[]>([]);
  const [selectedLotteries, setSelectedLotteries] = useState<Lottery[]>([]);

  // Effect to initialize lottery selection
  useEffect(() => {
    if (product?.tickets_offered && product.tickets_offered > 0 && lotteries.length > 0) {
      const activeLotteries = lotteries.filter(lottery => lottery.is_active);
      if (activeLotteries.length > 0 && selectedLotteries.length === 0) {
        // Ajouter la première loterie par défaut
        setSelectedLotteries([activeLotteries[0]]);
        setSelectedLotteryIds([activeLotteries[0].id]);
      }
    }
  }, [product, lotteries, selectedLotteries.length]);

  return {
    selectedLotteryIds,
    setSelectedLotteryIds,
    selectedLotteries,
    setSelectedLotteries
  };
};
