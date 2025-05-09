
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import LotteryCard from '../ui/LotteryCard';
import { cn } from '@/lib/utils';
import { Lottery } from '@/types/supabase.types';
import { fetchFeaturedLotteries } from '@/services/api.service';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface FeaturedLotteriesProps {
  className?: string;
}

const FeaturedLotteries: React.FC<FeaturedLotteriesProps> = ({ className }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: lotteries, isLoading, error } = useQuery({
    queryKey: ['featuredLotteries'],
    queryFn: fetchFeaturedLotteries,
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section className={cn('py-20', className)}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Chargement des loteries...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={cn('py-20', className)}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Une erreur est survenue lors du chargement des loteries.</p>
          </div>
        </div>
      </section>
    );
  }

  // Ensure lotteries is always treated as an array
  const lotteriesList = Array.isArray(lotteries) ? lotteries : [];

  return (
    <section className={cn('py-20', className)}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Loteries en vedette</h2>
            <p className="text-white/70">Participez et tentez de gagner des produits exceptionnels</p>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => handleScroll('left')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span className="sr-only">Précédent</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleScroll('right')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <span className="sr-only">Suivant</span>
            </Button>
          </div>
        </div>
        
        <div className="hidden md:block">
          <div 
            ref={scrollContainerRef}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
            style={{ gridAutoFlow: 'column', gridAutoColumns: '300px' }}
          >
            {lotteriesList.map((lottery: Lottery) => (
              <div key={lottery.id} className="snap-start">
                <LotteryCard 
                  id={lottery.id}
                  title={lottery.title}
                  image={lottery.image_url}
                  value={lottery.value}
                  participants={lottery.participants}
                  goal={lottery.goal}
                  isActive={lottery.is_active}
                  isFeatured={lottery.is_featured}
                  drawDate={new Date(lottery.draw_date)}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:hidden grid grid-cols-1 gap-6">
          {lotteriesList.slice(0, 2).map((lottery: Lottery) => (
            <LotteryCard 
              key={lottery.id}
              id={lottery.id}
              title={lottery.title}
              image={lottery.image_url}
              value={lottery.value}
              participants={lottery.participants}
              goal={lottery.goal}
              isActive={lottery.is_active}
              isFeatured={lottery.is_featured}
              drawDate={new Date(lottery.draw_date)}
            />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-gradient-purple hover:opacity-90" asChild>
            <Link to="/lotteries">
              Voir toutes les loteries
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLotteries;
