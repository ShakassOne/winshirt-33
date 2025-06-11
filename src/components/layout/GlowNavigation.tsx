
import React, { useState, useEffect, useRef } from 'react';
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

// 🎯 ICI VOUS POUVEZ CHANGER LES ICÔNES FACILEMENT
const navItems: NavItem[] = [
  { id: 'home', icon: Home, path: '/', label: 'Accueil' },
  { id: 'products', icon: ShoppingCart, path: '/products', label: 'Shop' },
  { id: 'lotteries', icon: Heart, path: '/lotteries', label: 'Loteries' },
  { id: 'account', icon: User, path: '/account', label: 'Compte' }
];

export const GlowNavigation: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdminCheck();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);

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

  // Animation du marqueur
  useEffect(() => {
    if (!markerRef.current || !navRef.current) return;
    
    const activeItem = navRef.current.children[activeIndex] as HTMLElement;
    if (activeItem) {
      const { offsetLeft, offsetWidth } = activeItem;
      markerRef.current.style.left = `${offsetLeft}px`;
      markerRef.current.style.width = `${offsetWidth}px`;
    }
  }, [activeIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!markerRef.current) return;
    
    const target = e.currentTarget;
    const { offsetLeft, offsetWidth } = target;
    markerRef.current.style.left = `${offsetLeft}px`;
    markerRef.current.style.width = `${offsetWidth}px`;
  };

  const handleMouseLeave = () => {
    if (!markerRef.current || !navRef.current) return;
    
    const activeItem = navRef.current.children[activeIndex] as HTMLElement;
    if (activeItem) {
      const { offsetLeft, offsetWidth } = activeItem;
      markerRef.current.style.left = `${offsetLeft}px`;
      markerRef.current.style.width = `${offsetWidth}px`;
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <header className="desktop-header">
          <div className="desktop-header-content">
            <div className="desktop-header-nav">
              <div className="desktop-header-inner">
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
                    <Link to="/admin" className="block text-white/70 hover:text-white px-3 py-2 rounded-md" onClick={() => setIsMenuOpen(false)}>
                      Admin
                    </Link>
                    <Link to="/admin/users" className="block text-white/70 hover:text-white px-3 py-2 rounded-md" onClick={() => setIsMenuOpen(false)}>
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

        {/* Mobile Bottom Navigation avec effet Glow */}
        <div className="mobile-glow-nav">
          <ul 
            ref={navRef}
            className="glow-nav"
            onMouseLeave={handleMouseLeave}
          >
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;
              
              return (
                <li
                  key={item.id}
                  className={`glow-nav-item ${isActive ? 'active' : ''}`}
                  onMouseMove={handleMouseMove}
                >
                  <Link to={item.path} className="glow-nav-link">
                    <Icon className="glow-nav-icon" />
                    <span className="mobile-glow-nav-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <div id="nav-marker" ref={markerRef}></div>
          </ul>
        </div>
      </>
    );
  }

  // Desktop Navigation
  return (
    <header className="desktop-header">
      <div className="desktop-header-content">
        <div className="desktop-header-nav">
          <div className="desktop-header-inner">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-gradient">WinShirt</span>
            </Link>

            {/* Desktop Glow Navigation */}
            <div className="desktop-nav-center">
              <ul 
                ref={navRef}
                className="glow-nav"
                onMouseLeave={handleMouseLeave}
              >
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIndex;
                  
                  return (
                    <li
                      key={item.id}
                      className={`glow-nav-item ${isActive ? 'active' : ''}`}
                      onMouseMove={handleMouseMove}
                    >
                      <Link to={item.path} className="glow-nav-link">
                        <Icon className="glow-nav-icon" />
                      </Link>
                    </li>
                  );
                })}
                <div id="nav-marker" ref={markerRef}></div>
              </ul>
            </div>

            {/* User Menu, Theme Toggle and Cart */}
            <div className="flex items-center space-x-1">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
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
                            <Link to="/admin" className="flex w-full">Administration</Link>
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
