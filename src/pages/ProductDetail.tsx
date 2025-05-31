
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Product, Design } from '@/types/supabase.types';
import { fetchProductById, fetchAllDesigns } from '@/services/api.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { RemoveFlatBackground } from '@/components/product/RemoveFlatBackground';
import CustomizationModal from '@/components/product/CustomizationModal';
import CaptureMockupButton from '@/components/product/CaptureMockupButton';
import { FloatingColorPicker } from '@/components/product/FloatingColorPicker';

interface ProductDetailProps {}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [svgContent, setSvgContent] = useState<string>('');
  const [selectedSide, setSelectedSide] = useState<'recto' | 'verso'>('recto');

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
  });

  const { data: designsData, isLoading: isLoadingDesigns, error: errorLoadingDesigns } = useQuery({
    queryKey: ['activeDesigns'],
    queryFn: fetchAllDesigns,
  });

  useEffect(() => {
    if (productData) {
      setProduct(productData);
    }
  }, [productData]);

  useEffect(() => {
    if (designsData) {
      setDesigns(designsData);
    }
  }, [designsData]);

  // Fonction améliorée pour détecter si c'est un SVG
  const isSvgDesign = (imageUrl: string): boolean => {
    if (!imageUrl) return false;
    
    // Détection stricte basée sur l'extension ou le data URI
    return imageUrl.toLowerCase().endsWith('.svg') || 
           imageUrl.includes('data:image/svg+xml');
  };

  const handleSideChange = (side: 'recto' | 'verso') => {
    setSelectedSide(side);
  };

  const handleImageUpload = (url: string) => {
    console.log('📁 [ProductDetail] Image uploadée:', url);
    setCustomImageUrl(url);
  };

  const handleBackgroundRemoved = (newUrl: string) => {
    console.log('✨ [ProductDetail] Arrière-plan supprimé, nouvelle URL:', newUrl);
    setCustomImageUrl(newUrl);
  };

  const handleSvgColorChange = (newColor: string) => {
    console.log('🎨 [ProductDetail] Nouvelle couleur SVG:', newColor);
  };

  const handleSvgContentChange = (newSvgContent: string) => {
    console.log('📄 [ProductDetail] Contenu SVG mis à jour');
    setSvgContent(newSvgContent);
  };

  const handleDesignSelect = (design: Design) => {
    console.log('🎨 [ProductDetail] Design sélectionné:', design.name, design.image_url);
    
    setSelectedDesign(design);
    setCustomImageUrl(design.image_url);
    
    // Reset des états SVG
    setSvgContent('');
    
    // Si c'est un SVG, ne pas définir d'image personnalisée traditionnelle
    if (isSvgDesign(design.image_url)) {
      console.log('🎨 [ProductDetail] SVG détecté, activation du mode SVG');
      setSelectedDesign(design);
    } else {
      console.log('📁 [ProductDetail] Image traditionnelle détectée');
      setCustomImageUrl(design.image_url);
    }
  };

  const getCurrentVisualContent = () => {
    // Si on a du contenu SVG personnalisé, l'utiliser en priorité
    if (svgContent && selectedDesign && isSvgDesign(selectedDesign.image_url)) {
      return (
        <div className="w-[200px] h-[200px] flex items-center justify-center">
          <div 
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      );
    }
    
    // Sinon, afficher l'image personnalisée ou celle du produit
    const imageToShow = customImageUrl || product?.image_url;
    if (imageToShow) {
      return (
        <img
          src={imageToShow}
          alt="Visuel personnalisé"
          className="w-[200px] h-[200px] object-contain"
        />
      );
    }
    
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {isLoading ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-white/60">Chargement du produit...</p>
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Erreur</h1>
            <p className="text-white/60">
              Une erreur s'est produite lors du chargement du produit.
            </p>
          </div>
        ) : !product ? (
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Produit non trouvé</h1>
            <p className="text-white/60">Le produit que vous recherchez n'existe pas.</p>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Product Image */}
              <GlassCard className="p-6 relative">
                <div className="relative">
                  <div
                    id="product-canvas"
                    className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundImage: `url(${product?.image_url})`,
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Zone de personnalisation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getCurrentVisualContent()}
                    </div>

                    {/* Bouton flottant pour le color picker SVG */}
                    {selectedDesign && isSvgDesign(selectedDesign.image_url) && (
                      <FloatingColorPicker
                        imageUrl={selectedDesign.image_url}
                        onColorChange={handleSvgColorChange}
                        onSvgContentChange={handleSvgContentChange}
                        className="top-4 right-4"
                      />
                    )}

                    {/* Bouton de suppression de fond existant */}
                    {customImageUrl && !isSvgDesign(customImageUrl) && (
                      <div className="absolute top-4 right-4">
                        <RemoveFlatBackground
                          imageUrl={customImageUrl}
                          onReady={handleBackgroundRemoved}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center mt-4 gap-4">
                    <Button
                      variant={selectedSide === 'recto' ? 'default' : 'outline'}
                      onClick={() => handleSideChange('recto')}
                      size="sm"
                    >
                      Recto
                    </Button>
                    <Button
                      variant={selectedSide === 'verso' ? 'default' : 'outline'}
                      onClick={() => handleSideChange('verso')}
                      size="sm"
                    >
                      Verso
                    </Button>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <CaptureMockupButton targetId="product-canvas" side={selectedSide} />
                  </div>
                </div>
              </GlassCard>

              {/* Right Column - Product Info and Customization */}
              <div className="space-y-6">
                {/* Product Info Section */}
                <GlassCard className="p-6">
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <p className="text-white/80 mb-4">{product.description}</p>
                  <p className="text-2xl font-bold text-green-400">Prix: {product.price}€</p>
                </GlassCard>

                {/* Customization Section */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Personnalisation</h3>
                  
                  <CustomizationModal
                    designs={designs}
                    selectedDesign={selectedDesign}
                    onDesignSelect={handleDesignSelect}
                    customImageUrl={customImageUrl}
                    onImageUpload={handleImageUpload}
                    onImageUrlChange={setCustomImageUrl}
                    onSvgColorChange={handleSvgColorChange}
                    onSvgContentChange={handleSvgContentChange}
                  >
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium">
                      Commencer à personnaliser
                    </Button>
                  </CustomizationModal>
                </GlassCard>

                {/* Add to Cart Section */}
                <GlassCard className="p-6">
                  <Button className="w-full">Ajouter au panier</Button>
                </GlassCard>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
