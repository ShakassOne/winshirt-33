
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchLotteryById, fetchAllProducts } from '@/services/api.service';
import GlassCard from '@/components/ui/GlassCard';
import ProductCard from '@/components/ui/ProductCard';
import { CalendarIcon, Users, Clock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

  // Products that offer this lottery as a ticket
  const relatedProducts = products?.filter(product => product.tickets_offered > 0).slice(0, 4);

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
        <main className="flex-grow mt-16 flex items-center justify-center">
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
        <main className="flex-grow mt-16 flex items-center justify-center">
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
      
      <main className="flex-grow mt-16 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lottery Image */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <img 
                  src={lottery.image_url} 
                  alt={lottery.title}
                  className="w-full h-full object-cover" 
                />
                <div 
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                    lottery.is_active
                      ? "bg-green-500/70 backdrop-blur-sm text-white"
                      : "bg-gray-500/70 backdrop-blur-sm text-white"
                  }`}
                >
                  {lottery.is_active ? 'Active' : 'Terminée'}
                </div>
                {lottery.is_featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium bg-winshirt-purple/70 backdrop-blur-sm">
                    En vedette
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold mb-4">{lottery.title}</h1>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <GlassCard className="p-6">
                  <p className="text-white/80">{lottery.description}</p>
                </GlassCard>
              </div>

              {relatedProducts && relatedProducts.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Comment participer</h2>
                  <p className="text-white/70 mb-4">
                    Achetez l'un de ces produits pour participer à cette loterie:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedProducts.map(product => (
                      <ProductCard
                        key={product.id}
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
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lottery Info */}
            <div>
              <GlassCard className="p-6 mb-6">
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
                  
                  <div className="h-2 bg-white/10 rounded-full mb-6">
                    <div 
                      className="h-full bg-winshirt-blue rounded-full" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                
                  {lottery.is_active && (
                    <Button className="w-full bg-gradient-purple">
                      Participer maintenant
                    </Button>
                  )}
                </div>
              </GlassCard>

              {lottery.is_active && (
                <GlassCard className="p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">Temps restant</h2>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{timeRemaining.days}</div>
                      <div className="text-xs text-white/60">Jours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{timeRemaining.hours}</div>
                      <div className="text-xs text-white/60">Heures</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{timeRemaining.minutes}</div>
                      <div className="text-xs text-white/60">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{timeRemaining.seconds}</div>
                      <div className="text-xs text-white/60">Secondes</div>
                    </div>
                  </div>
                </GlassCard>
              )}

              <GlassCard className="p-6">
                <h2 className="text-xl font-bold mb-4">Informations</h2>
                
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
