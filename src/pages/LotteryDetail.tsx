
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { fetchLotteryById, fetchProductsWithTickets } from '@/services/api.service';
import { Lottery, Product } from '@/types/supabase.types';
import ProductCard from '@/components/ui/ProductCard';
import { SocialShareButton } from '@/components/SocialShareButton';

interface LotteryDetailProps {}

const LotteryDetail: React.FC<LotteryDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [participationCount, setParticipationCount] = useState(0);
  const [isParticipating, setIsParticipating] = useState(false);

  const { data: lottery, isLoading } = useQuery({
    queryKey: ['lottery', id],
    queryFn: () => fetchLotteryById(id as string)
  });

  const { data: productsWithTickets, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['productsWithTickets'],
    queryFn: () => fetchProductsWithTickets(),
    enabled: !!id,
  });

  useEffect(() => {
    if (productsWithTickets) {
      setProducts(productsWithTickets);
    }
  }, [productsWithTickets]);

  useEffect(() => {
    // Mock participation count and status
    setParticipationCount(Math.floor(Math.random() * 100));
    setIsParticipating(Math.random() > 0.5);
  }, []);

  const handleParticipate = () => {
    // Mock participation logic
    setIsParticipating(true);
    setParticipationCount(participationCount + 1);
    toast({
      title: "Participation confirmée",
      description: "Vous participez maintenant à cette loterie !",
    });
  };

  const handleViewProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        {isLoading ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-foreground/60">Chargement de la loterie...</p>
          </div>
        ) : !lottery ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Loterie non trouvée</h1>
            <p className="text-foreground/60">La loterie que vous recherchez n'existe pas.</p>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-10">
            {/* Layout mobile-first vertical, puis horizontal sur large screens */}
            <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-200px)]">
              
              {/* Left Column - Image fixe (sur desktop) */}
              <div className="lg:w-1/2 lg:sticky lg:top-32 lg:self-start">
                <GlassCard className="p-6 h-full lg:min-h-[calc(100vh-200px)]">
                  <img
                    src={lottery.image_url}
                    alt={lottery.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </GlassCard>
              </div>

              {/* Right Column - Contenu scrollable */}
              <div className="lg:w-1/2 lg:overflow-y-auto lg:max-h-[calc(100vh-200px)] space-y-6">
                <GlassCard className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2 text-foreground">{lottery.title}</h1>
                      <p className="text-2xl font-bold text-green-400 mb-4">
                        Valeur: {lottery.value}€
                      </p>
                    </div>
                    <SocialShareButton
                      url={window.location.href}
                      title={lottery.title}
                      description={`Participez à cette loterie d'une valeur de ${lottery.value}€`}
                      className="ml-4"
                    />
                  </div>

                  <p className="text-foreground/80 mb-6">{lottery.description}</p>

                  {/* Participation Section */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-2 text-foreground">Participation</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-foreground/70">Progression</span>
                      <span className="text-foreground/70">{participationCount}%</span>
                    </div>
                    <Progress value={participationCount} />
                    <div className="flex justify-between mt-4">
                      <Badge variant={isParticipating ? "default" : "secondary"}>
                        {isParticipating ? "Vous participez" : "Non participant"}
                      </Badge>
                      {!isParticipating && (
                        <Button onClick={handleParticipate}>Participer</Button>
                      )}
                    </div>
                  </div>
                </GlassCard>

                {/* Products Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Produits inclus dans cette loterie
                  </h3>
                  {isLoadingProducts ? (
                    <div className="text-center py-4">
                      <LoadingSpinner />
                      <p className="mt-2 text-foreground/60">Chargement des produits...</p>
                    </div>
                  ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                      {products.map((product) => (
                        <div key={product.id} onClick={() => handleViewProduct(product.id)}>
                          <ProductCard
                            id={product.id}
                            name={product.name}
                            category={product.category}
                            price={product.price}
                            image={product.image_url}
                            isCustomizable={product.is_customizable}
                            tickets={product.tickets_offered}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <GlassCard className="p-4 text-center">
                      <p className="text-foreground/70">
                        Aucun produit n'est inclus dans cette loterie pour le moment.
                      </p>
                    </GlassCard>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default LotteryDetail;
