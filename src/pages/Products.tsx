
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAllProducts } from '@/services/api.service';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Product } from '@/types/supabase.types';

const Products = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  const categories = products 
    ? [...new Set(products.map((product: Product) => product.category))] 
    : [];

  const filteredProducts = products?.filter((product: Product) => {
    const matchesCategory = category ? product.category === category : true;
    const matchesSearch = searchTerm 
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
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
              <div className="text-center py-20">
                <p>Chargement des produits...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p>Une erreur est survenue lors du chargement des produits.</p>
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
