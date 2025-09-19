import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
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
  
  useEffect(() => {
    const card = cardRef.current;
    const img = imageRef.current;
    if (!card || !img) return;
    
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let raf: number | null = null;
    
    function animate() {
      current.x += (target.x - current.x) * 0.10;
      current.y += (target.y - current.y) * 0.10;
      
      if (card && img) {
        card.style.transform = `perspective(1000px) rotateY(${current.x}deg) rotateX(${current.y}deg) scale3d(1.04,1.04,1)`;
        img.style.transform = `translate(-50%, -50%) translateX(${-current.x * 4}px) translateY(${current.y * 4}px) scale(1.15)`;
      }
      
      if (Math.abs(current.x - target.x) > 0.1 || Math.abs(current.y - target.y) > 0.1) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = null;
      }
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const normX = ((x / rect.width) - 0.5) * 2;
      const normY = ((y / rect.height) - 0.5) * 2;
      target.x = normX * 18;
      target.y = -normY * 18;
      if (!raf) animate();
    };
    
    const handleMouseEnter = () => {
      card.classList.add('flash');
      setTimeout(() => {
        card.classList.remove('flash');
      }, 1000);
    };
    
    const handleMouseLeave = () => {
      target.x = 0;
      target.y = 0;
      card.classList.remove('flash');
      if (!raf) animate();
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Link to={`/lotteries/${id}`}>
      <div 
        ref={cardRef} 
        className={cn(
          "tilt-card relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg lottery-text-white",
          isFeatured ? "md:col-span-2 md:row-span-2" : ""
        )}
      >
        <div className="relative overflow-hidden">
          <AspectRatio ratio={16/9} className="w-full">
            <div className="h-full w-full overflow-hidden">
              <img
                ref={imageRef}
                src={image}
                alt={title}
                className="absolute left-50% top-50% w-full h-full object-cover transform-center"
              />
            </div>
          </AspectRatio>
          <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              isActive
                ? "bg-green-500/70 backdrop-blur-sm lottery-text-white"
                : "bg-gray-500/70 backdrop-blur-sm lottery-text-white"
            )}>
              {isActive ? 'Active' : 'Terminée'}
            </div>
            {isFeatured && (
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-winshirt-purple/70 backdrop-blur-sm lottery-text-white">
                En vedette
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold lottery-text-white mb-1">{title}</h3>
            <p className="text-lg font-bold lottery-text-white mb-2">Valeur: {formattedValue}</p>
            
            {isActive && drawDate && (
              <div className="mb-3">
                <p className="text-sm lottery-text-white-70 mb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-winshirt-blue" />
                  <span>Temps restant avant le tirage:</span>
                </p>
                <div className="flex gap-2 lottery-text-white">
                    <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-center min-w-[3rem]">
                      <div className="text-md font-bold lottery-text-white">{timeLeft.days}</div>
                      <div className="text-[10px] lottery-text-white-70">JOURS</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-center min-w-[3rem]">
                      <div className="text-md font-bold lottery-text-white">{timeLeft.hours}</div>
                      <div className="text-[10px] lottery-text-white-70">HEURES</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-center min-w-[3rem]">
                      <div className="text-md font-bold lottery-text-white">{timeLeft.minutes}</div>
                      <div className="text-[10px] lottery-text-white-70">MINUTES</div>
                    </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center text-sm lottery-text-white mb-1">
              <Users className="h-4 w-4 mr-1 text-winshirt-purple" />
              <span className="mr-2 lottery-text-white">{participants} participants</span>
              <span className="lottery-text-white">Objectif: {goal}</span>
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
                <span className="text-sm lottery-text-white">Tirage le {formattedDate}</span>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="bg-winshirt-purple/20 hover:bg-winshirt-purple/40 lottery-text-white text-xs px-3"
              >
                Participer
              </Button>
            </div>
        )}
      </div>
    </Link>
  );
};

export default LotteryCard;
