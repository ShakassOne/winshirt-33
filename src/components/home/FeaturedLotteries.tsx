
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFeaturedLotteries } from '@/hooks/useLotteries';
import LotteryCard from '@/components/ui/LotteryCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lottery } from '@/types/supabase.types';

const FeaturedLotteries = () => {
  const { data: lotteries, isLoading, error } = useQuery({
    queryKey: ['featuredLotteries'],
    queryFn: fetchFeaturedLotteries
  });

  if (isLoading) return <div className="text-center py-8">Chargement des loteries...</div>;
  if (error) return <div className="text-center py-8">Erreur de chargement des loteries</div>;
  if (!lotteries || lotteries.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Gagnez avec nos <span className="text-gradient">Loteries</span></h2>
          <p className="text-xl text-white/70">Tentez votre chance avec nos loteries exclusives</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lotteries.slice(0, 3).map((lottery: Lottery) => (
            <LotteryCard 
              key={lottery.id} 
              lottery={lottery} 
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-gradient-purple">
            <Link to="/lotteries">Voir toutes les loteries</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLotteries;
