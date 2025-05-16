
import React from 'react';
import { LotteryItem, useLotterySelection } from '@/hooks/useLotterySelection';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type LotterySelectorProps = {
  availableLotteries: LotteryItem[];
  maxTickets: number;
  initialSelectedLotteries?: string[];
  onLotteriesChange: (selectedLotteries: string[]) => void;
};

const LotterySelector: React.FC<LotterySelectorProps> = ({
  availableLotteries,
  maxTickets,
  initialSelectedLotteries = [],
  onLotteriesChange
}) => {
  const {
    selectedLotteries,
    isLotterySelected,
    toggleLotteryAtIndex,
    remainingTickets,
    removeLotteryAtIndex
  } = useLotterySelection({
    maxTickets,
    initialSelectedLotteries
  });

  // Mettre à jour le parent quand les loteries sélectionnées changent
  React.useEffect(() => {
    onLotteriesChange(selectedLotteries);
  }, [selectedLotteries, onLotteriesChange]);

  // Trouver les détails d'une loterie par son ID
  const getLotteryById = (id: string) => {
    return availableLotteries.find(lottery => lottery.id === id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Choisissez vos loteries</h3>
        <Badge variant="outline">
          {maxTickets - selectedLotteries.length} ticket{remainingTickets !== 1 ? 's' : ''} restant{remainingTickets !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Loteries sélectionnées */}
      {selectedLotteries.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-sm text-gray-400">Loteries sélectionnées:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedLotteries.map((lotteryId, index) => {
              const lottery = getLotteryById(lotteryId);
              if (!lottery) return null;
              
              return (
                <GlassCard key={`${lotteryId}-${index}`} className="p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <img src={lottery.image_url} alt={lottery.title} className="w-10 h-10 rounded-full object-cover mr-2" />
                    <div>
                      <p className="text-sm font-medium">{lottery.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(lottery.value)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeLotteryAtIndex(index)}
                    className="p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste des loteries disponibles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {availableLotteries.map(lottery => (
          <Button
            key={lottery.id}
            variant={isLotterySelected(lottery.id) ? "default" : "outline"}
            className={`justify-start p-2 h-auto ${
              isLotterySelected(lottery.id) 
                ? "bg-winshirt-purple text-white" 
                : "bg-black/10 text-white hover:bg-black/20"
            }`}
            onClick={() => toggleLotteryAtIndex(lottery.id)}
            disabled={remainingTickets === 0 && !isLotterySelected(lottery.id)}
          >
            <img src={lottery.image_url} alt={lottery.title} className="w-8 h-8 rounded-full object-cover mr-2" />
            <div className="text-left">
              <p className="text-sm font-medium">{lottery.title}</p>
              <p className="text-xs opacity-70">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(lottery.value)}
              </p>
            </div>
          </Button>
        ))}
      </div>

      {availableLotteries.length === 0 && (
        <p className="text-sm text-gray-400">Aucune loterie disponible actuellement.</p>
      )}
    </div>
  );
};

export default LotterySelector;
