
import React from 'react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';
import { CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LotteryCardProps {
  id: string;
  title: string;
  image: string;
  value: number;
  participants: number;
  goal: number;
  isActive?: boolean;
  isFeatured?: boolean;
  drawDate?: Date;
}

const LotteryCard: React.FC<LotteryCardProps> = ({
  id,
  title,
  image,
  value,
  participants,
  goal,
  isActive = true,
  isFeatured = false,
  drawDate,
}) => {
  const progress = Math.min((participants / goal) * 100, 100);
  const formattedValue = new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
  
  const formattedDate = drawDate ? new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(drawDate) : null;

  return (
    <Link to={`/lotteries/${id}`}>
      <GlassCard 
        className={cn(
          "overflow-hidden transition-all duration-500",
          isFeatured ? "md:col-span-2 md:row-span-2" : ""
        )}
        hover3D
        shine
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              isActive
                ? "bg-green-500/70 backdrop-blur-sm text-white"
                : "bg-gray-500/70 backdrop-blur-sm text-white"
            )}>
              {isActive ? 'Active' : 'Terminée'}
            </div>
            {isFeatured && (
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-winshirt-purple/70 backdrop-blur-sm">
                En vedette
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-lg font-bold text-white mb-2">Valeur: {formattedValue}</p>
            
            <div className="flex items-center justify-between text-sm text-white mb-2">
              <span>{participants} participants</span>
              <span>Objectif: {goal}</span>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        
        {drawDate && (
          <div className="p-3 border-t border-white/10 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-winshirt-blue" />
            <span className="text-sm">Tirage le {formattedDate}</span>
          </div>
        )}
      </GlassCard>
    </Link>
  );
};

export default LotteryCard;
