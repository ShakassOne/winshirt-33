import logger from '@/utils/logger';

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useOptimizedLotteriesQuery } from '@/hooks/useOptimizedLotteriesQuery';
import LotteryCard from '@/components/ui/LotteryCard';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Users, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const Lotteries = () => {
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  
  logger.log('[Lotteries Page] Rendering with filterActive:', filterActive, 'search:', searchTerm);
  
  const { data: lotteries, isLoading, error, refetch } = useOptimizedLotteriesQuery();

  // Mémoriser les loteries filtrées pour éviter les recalculs
  const filteredLotteries = useMemo(() => {
    if (!lotteries) return [];
    
    return lotteries.filter(lottery => {
      const matchesStatus = filterActive === null ? true : lottery.is_active === filterActive;
      const matchesSearch = searchTerm 
        ? lottery.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          lottery.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [lotteries, filterActive, searchTerm]);
  
  // Mémoriser les loteries en vedette
  const featuredLotteries = useMemo(() => {
    return lotteries?.filter(lottery => lottery.is_featured) || [];
  }, [lotteries]);
  
  const currentFeaturedLottery = featuredLotteries[activeHeroIndex];

  logger.log('[Lotteries Page] Featured lotteries:', featuredLotteries.length);
  logger.log('[Lotteries Page] Filtered lotteries count:', filteredLotteries?.length || 0);

  // Function to retry fetching lotteries
  const handleRetry = () => {
    logger.log('[Lotteries Page] Retrying fetch...');
    refetch();
  };

  // Navigation functions for hero carousel
  const goToPrev = () => {
    setActiveHeroIndex(prev => 
      prev === 0 ? featuredLotteries.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setActiveHeroIndex(prev => 
      (prev + 1) % featuredLotteries.length
    );
  };

  // Format dates for countdown timer
  const getTimeRemaining = (drawDate: Date) => {
    const total = drawDate.getTime() - new Date().getTime();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);
    
    return { total, days, hours, minutes, seconds };
  };

  // Auto-advance hero carousel
  React.useEffect(() => {
    if (featuredLotteries.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveHeroIndex(prev => (prev + 1) % featuredLotteries.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredLotteries.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pb-20">
        {/* Hero Lottery Showcase - Only if featured lottery exists */}
        {currentFeaturedLottery && (
          <section className="relative h-screen w-full overflow-hidden">
            <img 
              src={currentFeaturedLottery.image_url} 
              alt={currentFeaturedLottery.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
            
            <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-12 lg:container lg:mx-auto">
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{currentFeaturedLottery.title}</h1>
                <p className="text-xl md:text-2xl font-semibold text-white/90 mb-6">
                  {new Intl.NumberFormat('fr-FR', { 
                    style: 'currency', 
                    currency: 'EUR',
                    maximumFractionDigits: 0
                  }).format(currentFeaturedLottery.value)}
                </p>
                
                <div className="flex flex-wrap gap-6 mb-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-winshirt-blue" />
                    <span>Tirage le {new Date(currentFeaturedLottery.draw_date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-winshirt-purple" />
                    <span>{currentFeaturedLottery.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-winshirt-blue" />
                    <span>Objectif: {currentFeaturedLottery.goal} participants</span>
                  </div>
                </div>
                
                {/* Countdown Timer */}
                {currentFeaturedLottery.is_active && (
                  <div className="flex flex-wrap gap-4 mb-8">
                    <p className="w-full text-white/70 text-sm mb-1 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Temps restant avant le tirage:
                    </p>
                    {(() => {
                      const time = getTimeRemaining(new Date(currentFeaturedLottery.draw_date));
                      return (
                        <div className="flex gap-4">
                          <div className="text-center bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg">
                            <div className="text-3xl font-bold">{time.days}</div>
                            <div className="text-xs text-white/70">JOURS</div>
                          </div>
                          <div className="text-center bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg">
                            <div className="text-3xl font-bold">{time.hours}</div>
                            <div className="text-xs text-white/70">HEURES</div>
                          </div>
                          <div className="text-center bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg">
                            <div className="text-3xl font-bold">{time.minutes}</div>
                            <div className="text-xs text-white/70">MINUTES</div>
                          </div>
                          <div className="text-center bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg">
                            <div className="text-3xl font-bold">{time.seconds}</div>
                            <div className="text-xs text-white/70">SECONDES</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70">Progression</span>
                    <span className="font-semibold">{currentFeaturedLottery.participants}/{currentFeaturedLottery.goal}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue rounded-full" 
                      style={{ width: `${Math.min((currentFeaturedLottery.participants / currentFeaturedLottery.goal) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90 text-lg px-8 py-6" size="lg" asChild>
                    <Link to={`/lotteries/${currentFeaturedLottery.id}`}>
                      Participer
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
                </Button>
                <Button 
                  onClick={goToNext}
                  variant="outline" 
                  size="icon" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 bg-black/30 backdrop-blur-sm border-white/10 hover:bg-black/50 z-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            {/* Indicators */}
            {featuredLotteries.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {featuredLotteries.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeHeroIndex ? "bg-winshirt-purple w-6" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Hero Section - Only show if no featured lottery */}
        {!currentFeaturedLottery && (
          <section className="relative py-12 bg-gradient-to-b from-winshirt-purple/20 to-transparent">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                Nos <span className="text-gradient">Loteries</span>
              </h1>
              <p className="text-lg text-white/70 text-center max-w-2xl mx-auto">
                Tentez votre chance et remportez des prix exceptionnels en participant à nos loteries
              </p>
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-white/5 backdrop-blur-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-winshirt-purple/50"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={filterActive === null ? "default" : "outline"}
                  onClick={() => setFilterActive(null)}
                  className={filterActive === null ? "bg-gradient-to-r from-winshirt-purple to-winshirt-blue" : ""}
                >
                  Toutes
                </Button>
                <Button
                  variant={filterActive === true ? "default" : "outline"}
                  onClick={() => setFilterActive(true)}
                  className={filterActive === true ? "bg-gradient-to-r from-winshirt-purple to-winshirt-blue" : ""}
                >
                  Actives
                </Button>
                <Button
                  variant={filterActive === false ? "default" : "outline"}
                  onClick={() => setFilterActive(false)}
                  className={filterActive === false ? "bg-gradient-to-r from-winshirt-purple to-winshirt-blue" : ""}
                >
                  Terminées
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Lotteries Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-20">
                <p>Chargement des loteries...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-lg mb-4">Une erreur est survenue lors du chargement des loteries.</p>
                <Button onClick={handleRetry}>Réessayer</Button>
              </div>
            ) : filteredLotteries?.length === 0 ? (
              <div className="text-center py-20">
                <p>Aucune loterie ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLotteries?.map(lottery => (
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
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Lotteries;
