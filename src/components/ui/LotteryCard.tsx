
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { LotteryCardProps } from './LotteryCardProps';
import { Button } from './button';
import { Badge } from './badge';
import { Link } from 'react-router-dom';

const LotteryCard = ({ lottery }: LotteryCardProps) => {
  const progressPercentage = Math.min((lottery.participants / lottery.goal) * 100, 100);
  const formattedDate = new Date(lottery.draw_date).toLocaleDateString();
  
  return (
    <div className="glass-card p-6 rounded-xl transform transition duration-300 hover:-translate-y-1 flex flex-col h-full">
      <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
        <img 
          src={lottery.image_url} 
          alt={lottery.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-white/10">
            {formatCurrency(lottery.value)}
          </Badge>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2">{lottery.title}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{lottery.description}</p>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{lottery.participants} participants</span>
            <span>{lottery.goal} objectif</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-500 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Tirage : {formattedDate}</span>
          <Button asChild size="sm" className="bg-gradient-purple">
            <Link to={`/lotteries/${lottery.id}`}>Voir</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LotteryCard;
