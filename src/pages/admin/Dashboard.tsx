
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GlassCard from '@/components/ui/GlassCard';
import { Package, Gift, PaintBucket, Users, Settings } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-winshirt-blue/20 to-transparent">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Administration <span className="text-gradient">WinShirt</span>
            </h1>
            <p className="text-lg text-white/70 text-center max-w-2xl mx-auto">
              Gérez vos produits, loteries et plus encore
            </p>
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <AdminCard 
                title="Produits" 
                description="Gérer les produits de la boutique"
                icon={<Package className="w-8 h-8" />}
                to="/admin/products"
                color="from-blue-600 to-blue-400"
              />
              
              <AdminCard 
                title="Loteries" 
                description="Gérer les loteries en cours"
                icon={<Gift className="w-8 h-8" />}
                to="/admin/lotteries"
                color="from-purple-600 to-purple-400"
              />
              
              <AdminCard 
                title="Designs" 
                description="Gérer les designs personnalisables"
                icon={<PaintBucket className="w-8 h-8" />}
                to="/admin/designs"
                color="from-green-600 to-green-400"
              />
              
              <AdminCard 
                title="Utilisateurs" 
                description="Gérer les comptes utilisateurs"
                icon={<Users className="w-8 h-8" />}
                to="/admin/users"
                color="from-orange-600 to-orange-400"
              />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
            
            <GlassCard className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-gradient-to-r from-green-600 to-green-400">
                  Ajouter un nouveau produit
                </Button>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-400">
                  Créer une nouvelle loterie
                </Button>
                
                <Button className="bg-gradient-to-r from-blue-600 to-blue-400">
                  Ajouter un nouveau design
                </Button>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface AdminCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, description, icon, to, color }) => {
  return (
    <Link to={to}>
      <GlassCard className="p-6 h-full transition-all duration-300 hover:translate-y-[-5px]" hover3D>
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/70 mb-4">{description}</p>
        
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            Gérer
          </Button>
        </div>
      </GlassCard>
    </Link>
  );
};

export default AdminDashboard;
