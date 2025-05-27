
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAllProducts, fetchAllMockups, deleteProduct } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassCard from '@/components/ui/GlassCard';
import { Edit, Trash, Eye, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import ProductForm from '@/components/admin/ProductForm';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Product } from '@/types/supabase.types';
import { useStableAdminQuery } from '@/hooks/useStableAdminQuery';
import { useStableAdminMutations } from '@/hooks/useStableAdminMutations';

const ProductsAdmin = React.memo(() => {
  console.log('🏪 [ProductsAdmin] Rendering page...');
  
  const { toast: toastHook } = useToast();
  const { invalidateProducts } = useStableAdminMutations();
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // ✅ Queries stables séparées
  const { data: products, isLoading: productsLoading, error: productsError } = useStableAdminQuery({
    queryKey: ['adminProducts'],
    queryFn: fetchAllProducts,
    debugName: 'AdminProducts',
  });

  const { data: mockups, isLoading: mockupsLoading } = useStableAdminQuery({
    queryKey: ['adminMockups'],
    queryFn: fetchAllMockups,
    debugName: 'AdminMockups',
  });

  const handleCreateSuccess = React.useCallback(() => {
    console.log('✅ [ProductsAdmin] Product operation success - invalidating only');
    invalidateProducts(); // ✅ Une seule invalidation, pas de refetch
    toastHook({
      title: "Produit créé",
      description: "Le nouveau produit a été ajouté avec succès",
    });
  }, [invalidateProducts, toastHook]);

  const handleEditProduct = React.useCallback((product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  }, []);

  const handleDeleteProduct = React.useCallback(async (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(productId);
        toast.success('Produit supprimé avec succès');
        invalidateProducts(); // ✅ Une seule invalidation
      } catch (error) {
        toast.error('Erreur lors de la suppression du produit');
      }
    }
  }, [invalidateProducts]);

  const filteredProducts = useMemo(() => {
    return products?.filter((product: Product) => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !activeCategory || product.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, activeCategory]);

  const categories = useMemo(() => {
    return products ? [...new Set(products.map((product: Product) => product.category))] : [];
  }, [products]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {/* Header Section */}
        <section className="relative py-16 bg-gradient-to-b from-winshirt-blue/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Gestion des <span className="text-gradient">Produits</span>
                </h1>
                <p className="text-white/70 mt-2">
                  Ajoutez, modifiez et supprimez les produits de votre boutique
                </p>
              </div>
              
              <Button 
                className="bg-gradient-purple mt-4 md:mt-0" 
                size="lg"
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau produit
              </Button>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <GlassCard className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                  <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={activeCategory === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveCategory(null)}
                  >
                    Tous
                  </Button>
                  
                  {categories.map((category: string) => (
                    <Button 
                      key={category} 
                      variant={activeCategory === category ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Products Table */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <GlassCard className="p-0 overflow-hidden">
              {productsLoading ? (
                <div className="p-10 text-center">Chargement des produits...</div>
              ) : productsError ? (
                <div className="p-10 text-center">Erreur lors du chargement des produits</div>
              ) : filteredProducts?.length === 0 ? (
                <div className="p-10 text-center">Aucun produit ne correspond à votre recherche</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/20">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Catégorie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Caractéristiques</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredProducts?.map((product: Product) => (
                        <tr key={product.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded overflow-hidden">
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.price.toFixed(2)} €
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {product.is_customizable && (
                                <Badge variant="outline" className="bg-winshirt-purple/20 text-xs">Personnalisable</Badge>
                              )}
                              {product.tickets_offered > 0 && (
                                <Badge variant="outline" className="bg-winshirt-blue/20 text-xs">
                                  {product.tickets_offered} {product.tickets_offered > 1 ? 'tickets' : 'ticket'}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={product.is_active ? "default" : "secondary"} className={product.is_active ? "bg-green-500" : ""}>
                              {product.is_active ? 'Actif' : 'Inactif'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/products/${product.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {showProductForm && (
        <ProductForm 
          isOpen={showProductForm} 
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }} 
          onSuccess={handleCreateSuccess}
          initialData={editingProduct}
          mockups={mockups || []} // ✅ Mockups passés en props
        />
      )}
    </div>
  );
});

ProductsAdmin.displayName = 'ProductsAdmin';

export default ProductsAdmin;
