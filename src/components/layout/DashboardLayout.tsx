
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Gift,
  Palette,
  Layers,
  Settings,
  Users,
  Package,
  Share2,
  ArrowLeft,
  Home
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', icon: <Home className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/admin/products', icon: <ShoppingCart className="h-5 w-5" />, label: 'Produits' },
    { path: '/admin/lotteries', icon: <Gift className="h-5 w-5" />, label: 'Loteries' },
    { path: '/admin/mockups', icon: <Layers className="h-5 w-5" />, label: 'Mockups' },
    { path: '/admin/designs', icon: <Palette className="h-5 w-5" />, label: 'Designs' },
    { path: '/admin/orders', icon: <Package className="h-5 w-5" />, label: 'Commandes' },
    { path: '/admin/users', icon: <Users className="h-5 w-5" />, label: 'Utilisateurs' },
    { path: '/admin/social', icon: <Share2 className="h-5 w-5" />, label: 'Réseaux Sociaux' },
    { path: '/admin/theme', icon: <Settings className="h-5 w-5" />, label: 'Apparence' }
  ];
  
  return (
    <div className="flex min-h-screen bg-winshirt-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 backdrop-blur-md border-r border-white/10 fixed h-full">
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold text-lg">Retour au site</span>
          </Link>
          
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-white/10",
                  location.pathname === item.path ? "bg-white/10 text-white" : "text-white/70"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
};
