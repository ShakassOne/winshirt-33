
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Users, 
  Gift, 
  Palette, 
  Image,
  Shirt,
  Truck,
  BarChart3,
  Settings,
  Smartphone,
  Mail,
  Globe,
  BookOpen,
  ShoppingBag
} from 'lucide-react';

const Dashboard = () => {
  const adminSections = [
    {
      title: "Analytics",
      description: "Statistiques et analyses détaillées",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Production DTF",
      description: "Gestion de la production DTF",
      icon: Shirt,
      path: "/admin/dtf-production",
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "Produits",
      description: "Gérer le catalogue de produits",
      icon: Package,
      path: "/admin/products",
      color: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      title: "Commandes",
      description: "Suivi et gestion des commandes",
      icon: ShoppingBag,
      path: "/admin/orders",
      color: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    {
      title: "Loteries",
      description: "Configuration des loteries",
      icon: Gift,
      path: "/admin/lotteries",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600"
    },
    {
      title: "Utilisateurs",
      description: "Gestion des comptes utilisateurs",
      icon: Users,
      path: "/admin/users",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    },
    {
      title: "Designs",
      description: "Bibliothèque de designs",
      icon: Palette,
      path: "/admin/designs",
      color: "bg-gradient-to-br from-pink-500 to-pink-600"
    },
    {
      title: "Mockups",
      description: "Templates de produits 3D",
      icon: Image,
      path: "/admin/mockups",
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600"
    },
    {
      title: "Livraison",
      description: "Options de livraison",
      icon: Truck,
      path: "/admin/shipping-options",
      color: "bg-gradient-to-br from-red-500 to-red-600"
    },
    {
      title: "Emails",
      description: "Notifications automatiques",
      icon: Mail,
      path: "/admin/emails",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    },
    {
      title: "Réseaux Sociaux",
      description: "Configuration des liens sociaux",
      icon: Globe,
      path: "/admin/social-networks",
      color: "bg-gradient-to-br from-violet-500 to-violet-600"
    },
    {
      title: "Lexique",
      description: "Gestion du lexique et glossaire",
      icon: BookOpen,
      path: "/Lexique",
      color: "bg-gradient-to-br from-teal-500 to-teal-600"
    },
    {
      title: "Thème",
      description: "Personnalisation de l'interface",
      icon: Settings,
      path: "/admin/theme",
      color: "bg-gradient-to-br from-slate-500 to-slate-600"
    }
  ];

  return (
    <div className="container mx-auto py-8 pt-32">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Tableau de bord Admin</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Gérez tous les aspects de votre plateforme WinShirt depuis ce tableau de bord centralisé
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.path} to={section.path} className="group">
              <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-6 rounded-2xl ${section.color} text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-bold">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {section.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-16">
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BarChart3 className="h-6 w-6 text-primary" />
              Aperçu rapide des statistiques
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white/50 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">-</div>
              <div className="text-sm font-medium text-muted-foreground">Commandes totales</div>
            </div>
            <div className="text-center p-6 bg-white/50 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">-</div>
              <div className="text-sm font-medium text-muted-foreground">Produits actifs</div>
            </div>
            <div className="text-center p-6 bg-white/50 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">-</div>
              <div className="text-sm font-medium text-muted-foreground">Utilisateurs inscrits</div>
            </div>
            <div className="text-center p-6 bg-white/50 rounded-xl">
              <div className="text-3xl font-bold text-primary mb-2">-</div>
              <div className="text-sm font-medium text-muted-foreground">Loteries actives</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
