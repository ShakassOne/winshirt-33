
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types/supabase.types';
import { fetchAllProducts } from '@/services/api.service';

const InventoryAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchAllProducts
  });

  if (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger l'inventaire",
      variant: "destructive",
    });
  }

  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStock = (productId: string, increment: number) => {
    // Cette fonction sera implémentée dans une version future pour gérer le stock
    toast({
      title: "Fonction à venir",
      description: "La gestion de stock sera disponible prochainement",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20">
        {/* Header */}
        <section className="relative py-16 bg-gradient-to-b from-cyan-500/20 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Gestion du <span className="text-gradient">Stock</span>
            </h1>
            <p className="text-white/70 mt-2 max-w-2xl">
              Gérez l'inventaire et les niveaux de stock de vos produits.
            </p>
          </div>
        </section>
        
        {/* Inventory Table */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Inventaire des produits</CardTitle>
                  <div className="flex flex-wrap gap-4">
                    <Input 
                      placeholder="Rechercher un produit..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full md:w-64"
                    />
                    <Button variant="outline" onClick={() => toast({ title: "Fonctionnalité à venir" })}>
                      Exporter l'inventaire
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-white/10 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-white/5">
                        <TableHead>Produit</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead className="text-center">Stock disponible</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, index) => (
                          <TableRow key={index} className="hover:bg-white/5">
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-32 ml-auto" /></TableCell>
                          </TableRow>
                        ))
                      ) : filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id} className="hover:bg-white/5">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded bg-black/30 overflow-hidden">
                                  {product.image_url && (
                                    <img 
                                      src={product.image_url} 
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="font-medium">{product.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>{product.price.toFixed(2)} €</TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                                En stock
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateStock(product.id, -1)}
                                >
                                  -
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateStock(product.id, 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-white/60">
                            Aucun produit trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default InventoryAdmin;
