import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById, fetchAllLotteries } from '@/services/api.service';
import { Product, Lottery } from '@/types/supabase.types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import GlassCard from '@/components/ui/GlassCard';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedLotteries, setSelectedLotteries] = useState<Lottery[]>([]);
  const [selectedLotteryIds, setSelectedLotteryIds] = useState<string[]>([]);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });

  const { data: lotteries } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries,
  });

  useEffect(() => {
    if (product && product.available_colors && product.available_colors.length > 0) {
      setSelectedColor(product.available_colors[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une couleur.",
        variant: "destructive"
      });
      return;
    }

    if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une taille.",
        variant: "destructive"
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      color: selectedColor,
      size: selectedSize,
      image_url: product.image_url,
      lotteries: selectedLotteryIds,
    });

    toast({
      title: "Ajouté au panier",
      description: "Ce produit a été ajouté à votre panier.",
    });
  };

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else {
      setQuantity(1);
      if (quantityInputRef.current) {
        quantityInputRef.current.value = '1';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 flex items-center justify-center">
          <p>Chargement du produit...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 flex items-center justify-center">
          <p>Produit non trouvé ou une erreur est survenue.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleLotteryToggle = (lottery: Lottery, index: number) => {
    const maxTickets = product?.tickets_offered || 0;

    // Si la loterie est déjà sélectionnée, la retirer
    if (selectedLotteryIds.includes(lottery.id)) {
      const updatedLotteries = [...selectedLotteries];
      updatedLotteries[index] = null as unknown as Lottery;

      const filteredLotteries = updatedLotteries.filter(l => l !== null);
      setSelectedLotteries(filteredLotteries);
      setSelectedLotteryIds(filteredLotteries.map(l => l.id));
      return;
    }

    // Ajouter ou remplacer la loterie à l'index
    const updatedLotteries = [...selectedLotteries];

    // S'assurer que le tableau a la bonne taille
    while (updatedLotteries.length <= index) {
      updatedLotteries.push(null as unknown as Lottery);
    }

    // Vérifier que la loterie n'est pas déjà dans un autre slot
    if (selectedLotteryIds.includes(lottery.id)) {
      toast({
        title: "Erreur",
        description: "Cette loterie est déjà sélectionnée.",
        variant: "destructive"
      });
      return;
    }

    updatedLotteries[index] = lottery;

    const filteredLotteries = updatedLotteries.filter(l => l !== null);

    if (filteredLotteries.length > maxTickets) {
      toast({
        title: "Erreur",
        description: `Vous ne pouvez sélectionner que ${maxTickets} loterie(s) maximum pour ce produit.`,
        variant: "destructive"
      });
      return;
    }

    setSelectedLotteries(filteredLotteries);
    setSelectedLotteryIds(filteredLotteries.map(l => l.id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div>
              <img src={product.image_url} alt={product.name} className="w-full h-auto rounded-lg" />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
              <p className="text-gray-300 mb-4">{product.description}</p>

              <div className="mb-4">
                <span className="text-xl font-bold">Prix: {product.price}€</span>
              </div>

              {/* Color Options */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">Couleur:</Label>
                  <div className="mt-1 flex space-x-2">
                    {product.available_colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${selectedColor === color ? 'ring-2 ring-winshirt-purple' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Options */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div className="mb-4">
                  <Label className="block text-sm font-medium text-gray-700">Taille:</Label>
                  <div className="mt-1 flex space-x-2">
                    {product.available_sizes.map((size) => (
                      <button
                        key={size}
                        className={`px-4 py-2 rounded-md border border-gray-700 ${selectedSize === size ? 'bg-winshirt-purple text-white' : 'bg-transparent text-gray-200'}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Input */}
              <div className="mb-4">
                <Label className="block text-sm font-medium text-gray-700">Quantité:</Label>
                <div className="flex items-center">
                  <Button onClick={decrementQuantity} className="px-3 py-2">-</Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="mx-2 w-20 text-center"
                    ref={quantityInputRef}
                  />
                  <Button onClick={incrementQuantity} className="px-3 py-2">+</Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div>
                <Button className="w-full bg-winshirt-purple hover:bg-winshirt-blue text-white py-2 rounded-md" onClick={handleAddToCart}>
                  Ajouter au panier <ShoppingCart className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
          {product.tickets_offered && product.tickets_offered > 0 && lotteries && lotteries.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">
                Participez à nos loteries avec ce produit ! (
                {product.tickets_offered} tickets offerts)
              </h2>
              <p className="text-gray-300 mb-4">
                Sélectionnez jusqu'à {product.tickets_offered} loteries auxquelles vous souhaitez participer.
              </p>
              <Carousel className="w-full">
                <CarouselContent>
                  {lotteries.map((lottery, index) => (
                    <CarouselItem key={lottery.id} className={cn("md:basis-1/2 lg:basis-1/3")}>
                      <GlassCard className="relative p-4">
                        <div className="flex flex-col h-full">
                          <h3 className="text-lg font-semibold mb-2">{lottery.title}</h3>
                          <img
                            src={lottery.image_url}
                            alt={lottery.title}
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                          <p className="text-gray-400 text-sm flex-grow">{lottery.description}</p>
                          <div className="flex items-center mt-4">
                            <Checkbox
                              id={`lottery-${lottery.id}`}
                              checked={selectedLotteryIds.includes(lottery.id)}
                              onCheckedChange={(checked) => {
                                handleLotteryToggle(lottery, index);
                              }}
                            />
                            <Label htmlFor={`lottery-${lottery.id}`} className="ml-2 text-sm cursor-pointer">
                              Sélectionner
                            </Label>
                          </div>
                        </div>
                      </GlassCard>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </Carousel>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
