
import React from 'react';
import { UsersRound } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Lottery } from '@/types/supabase.types';

interface LotterySelectorProps {
  product: any;
  activeLotteries: Lottery[];
  selectedLotteries: Lottery[];
  handleLotteryToggle: (lottery: Lottery, index: number) => void;
}

const LotterySelector = ({
  product,
  activeLotteries,
  selectedLotteries,
  handleLotteryToggle
}: LotterySelectorProps) => {
  if (!product.tickets_offered || activeLotteries.length === 0) return null;

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="text-lg font-medium mb-2">
        {product.tickets_offered > 1 
          ? `Choisir ${product.tickets_offered} loteries` 
          : 'Choisir une loterie'}
      </h3>
      
      <p className="text-gray-500 text-sm mb-4">
        L'achat de ce produit vous donne accès à {product.tickets_offered} ticket{product.tickets_offered > 1 ? 's' : ''} de loterie.
      </p>
      
      <div className="space-y-3">
        {Array.from({ length: product.tickets_offered }).map((_, index) => {
          const selectedLottery = selectedLotteries[index];
          
          return (
            <div key={`lottery-slot-${index}`} className="space-y-2">
              <p className="text-sm font-medium">Ticket {index + 1}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activeLotteries.map(lottery => (
                  <Card 
                    key={lottery.id}
                    className={`p-3 cursor-pointer transition-all ${
                      selectedLottery?.id === lottery.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleLotteryToggle(lottery, index)}
                  >
                    <div className="flex gap-3">
                      <div 
                        className="h-12 w-12 rounded flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${lottery.image_url})` }}
                      ></div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{lottery.title}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <UsersRound className="h-3 w-3 mr-1" />
                          <span>{lottery.participants} participants</span>
                        </div>
                        
                        <div className="mt-2">
                          <Progress 
                            value={(lottery.participants / lottery.goal) * 100} 
                            className="h-1"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LotterySelector;
