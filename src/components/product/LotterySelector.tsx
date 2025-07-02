
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, Users, Star } from "lucide-react";
import { Lottery } from '@/types/supabase.types';

interface LotterySelectorProps {
  lotteries: Lottery[];
  selectedLottery: string;
  onLotteryChange: (lottery: string) => void;
  ticketsOffered: number;
}

export const LotterySelector: React.FC<LotterySelectorProps> = ({
  lotteries,
  selectedLottery,
  onLotteryChange,
  ticketsOffered
}) => {
  // État pour suivre les participants de chaque loterie (simulation)
  const [participantCounts, setParticipantCounts] = useState<Map<string, number>>(new Map());

  // Initialiser les compteurs de participants au premier rendu
  useEffect(() => {
    const initialCounts = new Map<string, number>();
    lotteries.forEach((lottery) => {
      initialCounts.set(lottery.title, Math.floor(Math.random() * 500) + 50);
    });
    setParticipantCounts(initialCounts);
  }, [lotteries]);

  if (!ticketsOffered || ticketsOffered === 0 || lotteries.length === 0) {
    return null;
  }

  const handleLotteryChange = (lotteryTitle: string) => {
    if (lotteryTitle === selectedLottery) return;

    setParticipantCounts(prev => {
      const newCounts = new Map(prev);
      
      // Enlever un participant de la loterie précédemment sélectionnée
      if (selectedLottery !== 'none' && newCounts.has(selectedLottery)) {
        const currentCount = newCounts.get(selectedLottery) || 0;
        newCounts.set(selectedLottery, Math.max(0, currentCount - 1));
      }
      
      // Ajouter un participant à la nouvelle loterie sélectionnée
      if (lotteryTitle !== 'none' && newCounts.has(lotteryTitle)) {
        const currentCount = newCounts.get(lotteryTitle) || 0;
        newCounts.set(lotteryTitle, currentCount + 1);
      }
      
      return newCounts;
    });

    onLotteryChange(lotteryTitle);
  };

  const getProgress = (participants: number, goal: number = 1000) => {
    return Math.min((participants / goal) * 100, 100);
  };

  return (
    <div className="mb-6">
      <Label className="block text-sm font-medium text-gray-700 mb-3">
        <Gift className="inline h-4 w-4 mr-1" />
        Choisir une loterie pour vos {ticketsOffered} tickets gratuits:
      </Label>
      
      <div className="space-y-3">
        {/* Option "Aucune préférence" */}
        <div
          className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
            selectedLottery === 'none'
              ? 'border-purple-400 bg-purple-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
          onClick={() => handleLotteryChange('none')}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Gift className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-3 flex-1">
              <div className="text-sm font-medium text-gray-900">
                Aucune préférence
              </div>
              <div className="text-xs text-gray-500">
                Laisser le système choisir automatiquement
              </div>
            </div>
            {selectedLottery === 'none' && (
              <div className="flex-shrink-0">
                <div className="w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Liste des loteries avec miniatures - format compact horizontal */}
        <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
          {lotteries.map((lottery) => {
            const participants = participantCounts.get(lottery.title) || 0;
            const goal = 1000;
            const progress = getProgress(participants, goal);
            const isSelected = selectedLottery === lottery.title;

            return (
              <div
                key={lottery.id}
                className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleLotteryChange(lottery.title)}
              >
                <div className="flex items-center space-x-3">
                  {/* Image de la loterie */}
                  <div className="flex-shrink-0">
                    <img
                      src={lottery.image_url || '/placeholder.svg'}
                      alt={lottery.title}
                      className="w-16 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Informations principales */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900 truncate mr-2">
                        {lottery.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        <Star className="h-3 w-3 mr-1" />
                        {lottery.value}€
                      </Badge>
                    </div>

                    {/* Participants et progression en ligne */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {participants}
                      </div>
                      
                      <div className="flex-1">
                        <Progress 
                          value={progress} 
                          className="h-2 bg-gray-200"
                        />
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {progress.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Radio button */}
                  {isSelected && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Information sur les tickets */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <div className="text-sm">
              <span className="font-medium text-yellow-800">
                {ticketsOffered} tickets gratuits
              </span>
              <span className="text-yellow-700 ml-1">
                seront ajoutés à la loterie sélectionnée
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
