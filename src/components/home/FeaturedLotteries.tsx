
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import LotteryCard from '../ui/LotteryCard';
import { cn } from '@/lib/utils';

interface FeaturedLotteriesProps {
  className?: string;
}

// Sample lottery data
const LOTTERIES = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max Ultra Light',
    value: 1299,
    image: 'https://images.unsplash.com/photo-1672906674870-b564eb5586de?q=80&w=2080&auto=format&fit=crop',
    participants: 200,
    goal: 280,
    isActive: true,
    isFeatured: true,
    drawDate: new Date('2026-05-15')
  },
  {
    id: 2,
    title: 'VTT Électrique Audi',
    value: 4900,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=2070&auto=format&fit=crop',
    participants: 120,
    goal: 300,
    isActive: true,
    drawDate: new Date('2026-06-20')
  },
  {
    id: 3,
    title: 'Pack PS5 Astro Bot',
    value: 500,
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=2072&auto=format&fit=crop',
    participants: 180,
    goal: 200,
    isActive: true,
    drawDate: new Date('2026-04-30')
  },
  {
    id: 4,
    title: 'Montre Ulysse Nardin',
    value: 15900,
    image: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=2070&auto=format&fit=crop',
    participants: 4990,
    goal: 5000,
    isActive: true,
    drawDate: new Date('2026-07-10')
  }
];

const FeaturedLotteries: React.FC<FeaturedLotteriesProps> = ({ className }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
            {LOTTERIES.map((lottery) => (
              <div key={lottery.id} className="snap-start">
                <LotteryCard {...lottery} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:hidden grid grid-cols-1 gap-6">
          {LOTTERIES.slice(0, 2).map((lottery) => (
            <LotteryCard key={lottery.id} {...lottery} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-gradient-purple hover:opacity-90">
            Voir toutes les loteries
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLotteries;
