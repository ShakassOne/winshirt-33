
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAllMockups } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassCard from '@/components/ui/GlassCard';
import { Edit, Trash, Eye, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import MockupForm from '@/components/admin/MockupForm';
import { useToast } from '@/hooks/use-toast';
import { Mockup } from '@/types/supabase.types';
import { UploadButton } from '@/components/ui/upload-button';

const MockupsAdmin = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMockupForm, setShowMockupForm] = useState(false);
  const [activeMockup, setActiveMockup] = useState<Mockup | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { data: mockups, isLoading, error, refetch } = useQuery({
    queryKey: ['adminMockups'],
    queryFn: fetchAllMockups,
  });

  const handleCreateSuccess = () => {
    refetch();
    toast({
      title: "Mockup créé",
      description: "Le nouveau mockup a été ajouté avec succès",
    });
  };

  const handleEditMockup = (mockup: Mockup) => {
    setActiveMockup(mockup);
    setShowMockupForm(true);
  };

  const handleCloseForm = () => {
    setActiveMockup(null);
    setShowMockupForm(false);
  };

  const filteredMockups = mockups?.filter((mockup: Mockup) => {
    const matchesSearch = 
      mockup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockup.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !activeCategory || mockup.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = mockups ? [...new Set(mockups.map((mockup: Mockup) => mockup.category))] : [];

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
                  Gestion des <span className="text-gradient">Mockups</span>
                </h1>
                <p className="text-white/70 mt-2">
                  Ajoutez, modifiez et supprimez les mockups de votre boutique
                </p>
              </div>
              
              <Button 
                className="bg-gradient-purple mt-4 md:mt-0" 
                size="lg"
                onClick={() => setShowMockupForm(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau mockup
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
                    placeholder="Rechercher un mockup..."
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

        {/* Mockups Table */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <GlassCard className="p-0 overflow-hidden">
              {isLoading ? (
                <div className="p-10 text-center">Chargement des mockups...</div>
              ) : error ? (
                <div className="p-10 text-center">Erreur lors du chargement des mockups</div>
              ) : filteredMockups?.length === 0 ? (
                <div className="p-10 text-center">Aucun mockup ne correspond à votre recherche</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/20">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Catégorie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Prix A4</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Zones d'impression</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredMockups?.map((mockup: Mockup) => (
                        <tr key={mockup.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded overflow-hidden bg-white/10 flex items-center justify-center">
                              {mockup.svg_front_url ? (
                                <img 
                                  src={mockup.svg_front_url} 
                                  alt={mockup.name} 
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="text-xs text-white/50">Pas d'image</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{mockup.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {mockup.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {mockup.price_a4.toFixed(2)} €
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="bg-winshirt-purple/20 text-xs">
                                {mockup.print_areas.length} zones
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={mockup.is_active ? "default" : "secondary"} className={mockup.is_active ? "bg-green-500" : ""}>
                              {mockup.is_active ? 'Actif' : 'Inactif'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditMockup(mockup)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
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
      
      {showMockupForm && (
        <MockupForm 
          isOpen={showMockupForm} 
          onClose={handleCloseForm} 
          onSuccess={handleCreateSuccess}
          initialData={activeMockup}
        />
      )}
    </div>
  );
};

export default MockupsAdmin;
