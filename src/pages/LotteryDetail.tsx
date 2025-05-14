import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchLotteryById, fetchAllProducts } from '@/services/api.service';
import GlassCard from '@/components/ui/GlassCard';
import ProductCard from '@/components/ui/ProductCard';
import { CalendarIcon, Users, Clock, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Slider } from "@/components/ui/slider";
import { Product } from '@/types/supabase.types';

const LotteryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const { data: lottery, isLoading: lotteryLoading, error: lotteryError } = useQuery({
    queryKey: ['lottery', id],
    queryFn: () => fetchLotteryById(id as string),
    enabled: !!id,
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  // Type guard to ensure products is an array
  const productsArray = Array.isArray(products) ? products as Product[] : [];

  // Products that offer this lottery as a ticket
  const relatedProducts = productsArray.filter(product => product.tickets_offered > 0).slice(0, 4);

  // Update countdown timer every second
  useEffect(() => {
    if (!lottery) return;
    
    const drawDate = new Date(lottery.draw_date);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = drawDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [lottery]);

  if (lotteryLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Chargement de la loterie...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (lotteryError || !lottery) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Loterie non trouvée ou une erreur est survenue.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = Math.min((lottery.participants / lottery.goal) * 100, 100);
  const drawDate = new Date(lottery.draw_date);
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(drawDate);
  
  const formattedValue = new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(lottery.value);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative w-full h-[60vh]">
        <img 
          src={lottery.image_url} 
          alt={lottery.title}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:container lg:mx-auto">
          <div className="max-w-3xl">
            <div className="flex gap-2 mb-4">
              <div 
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lottery.is_active
                    ? "bg-green-500/70 backdrop-blur-sm text-white"
                    : "bg-gray-500/70 backdrop-blur-sm text-white"
                }`}
              >
                {lottery.is_active ? 'Active' : 'Terminée'}
              </div>
              {lottery.is_featured && (
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-winshirt-purple/70 backdrop-blur-sm text-white">
                  En vedette
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{lottery.title}</h1>
            <p className="text-xl md:text-2xl font-semibold text-white/90 mb-6">{formattedValue}</p>
          </div>
        </div>
      </div>
      
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lottery Info */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <GlassCard className="p-6">
                  <p className="text-white/80">{lottery.description}</p>
                </GlassCard>
              </div>

              {lottery.is_active && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Temps restant</h2>
                  <GlassCard className="p-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="text-3xl font-bold">{timeRemaining.days}</div>
                          <div className="text-xs text-white/60 mt-1">Jours</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="text-3xl font-bold">{timeRemaining.hours}</div>
                          <div className="text-xs text-white/60 mt-1">Heures</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="text-3xl font-bold">{timeRemaining.minutes}</div>
                          <div className="text-xs text-white/60 mt-1">Minutes</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="bg-black/20 rounded-lg p-4">
                          <div className="text-3xl font-bold">{timeRemaining.seconds}</div>
                          <div className="text-xs text-white/60 mt-1">Secondes</div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              )}

              {relatedProducts && relatedProducts.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Comment participer</h2>
                    <Link to="/products" className="text-winshirt-blue hover:text-winshirt-purple flex items-center gap-1 text-sm">
                      Voir tous les produits
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <p className="text-white/70 mb-6">
                    Achetez l'un de ces produits pour participer à cette loterie:
                  </p>
                  
                  <Carousel className="w-full">
                    <CarouselContent>
                      {relatedProducts.map(product => (
                        <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/2">
                          <div className="p-1">
                            <ProductCard
                              id={product.id}
                              name={product.name}
                              category={product.category}
                              price={product.price}
                              image={product.image_url}
                              rating={5}
                              isCustomizable={product.is_customizable}
                              tickets={product.tickets_offered}
                              color={product.color || undefined}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-1" />
                    <CarouselNext className="right-1" />
                  </Carousel>
                </div>
              )}
            </div>

            {/* Lottery Status */}
            <div className="order-1 lg:order-2">
              <GlassCard className="p-6 mb-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Détails de la loterie</h2>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Valeur du lot:</span>
                    <span className="font-semibold">{formattedValue}</span>
                  </div>
                  
                  <div className="flex justify-between mb-6">
                    <span className="text-white/70">Date du tirage:</span>
                    <span className="font-semibold">{formattedDate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70">Participants:</span>
                    <span className="font-semibold">{lottery.participants}/{lottery.goal}</span>
                  </div>
                  
                  <div className="mb-6">
                    <Slider
                      defaultValue={[progress]}
                      max={100}
                      step={1}
                      disabled
                      className="[&>*:first-child]:bg-white/10 [&>*:nth-child(2)]:bg-gradient-to-r [&>*:nth-child(2)]:from-winshirt-purple [&>*:nth-child(2)]:to-winshirt-blue"
                    />
                  </div>
                
                  {lottery.is_active && (
                    <Button className="w-full bg-gradient-purple hover:opacity-90">
                      Participer maintenant
                    </Button>
                  )}
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Informations</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-3 text-winshirt-blue" />
                      <span>Tirage le {formattedDate}</span>
                    </li>
                    <li className="flex items-center">
                      <Users className="w-5 h-5 mr-3 text-winshirt-purple" />
                      <span>{lottery.participants} participants</span>
                    </li>
                    <li className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-winshirt-blue" />
                      <span>Objectif: {lottery.goal} participants</span>
                    </li>
                    <li className="flex items-center">
                      <Gift className="w-5 h-5 mr-3 text-winshirt-purple" />
                      <span>Valeur: {formattedValue}</span>
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LotteryDetail;
