
import React from 'react';
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
  if (!ticketsOffered || ticketsOffered === 0 || lotteries.length === 0) {
    return null;
  }

  // Mock data for participants (in real app, this would come from the lottery data)
  const getParticipants = (lottery: Lottery) => ({
    current: Math.floor(Math.random() * 500) + 50,
    goal: 1000
  });

  const getProgress = (participants: { current: number; goal: number }) => {
    return Math.min((participants.current / participants.goal) * 100, 100);
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
          onClick={() => onLotteryChange('none')}
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

        {/* Liste des loteries avec miniatures */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {lotteries.map((lottery) => {
            const participants = getParticipants(lottery);
            const progress = getProgress(participants);
            const isSelected = selectedLottery === lottery.title;

            return (
              <div
                key={lottery.id}
                className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => onLotteryChange(lottery.title)}
              >
                <div className="flex items-start space-x-3">
                  {/* Image de la loterie */}
                  <div className="flex-shrink-0">
                    <img
                      src={lottery.image_url || '/placeholder.svg'}
                      alt={lottery.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Informations de la loterie */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {lottery.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {lottery.value}€
                          </Badge>
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

                    {/* Participants et progression */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {participants.current} participants
                        </div>
                        <span>Objectif: {participants.goal}</span>
                      </div>
                      
                      {/* Barre de progression */}
                      <Progress 
                        value={progress} 
                        className="h-2 bg-gray-200"
                      />
                      
                      <div className="text-xs text-gray-500 mt-1">
                        {progress.toFixed(0)}% complété
                      </div>
                    </div>

                    {/* Description courte */}
                    {lottery.description && (
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {lottery.description.length > 80 
                          ? `${lottery.description.substring(0, 80)}...`
                          : lottery.description
                        }
                      </p>
                    )}
                  </div>
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
