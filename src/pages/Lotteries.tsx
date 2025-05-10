
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAllLotteries } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';
import LotteryCard from '@/components/ui/LotteryCard';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const Lotteries = () => {
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: lotteries, isLoading, error } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries,
  });

  const filteredLotteries = lotteries?.filter(lottery => {
    const matchesStatus = filterActive === null ? true : lottery.is_active === filterActive;
    const matchesSearch = searchTerm 
      ? lottery.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        lottery.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });
  
  // Get featured lotteries for the slider
  const featuredLotteries = lotteries?.filter(lottery => lottery.is_featured) || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {/* Featured Lotteries Slider */}
        {featuredLotteries.length > 0 && (
          <section className="py-12 bg-gradient-to-b from-winshirt-blue/10 to-transparent relative">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                Loteries en <span className="text-gradient">Vedette</span>
              </h2>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {featuredLotteries.map(lottery => (
                    <CarouselItem key={lottery.id} className="md:basis-1/2 lg:basis-1/3">
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
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </Carousel>
            </div>
          </section>
        )}

        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-winshirt-purple/20 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Nos <span className="text-gradient">Loteries</span>
            </h1>
            <p className="text-lg text-white/70 text-center max-w-2xl mx-auto">
              Tentez votre chance et remportez des prix exceptionnels en participant à nos loteries
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8">
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
                  className={filterActive === null ? "bg-gradient-purple" : ""}
                >
                  Toutes
                </Button>
                <Button
                  variant={filterActive === true ? "default" : "outline"}
                  onClick={() => setFilterActive(true)}
                  className={filterActive === true ? "bg-gradient-purple" : ""}
                >
                  Actives
                </Button>
                <Button
                  variant={filterActive === false ? "default" : "outline"}
                  onClick={() => setFilterActive(false)}
                  className={filterActive === false ? "bg-gradient-purple" : ""}
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
                <p>Une erreur est survenue lors du chargement des loteries.</p>
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
