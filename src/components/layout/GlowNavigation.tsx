
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, Heart, User, ShoppingCart } from 'lucide-react';
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
      <header className="fixed top-0 left-0 w-full z-50 pt-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Logo et actions mobiles */}
            <div className="flex items-center justify-between w-full max-w-sm">
              <Link to="/" className="flex-shrink-0">
                <span className="text-xl font-bold text-gradient">WinShirt</span>
              </Link>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <CartIcon />
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
              </div>
            </div>

            {/* Navigation Glow Mobile */}
            <ul 
              ref={navRef}
              className="glow-nav max-w-sm"
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
                    <Link to={item.path} className="glow-nav-link mobile-glow-nav-link">
                      <Icon className="glow-nav-icon mobile-glow-nav-icon" />
                      <span className="mobile-glow-nav-label">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <div id="nav-marker" ref={markerRef}></div>
            </ul>
          </div>
        </div>
      </header>
    );
  }

  // Navigation Desktop - centrée sur la page
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col items-center space-y-8">
        {/* Logo Desktop */}
        <Link to="/" className="flex-shrink-0">
          <span className="text-2xl font-bold text-gradient">WinShirt</span>
        </Link>

        {/* Navigation Glow Desktop */}
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

        {/* Actions Desktop */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <CartIcon />
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
        </div>
      </div>
    </div>
  );
};
