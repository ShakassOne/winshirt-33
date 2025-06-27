import logger from '@/utils/logger';
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useProductsUnified } from '@/hooks/useProductsUnified';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Product } from '@/types/supabase.types';
import UnlockButton from '@/components/ui/UnlockButton';
const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  logger.log('[Products Page] Rendering with search:', searchTerm, 'category:', selectedCategory);
  const {
    data: products,
    isLoading,
    error,
    refetch,
    forceRefresh
  } = useProductsUnified();

  // Optimisation: mémoriser les produits filtrés avec debounce
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product: Product) => {
      const matchesSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory && product.is_active;
    });
  }, [products, searchTerm, selectedCategory]);

  // Optimisation: mémoriser les catégories uniques
  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = [...new Set(products.map((product: Product) => product.category))];
    return uniqueCategories.filter(Boolean);
  }, [products]);
  logger.log('[Products Page] Filtered products count:', filteredProducts?.length || 0);
  const handleRetry = () => {
    logger.log('[Products Page] Retrying fetch...');
    refetch();
  };
  const handleForceRefresh = () => {
    logger.log('[Products Page] Force refreshing...');
    forceRefresh();
  };
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-winshirt-purple/20 to-transparent py-0">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center my-[230px]">
              Nos <span className="text-gradient">Produits</span>
            </h1>
            <p className="text-lg text-white/70 text-center max-w-2xl mx-auto">
              Découvrez notre collection de produits personnalisables et uniques
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                <input type="text" placeholder="Rechercher un produit..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-md bg-white/5 backdrop-blur-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-winshirt-purple/50" />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant={selectedCategory === 'all' ? "default" : "outline"} onClick={() => setSelectedCategory('all')} className={selectedCategory === 'all' ? "bg-gradient-to-r from-winshirt-purple to-winshirt-blue" : ""}>
                  <Filter className="w-4 h-4 mr-2" />
                  Tous
                </Button>
                {categories.map(category => <Button key={category} variant={selectedCategory === category ? "default" : "outline"} onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? "bg-gradient-to-r from-winshirt-purple to-winshirt-blue" : ""}>
                    {category}
                  </Button>)}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleRetry} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
                <UnlockButton />
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8 pb-20">
          <div className="container mx-auto px-4">
            {isLoading ? <div className="text-center py-20">
                <p className="mb-4">Chargement des produits...</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleRetry} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                  <UnlockButton />
                </div>
              </div> : error ? <div className="text-center py-20">
                <p className="text-lg mb-4 text-red-500">Une erreur est survenue lors du chargement des produits.</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleRetry}>Réessayer</Button>
                  <Button onClick={handleForceRefresh} variant="outline">Force Refresh</Button>
                  <UnlockButton />
                </div>
              </div> : filteredProducts?.length === 0 ? <div className="text-center py-20">
                <p className="mb-4">Aucun produit ne correspond à votre recherche.</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleRetry} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                  <UnlockButton />
                </div>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts?.map(product => <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} image={product.image_url} category={product.category} isCustomizable={product.is_customizable} />)}
              </div>}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Products;