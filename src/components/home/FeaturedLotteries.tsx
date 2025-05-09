import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import LotteryCard from '../ui/LotteryCard';
import { cn } from '@/lib/utils';
import { Lottery } from '@/types/supabase.types';
import { fetchFeaturedLotteries } from '@/services/api.service';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Calendar, Users, Clock } from 'lucide-react';

interface FeaturedLotteriesProps {
  className?: string;
}

const FeaturedLotteries: React.FC<FeaturedLotteriesProps> = ({ className }) => {
  const { data: lotteries, isLoading, error } = useQuery({
    queryKey: ['featuredLotteries'],
    queryFn: fetchFeaturedLotteries,
  });

  // Ensure lotteries is always treated as an array
  const lotteriesList = Array.isArray(lotteries) ? lotteries : [];
  
  // Get the first lottery for the full-screen hero showcase
  const featuredLottery = lotteriesList.length > 0 ? lotteriesList[0] : null;

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
  
  if (featuredLottery) {
    const progress = Math.min((featuredLottery.participants / featuredLottery.goal) * 100, 100);
    const formattedValue = new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(featuredLottery.value);
    
    const drawDate = new Date(featuredLottery.draw_date);
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(drawDate);
    
    return (
      <>
        {/* Hero Lottery Showcase - Full Screen */}
        <section className="relative h-screen w-full overflow-hidden">
          <img 
            src={featuredLottery.image_url} 
            alt={featuredLottery.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
          
          <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-12 lg:container lg:mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{featuredLottery.title}</h1>
              <p className="text-xl md:text-2xl font-semibold text-white/90 mb-6">{formattedValue}</p>
              
              <div className="flex flex-wrap gap-6 mb-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-winshirt-blue" />
                  <span>Tirage le {formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-winshirt-purple" />
                  <span>{featuredLottery.participants} participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-winshirt-blue" />
                  <span>Objectif: {featuredLottery.goal} participants</span>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">Progression</span>
                  <span className="font-semibold">{featuredLottery.participants}/{featuredLottery.goal}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue rounded-full" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-purple hover:opacity-90 text-lg px-8 py-6" size="lg" asChild>
                  <Link to={`/lotteries/${featuredLottery.id}`}>
                    Participer
                  </Link>
                </Button>
                <Button variant="outline" className="border-white/30 hover:bg-white/10 text-lg px-8 py-6" size="lg" asChild>
                  <Link to="/lotteries">
                    Voir toutes les loteries
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {lotteriesList.slice(0, 4).map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "w-2 h-2 rounded-full",
                  idx === 0 ? "bg-winshirt-purple" : "bg-white/30"
                )}
              />
            ))}
          </div>
        </section>

        {/* Other Featured Lotteries */}
        <section className={cn('py-20', className)}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Autres loteries en vedette</h2>
                <p className="text-white/70">Participez et tentez de gagner des produits exceptionnels</p>
              </div>
            </div>
            
            {lotteriesList.length > 1 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {lotteriesList.slice(1).map((lottery: Lottery) => (
                    <CarouselItem key={lottery.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <div className="p-1">
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
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            ) : (
              <p className="text-center text-white/70">Pas d'autres loteries en vedette pour le moment.</p>
            )}
            
            <div className="text-center mt-10">
              <Button className="bg-gradient-purple hover:opacity-90" asChild>
                <Link to="/lotteries">
                  Voir toutes les loteries
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Fallback to regular display if no featured lottery
  return (
    <section className={cn('py-20', className)}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Loteries en vedette</h2>
            <p className="text-white/70">Participez et tentez de gagner des produits exceptionnels</p>
          </div>
        </div>
        
        {lotteriesList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lotteriesList.map((lottery: Lottery) => (
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
        ) : (
          <p className="text-center text-white/70">Aucune loterie en vedette pour le moment.</p>
        )}
        
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
