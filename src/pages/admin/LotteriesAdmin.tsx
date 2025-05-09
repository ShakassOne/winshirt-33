
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { fetchAllLotteries, deleteLottery } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassCard from '@/components/ui/GlassCard';
import { Edit, Trash, Eye, Plus, Search, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import LotteryForm from '@/components/admin/LotteryForm';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

const LotteriesAdmin = () => {
  const { toast: toastHook } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLotteryForm, setShowLotteryForm] = useState(false);
  const [editingLottery, setEditingLottery] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const { data: lotteries, isLoading, error, refetch } = useQuery({
    queryKey: ['adminLotteries'],
    queryFn: fetchAllLotteries,
  });

  const handleCreateSuccess = () => {
    refetch();
    toastHook({
      title: "Loterie créée",
      description: "La nouvelle loterie a été ajoutée avec succès",
    });
  };

  const handleEditLottery = (lottery: any) => {
    setEditingLottery(lottery);
    setShowLotteryForm(true);
  };

  const handleDeleteLottery = async (lotteryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette loterie ?')) {
      try {
        await deleteLottery(lotteryId);
        toast.success('Loterie supprimée avec succès');
        refetch();
      } catch (error) {
        toast.error('Erreur lors de la suppression de la loterie');
      }
    }
  };

  const filteredLotteries = lotteries?.filter(lottery => {
    const matchesSearch = 
      lottery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lottery.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!activeFilter) return matchesSearch;
    
    if (activeFilter === 'active') return matchesSearch && lottery.is_active;
    if (activeFilter === 'inactive') return matchesSearch && !lottery.is_active;
    if (activeFilter === 'featured') return matchesSearch && lottery.is_featured;
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {/* Header Section */}
        <section className="relative py-16 bg-gradient-to-b from-winshirt-purple/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Gestion des <span className="text-gradient">Loteries</span>
                </h1>
                <p className="text-white/70 mt-2">
                  Créez et gérez vos loteries
                </p>
              </div>
              
              <Button 
                className="bg-gradient-purple mt-4 md:mt-0" 
                size="lg"
                onClick={() => {
                  setEditingLottery(null);
                  setShowLotteryForm(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle loterie
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
                    placeholder="Rechercher une loterie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant={activeFilter === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter(null)}
                  >
                    Toutes
                  </Button>
                  <Button 
                    variant={activeFilter === 'active' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter('active')}
                  >
                    Actives
                  </Button>
                  <Button 
                    variant={activeFilter === 'inactive' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter('inactive')}
                  >
                    Terminées
                  </Button>
                  <Button 
                    variant={activeFilter === 'featured' ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setActiveFilter('featured')}
                  >
                    En vedette
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Lotteries Table */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <GlassCard className="p-0 overflow-hidden">
              {isLoading ? (
                <div className="p-10 text-center">Chargement des loteries...</div>
              ) : error ? (
                <div className="p-10 text-center">Erreur lors du chargement des loteries</div>
              ) : filteredLotteries?.length === 0 ? (
                <div className="p-10 text-center">Aucune loterie ne correspond à votre recherche</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/20">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Valeur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Participants</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Tirage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredLotteries?.map((lottery) => (
                        <tr key={lottery.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded overflow-hidden">
                              <img 
                                src={lottery.image_url} 
                                alt={lottery.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{lottery.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {lottery.value.toFixed(2)} €
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="mr-2">{lottery.participants}/{lottery.goal}</span>
                              <div className="w-20 bg-white/10 rounded-full h-2">
                                <div 
                                  className="bg-winshirt-blue h-2 rounded-full" 
                                  style={{ width: `${Math.min((lottery.participants / lottery.goal) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(lottery.draw_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <Badge variant={lottery.is_active ? "default" : "secondary"} className={lottery.is_active ? "bg-green-500" : ""}>
                                {lottery.is_active ? 'Active' : 'Terminée'}
                              </Badge>
                              {lottery.is_featured && (
                                <Badge variant="outline" className="bg-winshirt-purple/20 text-xs">
                                  En vedette
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/lotteries/${lottery.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEditLottery(lottery)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Award className="h-4 w-4 text-yellow-500" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteLottery(lottery.id)}
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

      <LotteryForm
        isOpen={showLotteryForm}
        onClose={() => {
          setShowLotteryForm(false);
          setEditingLottery(null);
        }}
        onSuccess={handleCreateSuccess}
        lottery={editingLottery}
      />
    </div>
  );
};

export default LotteriesAdmin;
