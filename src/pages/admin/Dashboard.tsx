
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Ticket, Shirt, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminMenuItems = [
    {
      title: 'Gestion des produits',
      description: 'Ajoutez, modifiez et supprimez les produits de votre boutique',
      icon: <Package className="w-8 h-8 text-winshirt-blue" />,
      to: '/admin/products'
    },
    {
      title: 'Gestion des loteries',
      description: 'Gérez les loteries et les tickets offerts',
      icon: <Ticket className="w-8 h-8 text-winshirt-purple" />,
      to: '/admin/lotteries'
    },
    {
      title: 'Gestion des mockups',
      description: 'Créez et gérez les templates de personnalisation',
      icon: <Shirt className="w-8 h-8 text-winshirt-blue" />,
      to: '/admin/mockups'
    },
    {
      title: 'Gestion des utilisateurs',
      description: 'Gérez les comptes utilisateurs et leurs informations',
      icon: <User className="w-8 h-8 text-winshirt-purple" />,
      to: '#'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 py-16">
        <section className="relative py-12 bg-gradient-to-b from-winshirt-blue/20 to-transparent mb-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Tableau de bord <span className="text-gradient">administrateur</span>
            </h1>
            <p className="text-white/70 mt-2">
              Gérez votre boutique en ligne, vos produits et vos loteries
            </p>
          </div>
        </section>

        <section>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminMenuItems.map((item) => (
                <GlassCard 
                  key={item.title}
                  className="p-6 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => navigate(item.to)}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium">{item.title}</h3>
                      <p className="text-white/70 mt-1">{item.description}</p>
                    </div>
                    <div className="self-center">
                      <ArrowRight className="w-5 h-5 text-white/50" />
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
