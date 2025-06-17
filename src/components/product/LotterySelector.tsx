
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gift } from "lucide-react";
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

  return (
    <div className="mb-4">
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        <Gift className="inline h-4 w-4 mr-1" />
        Choisir une loterie (optionnel):
      </Label>
      <Select value={selectedLottery} onValueChange={onLotteryChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Aucune préférence" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Aucune préférence</SelectItem>
          {lotteries.map((lottery) => (
            <SelectItem key={lottery.id} value={lottery.title}>
              {lottery.title} - {lottery.value}€
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
