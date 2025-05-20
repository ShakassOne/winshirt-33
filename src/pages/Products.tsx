
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAllProducts } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Product } from '@/types/supabase.types';
import { Skeleton } from '@/components/ui/skeleton';

const Products = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    onError: (error) => {
      console.error("Failed to fetch products:", error);
    }
  });

  // Extract categories from products if they exist
  const categories = products && products.length 
    ? [...new Set(products.map((product: Product) => product.category))] 
    : [];

  // Filter products based on search term and category
  const filteredProducts = products?.filter((product: Product) => {
    const matchesCategory = !category || product.category === category;
    const matchesSearch = !searchTerm 
      ? true 
      : product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Function to retry fetching products
  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pb-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-winshirt-blue/20 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Notre <span className="text-gradient">Collection</span>
            </h1>
            <p className="text-lg text-white/70 text-center max-w-2xl mx-auto">
              Découvrez nos vêtements personnalisables de qualité avec une chance de gagner des prix exceptionnels
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
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={category === null ? "default" : "outline"}
                  onClick={() => setCategory(null)}
                  className={category === null ? "bg-gradient-purple" : ""}
                >
                  Tous
                </Button>
                {categories.map((cat: string) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    onClick={() => setCategory(cat)}
                    className={category === cat ? "bg-gradient-purple" : ""}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-64 w-full rounded-md" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-lg mb-4">Une erreur est survenue lors du chargement des produits.</p>
                <Button onClick={handleRetry}>Réessayer</Button>
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="text-center py-20">
                <p>Aucun produit ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts?.map((product: Product) => (
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
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
