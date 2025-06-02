
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useDTFCheck } from '@/hooks/useDTFCheck';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import {
  BarChart3,
  Package,
  Users,
  Trophy,
  Palette,
  ShoppingCart,
  Truck,
  Instagram,
  Settings,
  FileText,
  Gift,
  Factory
} from 'lucide-react';

const Dashboard = () => {
  const { isAdmin, isLoading: adminLoading } = useAdminCheck();
  const { isDTFSupplier, isLoading: dtfLoading } = useDTFCheck();

  if (adminLoading || dtfLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-winshirt-purple mx-auto mb-4"></div>
            <p className="text-white/70">Vérification des permissions...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin && !isDTFSupplier) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
            <p className="text-white/70 mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder à cette section.
            </p>
            <Link to="/">
              <Button>Retour à l'accueil</Button>
            </Link>
          </GlassCard>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        <section className="relative py-16 bg-gradient-to-b from-winshirt-purple/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Tableau de <span className="text-gradient">Bord</span>
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                {isAdmin ? 'Administration complète' : 'Gestion de la production DTF'}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Sections Admin */}
              {isAdmin && (
                <>
                  <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                    <Link to="/admin/analytics" className="block">
                      <div className="flex items-center gap-4 mb-4">
                        <BarChart3 className="h-8 w-8 text-winshirt-purple" />
                        <div>
                          <h3 className="text-xl font-semibold">Analytics</h3>
                          <p className="text-white/70">Statistiques et métriques</p>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>

                  <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                    <Link to="/admin/orders" className="block">
                      <div className="flex items-center gap-4 mb-4">
                        <ShoppingCart className="h-8 w-8 text-winshirt-blue" />
                        <div>
                          <h3 className="text-xl font-semibold">Commandes</h3>
                          <p className="text-white/70">Gestion des commandes</p>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>

                  <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                    <Link to="/admin/products" className="block">
                      <div className="flex items-center gap-4 mb-4">
                        <Package className="h-8 w-8 text-green-500" />
                        <div>
                          <h3 className="text-xl font-semibold">Produits</h3>
                          <p className="text-white/70">Catalogue de produits</p>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>

                  <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                    <Link to="/admin/lotteries" className="block">
                      <div className="flex items-center gap-4 mb-4">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        <div>
                          <h3 className="text-xl font-semibold">Loteries</h3>
                          <p className="text-white/70">Gestion des tirages</p>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>

                  <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                    <Link to="/admin/designs" className="block">
                      <div className="flex items-center gap-4 mb-4">
                        <Palette className="h-8 w-8 text-purple-500" />
                        <div>
                          <h3 className="text-xl font-semibold">Designs</h3>
                          <p className="text-white/70">Bibliothèque de designs</p>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>

                  <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                    <Link to="/admin/mockups" className="block">
                      <div className="flex items-center gap-4 mb-4">
                        <FileText className="h-8 w-8 text-indigo-500" />
                        <div>
                          <h3 className="text-xl font-semibold">Mockups</h3>
                          <p className="text-white/70">Templates de produits</p>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>

                  <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                    <Link to="/admin/users" className="block">
                      <div className="flex items-center gap-4 mb-4">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="text-xl font-semibold">Utilisateurs</h3>
                          <p className="text-white/70">Gestion des comptes</p>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>

                  <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                    <Link to="/admin/shipping" className="block">
                      <div className="flex items-center gap-4 mb-4">
                        <Truck className="h-8 w-8 text-orange-500" />
                        <div>
                          <h3 className="text-xl font-semibold">Livraison</h3>
                          <p className="text-white/70">Options de livraison</p>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>

                  <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                    <Link to="/admin/social" className="block">
                      <div className="flex items-center gap-4 mb-4">
                        <Instagram className="h-8 w-8 text-pink-500" />
                        <div>
                          <h3 className="text-xl font-semibold">Réseaux Sociaux</h3>
                          <p className="text-white/70">Configuration sociale</p>
                        </div>
                      </div>
                    </Link>
                  </GlassCard>
                </>
              )}

              {/* Section DTF pour les fournisseurs DTF et admins */}
              {(isDTFSupplier || isAdmin) && (
                <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                  <Link to="/admin/dtf-production" className="block">
                    <div className="flex items-center gap-4 mb-4">
                      <Factory className="h-8 w-8 text-cyan-500" />
                      <div>
                        <h3 className="text-xl font-semibold">Production DTF</h3>
                        <p className="text-white/70">Suivi des commandes DTF</p>
                      </div>
                    </div>
                  </Link>
                </GlassCard>
              )}

              {/* Section Paramètres uniquement pour les admins */}
              {isAdmin && (
                <GlassCard className="p-6 hover:bg-gray-800/30 transition-colors">
                  <Link to="/admin/settings" className="block">
                    <div className="flex items-center gap-4 mb-4">
                      <Settings className="h-8 w-8 text-gray-500" />
                      <div>
                        <h3 className="text-xl font-semibold">Paramètres</h3>
                        <p className="text-white/70">Configuration générale</p>
                      </div>
                    </div>
                  </Link>
                </GlassCard>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
