import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import LotteryCard from '../ui/LotteryCard';
import { cn } from '@/lib/utils';
import { Lottery } from '@/types/supabase.types';
import { fetchFeaturedLotteries } from '@/services/api.service';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Calendar, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedLotteriesProps {
  className?: string;
}

const FeaturedLotteries: React.FC<FeaturedLotteriesProps> = ({ className }) => {
  const { data: lotteries, isLoading, error } = useQuery({
    queryKey: ['featuredLotteries'],
    queryFn: fetchFeaturedLotteries,
  });

  // Ensure lotteries is an array with the correct type
  const lotteriesList = Array.isArray(lotteries) ? lotteries as Lottery[] : [];
  
  // Get the featured lotteries for the hero carousel
  const featuredLotteries = lotteriesList.filter(lottery => lottery.is_featured);
  
  // State for hero carousel
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Get the featured lotteries for the hero carousel
  const featuredLottery = featuredLotteries.length > 0 ? featuredLotteries[activeIndex % featuredLotteries.length] : null;
  
  // Get other lotteries for the carousel below
  const otherLotteries = lotteriesList.filter(lottery => !lottery.is_featured);
  
  // Auto-rotate hero carousel every 5 seconds
  useEffect(() => {
    if (featuredLotteries.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % featuredLotteries.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredLotteries.length]);
  
  // Calculate time remaining until draw date
  const getTimeRemaining = (drawDate: Date) => {
    const total = drawDate.getTime() - new Date().getTime();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);
    
    return { total, days, hours, minutes, seconds };
  };

  const goToPrev = useCallback(() => {
    if (featuredLotteries.length <= 1) return;
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? featuredLotteries.length - 1 : prevIndex - 1
    );
  }, [featuredLotteries.length]);

  const goToNext = useCallback(() => {
    if (featuredLotteries.length <= 1) return;
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % featuredLotteries.length
    );
  }, [featuredLotteries.length]);

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
    
    const timeLeft = getTimeRemaining(drawDate);
    
    return (
      <>
        {/* Hero Lottery Showcase - Full Screen */}
        <section className="relative h-screen w-full overflow-hidden">
          <img 
            src={featuredLottery.image_url} 
            alt={featuredLottery.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
          
          <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-12 lg:container lg:mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{featuredLottery.title}</h1>
              <p className="text-xl md:text-2xl font-semibold text-white/90 mb-6">{formattedValue}</p>
              
              <div className="flex flex-wrap gap-6 mb-6 text-white/80">
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
              
              {/* Countdown Timer */}
              <div className="flex flex-wrap gap-4 mb-8">
                <p className="w-full text-white/70 text-sm mb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Temps restant avant le tirage:
                </p>
                <div className="flex gap-4">
                  <div className="text-center bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg">
                    <div className="text-3xl font-bold">{timeLeft.days}</div>
                    <div className="text-xs text-white/70">JOURS</div>
                  </div>
                  <div className="text-center bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg">
                    <div className="text-3xl font-bold">{timeLeft.hours}</div>
                    <div className="text-xs text-white/70">HEURES</div>
                  </div>
                  <div className="text-center bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg">
                    <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-xs text-white/70">MINUTES</div>
                  </div>
                  <div className="text-center bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg">
                    <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-xs text-white/70">SECONDES</div>
                  </div>
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
                <Button className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90 text-lg px-8 py-6" size="lg" asChild>
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

          {/* Navigation Arrows */}
          {featuredLotteries.length > 1 && (
            <>
              <Button 
                onClick={goToPrev} 
                variant="outline" 
                size="icon" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/50 z-10"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous</span>
              </Button>
              <Button 
                onClick={goToNext} 
                variant="outline" 
                size="icon" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/50 z-10"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next</span>
              </Button>
            </>
          )}
          
          {/* Indicators */}
          {featuredLotteries.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {featuredLotteries.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === activeIndex ? "bg-winshirt-purple w-6" : "bg-white/30"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
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
            
            {otherLotteries.length > 0 ? (
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {otherLotteries.map((lottery: Lottery) => (
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
                  <CarouselPrevious className="left-0 bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/50 text-white">
                    <ChevronLeft className="h-6 w-6" />
                  </CarouselPrevious>
                  <CarouselNext className="right-0 bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/50 text-white">
                    <ChevronRight className="h-6 w-6" />
                  </CarouselNext>
                </Carousel>
              </div>
            ) : (
              <p className="text-center text-white/70">Pas d'autres loteries en vedette pour le moment.</p>
            )}
            
            <div className="text-center mt-10">
              <Button className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90" asChild>
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
          <Button className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90" asChild>
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
