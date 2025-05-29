
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { fetchProductById } from '@/services/api.service';
import { Product } from '@/types/supabase.types';
import { SocialShareButton } from '@/components/SocialShareButton';
import { UploadImageField } from '@/components/ui/upload-image-field';
import AIImageGenerator from '@/components/product/AIImageGenerator';
import { ChevronDown } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customText, setCustomText] = useState<string>('');
  const [selectedProductColor, setSelectedProductColor] = useState<string>('Noir');
  const [designImage, setDesignImage] = useState<string>('');
  const [designName, setDesignName] = useState<string>('');
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [selectedTextFont, setSelectedTextFont] = useState<string>('Arial');
  const [selectedTextColor, setSelectedTextColor] = useState<string>('#FFFFFF');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
  });

  useEffect(() => {
    if (product && product.available_sizes && product.available_sizes.length > 0) {
      setSelectedSize(product.available_sizes[0]);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      toast({
        title: "Taille requise",
        description: "Veuillez sélectionner une taille avant d'ajouter au panier.",
        variant: "destructive",
      });
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      size: selectedSize,
      color: selectedColor,
      available_sizes: product.available_sizes,
      available_colors: product.available_colors,
      customization: product.is_customizable ? {
        customText: customText,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        designUrl: designImage,
        designName: designName,
        textFont: selectedTextFont,
        textColor: selectedTextColor,
        productColor: selectedProductColor,
      } : null,
    };

    addItem(cartItem);
    toast({
      title: "Produit ajouté",
      description: "Le produit a été ajouté à votre panier.",
    });
  };

  const handleImageGenerated = (imageUrl: string, imageName: string) => {
    setDesignImage(imageUrl);
    setDesignName(imageName);
  };

  const productColors = [
    { name: 'Noir', value: '#000000' },
    { name: 'Bleu', value: '#0066CC' },
    { name: 'Blanc', value: '#FFFFFF' }
  ];

  const textColors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
  const fontOptions = ['Arial', 'Helvetica', 'Times New Roman', 'Impact'];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {isLoading ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-white/60">Chargement du produit...</p>
          </div>
        ) : !product ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
            <p className="text-white/60">Le produit que vous recherchez n'existe pas.</p>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Product Images */}
              <div className="space-y-6">
                <GlassCard className="p-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-auto rounded-lg"
                  />
                </GlassCard>
              </div>

              {/* Right Column - Product Info & Customization */}
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                      <p className="text-3xl font-bold text-winshirt-blue">{product.price}€</p>
                    </div>
                    <SocialShareButton
                      url={`/products/${product.id}`}
                      title={product.name}
                      description={product.description}
                      className="ml-4"
                    />
                  </div>
                  <p className="text-white/80 mb-6">{product.description}</p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Tailles disponibles</h3>
                    <div className="flex space-x-2">
                      {product.available_sizes && product.available_sizes.map((size) => (
                        <Badge
                          key={size}
                          variant={selectedSize === size ? "default" : "secondary"}
                          onClick={() => setSelectedSize(size)}
                          className="cursor-pointer px-4 py-2"
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {product.available_colors && product.available_colors.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Couleurs disponibles</h3>
                      <div className="flex space-x-2">
                        {product.available_colors.map((color) => (
                          <Badge
                            key={color}
                            variant={selectedColor === color ? "default" : "secondary"}
                            onClick={() => setSelectedColor(color)}
                            className="cursor-pointer px-4 py-2"
                          >
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full" onClick={handleAddToCart}>
                    Ajouter au panier
                  </Button>
                </GlassCard>

                {/* Customization Section */}
                {product.is_customizable && (
                  <GlassCard className="p-0 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 cursor-pointer flex items-center justify-between"
                      onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
                    >
                      <span className="text-white font-semibold">Commencer à personnaliser</span>
                      <ChevronDown 
                        className={`h-5 w-5 text-white transition-transform duration-300 ${
                          isCustomizationOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                    
                    {isCustomizationOpen && (
                      <div className="p-6">
                        <Tabs defaultValue="design" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="design">Design</TabsTrigger>
                            <TabsTrigger value="texte">Texte</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="design" className="space-y-6">
                            <div>
                              <h4 className="text-lg font-medium mb-4">Couleur du produit</h4>
                              <div className="flex gap-3">
                                {productColors.map((color) => (
                                  <div
                                    key={color.name}
                                    className={`w-12 h-12 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${
                                      selectedProductColor === color.name 
                                        ? 'border-white shadow-lg' 
                                        : 'border-gray-500'
                                    }`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setSelectedProductColor(color.name)}
                                    title={color.name}
                                  />
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-medium mb-4">Zone de design</h4>
                              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-black/20 min-h-[200px] flex flex-col justify-center">
                                {designImage ? (
                                  <div className="space-y-3">
                                    <img 
                                      src={designImage} 
                                      alt={designName} 
                                      className="max-h-40 mx-auto rounded-md shadow-md" 
                                    />
                                    <p className="text-sm text-gray-300">{designName}</p>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setDesignImage('');
                                        setDesignName('');
                                      }}
                                    >
                                      Supprimer
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <p className="text-gray-400">Aucun design sélectionné</p>
                                    <p className="text-xs text-gray-500">
                                      Ajoutez votre propre design ou générez-en un avec l'IA
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-3 gap-3 mt-4">
                                <UploadImageField
                                  label=""
                                  value={designImage}
                                  onChange={(url) => {
                                    setDesignImage(url);
                                    setDesignName('Image importée');
                                  }}
                                  showPreview={false}
                                  className="contents"
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setIsAIGeneratorOpen(true)}
                                  className="w-full"
                                >
                                  Générer IA
                                </Button>
                                <Button variant="outline" size="sm" className="w-full">
                                  Galerie
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="texte" className="space-y-6">
                            <div>
                              <h4 className="text-lg font-medium mb-4">Texte personnalisé</h4>
                              <textarea
                                className="w-full p-4 border rounded-md bg-gray-800/50 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                                placeholder="Entrez votre texte ici..."
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                Maximum 50 caractères par ligne recommandé
                              </p>
                            </div>

                            <div>
                              <h4 className="text-lg font-medium mb-4">Options de texte</h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Police</label>
                                  <select 
                                    className="w-full p-3 border rounded-md bg-gray-800/50 text-white"
                                    value={selectedTextFont}
                                    onChange={(e) => setSelectedTextFont(e.target.value)}
                                  >
                                    {fontOptions.map((font) => (
                                      <option key={font} value={font}>{font}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Couleur du texte</label>
                                  <div className="flex gap-3">
                                    {textColors.map((color) => (
                                      <div
                                        key={color}
                                        className={`w-8 h-8 rounded border-2 cursor-pointer transition-all hover:scale-110 ${
                                          selectedTextColor === color 
                                            ? 'border-white shadow-lg' 
                                            : 'border-gray-500'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedTextColor(color)}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </GlassCard>
                )}

                {/* Section Loterie */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    🎰 Participez à nos loteries
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    Chaque achat vous donne des tickets de loterie pour gagner des produits exclusifs !
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      Voir les loteries actives
                    </Button>
                    <Button variant="default" className="flex-1">
                      Mes tickets
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
      
      <AIImageGenerator
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onImageGenerated={handleImageGenerated}
      />
    </div>
  );
};

export default ProductDetail;
