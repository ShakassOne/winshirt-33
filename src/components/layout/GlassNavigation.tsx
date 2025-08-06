
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Heart, User, Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import CartIcon from '@/components/cart/CartIcon';
import SignOutButton from '@/components/auth/SignOutButton';
import { useAuth } from '@/context/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', icon: Home, path: '/', label: 'Accueil' },
  { id: 'products', icon: ShoppingCart, path: '/products', label: 'Shop' },
  { id: 'lotteries', icon: Heart, path: '/lotteries', label: 'Loteries' },
  { id: 'account', icon: User, path: '/account', label: 'Compte' }
];

export const GlassNavigation: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdminCheck();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Déterminer l'index actif basé sur la route
  useEffect(() => {
    const currentPath = location.pathname;
    const index = navItems.findIndex(item => {
      if (item.path === '/' && currentPath === '/') return true;
      if (item.path !== '/' && currentPath.startsWith(item.path)) return true;
      return false;
    });
    setActiveIndex(index >= 0 ? index : 0);
  }, [location.pathname]);

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 w-full z-50">
          <div className="container mx-auto px-4 pt-4 py-[20px]">
            <div className="max-w-4xl mx-auto rounded-full bg-black/60 backdrop-blur-lg border border-white/10 shadow-lg">
              <div className="flex items-center justify-between h-14 px-6">
                <Link to="/" className="flex-shrink-0">
                  <span className="text-xl font-bold text-gradient">WinShirt</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <CartIcon />
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none"
                  >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden py-4 mt-2 glass-card max-w-4xl mx-auto px-4">
                <Link to="/" className="block text-white/70 hover:text-white px-3 py-2 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  Accueil
                </Link>
                <Link to="/products" className="block text-white/70 hover:text-white px-3 py-2 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  Shop
                </Link>
                <Link to="/lotteries" className="block text-white/70 hover:text-white px-3 py-2 rounded-md" onClick={() => setIsMenuOpen(false)}>
                  Loteries
                </Link>
                {isAuthenticated && isAdmin && (
                  <>
                    <Link
                      to="/admin/designs"
                      className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Visuels
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Utilisateurs
                    </Link>
                  </>
                )}
                <div className="px-3 py-2">
                  {isAuthenticated ? (
                    <SignOutButton variant="outline" className="w-full" />
                  ) : (
                    <Link to="/auth" className="block text-white/70 hover:text-white px-3 py-2 rounded-md text-center" onClick={() => setIsMenuOpen(false)}>
                      Se connecter
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <div className="glass-nav-mobile">
          <div className="flex justify-around items-center relative">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`glass-nav-mobile-item ${isActive ? 'active' : ''}`}
                  style={{ flex: '1' }}
                >
                  {isActive && (
                    <div className="glass-nav-mobile-indicator" />
                  )}
                  <Icon className={`h-5 w-5 relative z-10 ${isActive ? 'text-white' : 'text-white/60'}`} />
                  <span className={`text-xs mt-1 relative z-10 ${isActive ? 'text-white' : 'text-white/60'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // Desktop Navigation
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 pt-4 py-[20px]">
        <div className="max-w-4xl mx-auto glass-nav">
          <div className="flex items-center justify-between h-16 px-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-gradient">WinShirt</span>
            </Link>

            {/* Desktop Glass Navigation */}
            <nav className="flex items-center space-x-2 relative">
              <div className="flex space-x-1 relative p-1">
                {/* Sliding Indicator */}
                <div
                  className="glass-nav-indicator"
                  style={{
                    width: '48px',
                    height: '48px',
                    transform: `translateX(${activeIndex * 52}px)`,
                  }}
                />
                
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIndex;
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`glass-nav-item ${isActive ? 'active' : ''}`}
                      style={{ width: '48px', height: '48px' }}
                    >
                      <Icon className={`h-5 w-5 relative z-10 ${isActive ? 'text-white' : 'text-white/60'}`} />
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* User Menu, Theme Toggle and Cart */}
            <div className="flex items-center space-x-1">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white glass-nav-item">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem className="hover:bg-white/5">
                        <Link to="/account" className="flex w-full">Profil</Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuItem className="hover:bg-white/5">
                            <Link to="/admin/designs" className="flex w-full">Visuels</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-white/5">
                            <Link to="/admin/users" className="flex w-full">Utilisateurs</Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem className="hover:bg-white/5 p-0">
                        <SignOutButton variant="ghost" className="w-full justify-start px-2 border-0 shadow-none" />
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem className="hover:bg-white/5">
                      <Link to="/auth" className="flex w-full">Se connecter</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <CartIcon />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
