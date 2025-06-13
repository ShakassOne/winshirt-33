
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
  Globe
} from 'lucide-react';

const Dashboard = () => {
  const adminSections = [
    {
      title: "Produits",
      description: "Gérer le catalogue de produits",
      icon: Package,
      path: "/admin/products",
      color: "bg-blue-500"
    },
    {
      title: "Commandes",
      description: "Suivi et gestion des commandes",
      icon: Truck,
      path: "/admin/orders",
      color: "bg-green-500"
    },
    {
      title: "Production DTF",
      description: "Gestion de la production DTF",
      icon: Shirt,
      path: "/admin/dtf-production",
      color: "bg-purple-500"
    },
    {
      title: "Loteries",
      description: "Configuration des loteries",
      icon: Gift,
      path: "/admin/lotteries",
      color: "bg-yellow-500"
    },
    {
      title: "Utilisateurs",
      description: "Gestion des comptes utilisateurs",
      icon: Users,
      path: "/admin/users",
      color: "bg-indigo-500"
    },
    {
      title: "Designs",
      description: "Bibliothèque de designs",
      icon: Palette,
      path: "/admin/designs",
      color: "bg-pink-500"
    },
    {
      title: "Mockups",
      description: "Templates de produits 3D",
      icon: Image,
      path: "/admin/mockups",
      color: "bg-cyan-500"
    },
    {
      title: "Livraison",
      description: "Options de livraison",
      icon: Truck,
      path: "/admin/shipping-options",
      color: "bg-orange-500"
    },
    {
      title: "Emails",
      description: "Notifications automatiques",
      icon: Mail,
      path: "/admin/emails",
      color: "bg-red-500"
    },
    {
      title: "Réseaux Sociaux",
      description: "Configuration des liens sociaux",
      icon: Globe,
      path: "/admin/social-networks",
      color: "bg-emerald-500"
    },
    {
      title: "Thème",
      description: "Personnalisation de l'interface",
      icon: Settings,
      path: "/admin/theme",
      color: "bg-violet-500"
    },
    {
      title: "Analytics",
      description: "Statistiques et analyses",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "bg-teal-500"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
        <p className="text-muted-foreground">
          Gérez tous les aspects de votre plateforme WinShirt
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.path} to={section.path}>
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${section.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{section.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Aperçu rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Commandes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Produits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Utilisateurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground">Loteries actives</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
