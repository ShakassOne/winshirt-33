
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Heart, User, ShoppingCart, Moon, Sun, Settings, Shirt, Clover } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/components/theme-provider';
import { toast } from 'sonner';

interface NavItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  label: string;
  onClick?: () => void;
  isConditional?: boolean;
  showWhen?: () => boolean;
  component?: React.ReactNode;
}

export const GlowNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, signOut } = useOptimizedAuth();
  const { isAdmin } = useAdminCheck();
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const markerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Déconnecté avec succès");
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      toast.error("Erreur de déconnexion. Veuillez réessayer.");
    }
  };

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Navigation items optimisés pour mobile - suppression des doublons connexion/déconnexion
  const navItems: NavItem[] = isMobile ? [
    { id: 'home', icon: Home, path: '/', label: 'Accueil' },
    { 
      id: 'products', 
      icon: Shirt, 
      path: '/products', 
      label: 'Shop'
    },
    { id: 'lotteries', icon: Clover, path: '/lotteries', label: 'Loteries' },
    { 
      id: 'cart', 
      icon: ShoppingCart, 
      path: '/cart', 
      label: 'Panier',
      component: itemCount > 0 ? (
        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-winshirt-purple text-[10px]">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      ) : null
    },
    { id: 'account', icon: User, path: '/account', label: 'Compte' },
    {
      id: 'admin',
      icon: Settings,
      label: 'Admin',
      path: '/admin',
      isConditional: true,
      showWhen: () => isAuthenticated && isAdmin
    },
  ] : [
    { id: 'home', icon: Home, path: '/', label: 'Accueil' },
    { 
      id: 'products', 
      icon: Shirt, 
      path: '/products', 
      label: 'Shop'
    },
    { id: 'lotteries', icon: Clover, path: '/lotteries', label: 'Loteries' },
    { id: 'account', icon: User, path: '/account', label: 'Compte' },
    { 
      id: 'cart', 
      icon: ShoppingCart, 
      path: '/cart', 
      label: `Panier${itemCount > 0 ? ` (${itemCount})` : ''}`,
      component: itemCount > 0 ? (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-winshirt-purple text-[10px]">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      ) : null
    },
    {
      id: 'admin',
      icon: Settings,
      label: 'Admin',
      path: '/admin',
      isConditional: true,
      showWhen: () => isAuthenticated && isAdmin
    },
    { 
      id: 'theme', 
      icon: theme === "light" ? Moon : Sun, 
      label: 'Thème',
      onClick: handleThemeToggle
    },
  ];

  // Filtrer les items selon les conditions
  const visibleItems = navItems.filter(item => {
    if (item.isConditional && item.showWhen) {
      return item.showWhen();
    }
    return true;
  });

  // Déterminer l'index actif basé sur la route
  useEffect(() => {
    const currentPath = location.pathname;
    const index = visibleItems.findIndex(item => {
      if (!item.path) return false;
      if (item.path === '/' && currentPath === '/') return true;
      if (item.path !== '/' && currentPath.startsWith(item.path)) return true;
      return false;
    });
    setActiveIndex(index >= 0 ? index : 0);
  }, [location.pathname, visibleItems]);

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

  const handleItemClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  if (isMobile) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 pt-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Logo Mobile */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-gradient">WinShirt</span>
            </Link>

            {/* Navigation Glow Mobile - Optimisée sur une ligne */}
            <ul 
              ref={navRef}
              className="glow-nav flex justify-center items-center max-w-full overflow-x-auto"
              onMouseLeave={handleMouseLeave}
            >
              {visibleItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === activeIndex;
                
                return (
                  <li
                    key={item.id}
                    className={`glow-nav-item ${isActive ? 'active' : ''} relative flex-shrink-0`}
                    onMouseMove={handleMouseMove}
                  >
                    <button 
                      onClick={() => handleItemClick(item)}
                      className="glow-nav-link mobile-glow-nav-link px-2 py-2"
                    >
                      <Icon className="glow-nav-icon mobile-glow-nav-icon w-4 h-4" />
                      <span className="mobile-glow-nav-label text-xs whitespace-nowrap">{item.label}</span>
                      {item.component}
                    </button>
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

  // Navigation Desktop - en haut et centrée
  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex flex-col items-center space-y-4">
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
          {visibleItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = index === activeIndex;
            
            return (
              <li
                key={item.id}
                className={`glow-nav-item ${isActive ? 'active' : ''} relative`}
                onMouseMove={handleMouseMove}
              >
                <button 
                  onClick={() => handleItemClick(item)}
                  className="glow-nav-link"
                  title={item.label}
                >
                  <Icon className="glow-nav-icon" />
                  {item.component}
                </button>
              </li>
            );
          })}
          <div id="nav-marker" ref={markerRef}></div>
        </ul>
      </div>
    </header>
  );
};
