
import { useState } from 'react';

export type LotteryItem = {
  id: string;
  title: string;
  value: number;
  image_url: string;
};

type UseLotterySelectionProps = {
  maxTickets: number;
  initialSelectedLotteries?: string[];
};

export const useLotterySelection = ({ 
  maxTickets, 
  initialSelectedLotteries = [] 
}: UseLotterySelectionProps) => {
  const [selectedLotteries, setSelectedLotteries] = useState<string[]>(
    // Assurez-vous que la liste initiale n'est pas plus grande que maxTickets
    initialSelectedLotteries.slice(0, maxTickets)
  );

  // Vérifier si une loterie est sélectionnée
  const isLotterySelected = (lotteryId: string) => {
    return selectedLotteries.includes(lotteryId);
  };

  // Obtenir l'index de la première occurrence d'une loterie
  const getFirstLotteryIndex = (lotteryId: string) => {
    return selectedLotteries.findIndex(id => id === lotteryId);
  };
  
  // Compter combien de fois une loterie spécifique est sélectionnée
  const getLotteryCount = (lotteryId: string) => {
    return selectedLotteries.filter(id => id === lotteryId).length;
  };

  // Vérifier si on peut ajouter plus de loteries
  const canAddMoreLotteries = () => {
    return selectedLotteries.length < maxTickets;
  };

  // Nombre de tickets restants disponibles
  const remainingTickets = maxTickets - selectedLotteries.length;

  // Ajouter ou remplacer une loterie à un index spécifique
  const toggleLotteryAtIndex = (lotteryId: string, indexToReplace?: number) => {
    // Si un index est spécifié, remplacer cette loterie
    if (indexToReplace !== undefined && indexToReplace >= 0 && indexToReplace < maxTickets) {
      const newSelectedLotteries = [...selectedLotteries];
      newSelectedLotteries[indexToReplace] = lotteryId;
      setSelectedLotteries(newSelectedLotteries);
      return;
    }
    
    // Si on veut ajouter une loterie qui est déjà sélectionnée
    if (isLotterySelected(lotteryId)) {
      // Supprimer toutes les occurrences de cette loterie
      setSelectedLotteries(selectedLotteries.filter(id => id !== lotteryId));
      return;
    }
    
    // Si on peut ajouter une nouvelle loterie
    if (canAddMoreLotteries()) {
      setSelectedLotteries([...selectedLotteries, lotteryId]);
    }
  };

  // Remplacer une loterie spécifique par une autre
  const replaceLotteryAtIndex = (index: number, lotteryId: string) => {
    if (index >= 0 && index < maxTickets) {
      const newSelectedLotteries = [...selectedLotteries];
      newSelectedLotteries[index] = lotteryId;
      setSelectedLotteries(newSelectedLotteries);
    }
  };

  // Supprimer une loterie à un index spécifique
  const removeLotteryAtIndex = (index: number) => {
    if (index >= 0 && index < selectedLotteries.length) {
      const newSelectedLotteries = [...selectedLotteries];
      newSelectedLotteries.splice(index, 1);
      setSelectedLotteries(newSelectedLotteries);
    }
  };

  // Ajouter plusieurs fois la même loterie (jusqu'à atteindre maxTickets)
  const addMultipleSameLottery = (lotteryId: string, count: number) => {
    const availableSlots = maxTickets - selectedLotteries.length;
    const toAdd = Math.min(availableSlots, count);
    
    if (toAdd <= 0) return;
    
    const newLotteries = [...selectedLotteries];
    for (let i = 0; i < toAdd; i++) {
      newLotteries.push(lotteryId);
    }
    
    setSelectedLotteries(newLotteries);
  };

  return {
    selectedLotteries,
    setSelectedLotteries,
    isLotterySelected,
    getFirstLotteryIndex,
    getLotteryCount,
    toggleLotteryAtIndex,
    replaceLotteryAtIndex,
    removeLotteryAtIndex,
    canAddMoreLotteries,
    remainingTickets,
    addMultipleSameLottery
  };
};
