
import React from 'react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';
import { CalendarIcon, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
  
  // Format date for display
  const formattedDate = drawDate ? new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(drawDate) : null;

  // Calculate remaining time until draw date
  const getTimeRemaining = () => {
    if (!drawDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const total = drawDate.getTime() - new Date().getTime();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  const timeLeft = getTimeRemaining();

  return (
    <Link to={`/lotteries/${id}`}>
      <GlassCard 
        className={cn(
          "overflow-hidden transition-all duration-500 glow-card",
          isFeatured ? "md:col-span-2 md:row-span-2" : ""
        )}
        hover3D
        shine
      >
        <div className="relative overflow-hidden">
          <AspectRatio ratio={16/9} className="w-full">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
            />
          </AspectRatio>
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-lg font-bold text-white mb-2">Valeur: {formattedValue}</p>
            
            {isActive && drawDate && (
              <div className="mb-3">
                <p className="text-sm text-white/70 mb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-winshirt-blue" />
                  <span>Temps restant avant le tirage:</span>
                </p>
                <div className="flex gap-2 text-white">
                  <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-center min-w-[3rem]">
                    <div className="text-md font-bold">{timeLeft.days}</div>
                    <div className="text-[10px] text-white/70">JOURS</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-center min-w-[3rem]">
                    <div className="text-md font-bold">{timeLeft.hours}</div>
                    <div className="text-[10px] text-white/70">HEURES</div>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-center min-w-[3rem]">
                    <div className="text-md font-bold">{timeLeft.minutes}</div>
                    <div className="text-[10px] text-white/70">MINUTES</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center text-sm text-white mb-1">
              <Users className="h-4 w-4 mr-1 text-winshirt-purple" />
              <span className="mr-2">{participants} participants</span>
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
          <div className="p-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-winshirt-blue" />
              <span className="text-sm">Tirage le {formattedDate}</span>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              className="bg-winshirt-purple/20 hover:bg-winshirt-purple/40 text-white text-xs px-3"
            >
              Participer
            </Button>
          </div>
        )}
      </GlassCard>
    </Link>
  );
};

export default LotteryCard;
