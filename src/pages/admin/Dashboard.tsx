
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { ShoppingBag, Ticket, Award, ShoppingCart, Users, Image, Palette, Settings, bar-chart } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const adminModules = [
    {
      title: 'Analytics',
      description: 'Statistiques et performances de vente',
      icon: <bar-chart className="h-8 w-8 text-emerald-500" />,
      route: '/admin/analytics',
      color: 'from-emerald-500/20 to-emerald-500/5'
    },
    {
      title: 'Produits',
      description: 'Gérez les produits de votre boutique',
      icon: <ShoppingBag className="h-8 w-8 text-winshirt-blue" />,
      route: '/admin/products',
      color: 'from-winshirt-blue/20 to-winshirt-blue/5'
    },
    {
      title: 'Loteries',
      description: 'Gérez les loteries et leurs participants',
      icon: <Ticket className="h-8 w-8 text-winshirt-purple" />,
      route: '/admin/lotteries',
      color: 'from-winshirt-purple/20 to-winshirt-purple/5'
    },
    {
      title: 'Mockups',
      description: 'Gérez les mockups et zones d\'impression',
      icon: <Image className="h-8 w-8 text-green-500" />,
      route: '/admin/mockups',
      color: 'from-green-500/20 to-green-500/5'
    },
    {
      title: 'Designs',
      description: 'Gérez les visuels pour la personnalisation',
      icon: <Palette className="h-8 w-8 text-indigo-500" />,
      route: '/admin/designs',
      color: 'from-indigo-500/20 to-indigo-500/5'
    },
    {
      title: 'Gagnants',
      description: 'Gérez les gagnants des loteries',
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      route: '/admin/winners',
      color: 'from-yellow-500/20 to-yellow-500/5'
    },
    {
      title: 'Commandes',
      description: 'Gérez les commandes et expéditions',
      icon: <ShoppingCart className="h-8 w-8 text-rose-500" />,
      route: '/admin/orders',
      color: 'from-rose-500/20 to-rose-500/5'
    },
    {
      title: 'Utilisateurs',
      description: 'Gérez les utilisateurs et les droits',
      icon: <Users className="h-8 w-8 text-amber-500" />,
      route: '/admin/users',
      color: 'from-amber-500/20 to-amber-500/5'
    },
    {
      title: 'Thème',
      description: 'Personnalisez l\'apparence du site',
      icon: <Settings className="h-8 w-8 text-purple-500" />,
      route: '/admin/theme',
      color: 'from-purple-500/20 to-purple-500/5'
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {/* Header Section */}
        <section className="relative py-16 bg-gradient-to-b from-winshirt-blue/20 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Tableau de bord <span className="text-gradient">Administration</span>
            </h1>
            <p className="text-white/70 mt-2">
              Gérez tous les aspects de votre boutique en ligne
            </p>
          </div>
        </section>
        
        {/* Admin Modules Grid */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminModules.map((module, index) => (
                <GlassCard 
                  key={index}
                  className={`p-6 cursor-pointer hover:scale-[1.02] transition-transform bg-gradient-to-br ${module.color}`}
                  onClick={() => navigate(module.route)}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-black/30 p-3 rounded-xl">
                      {module.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{module.title}</h2>
                      <p className="text-white/70">{module.description}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
