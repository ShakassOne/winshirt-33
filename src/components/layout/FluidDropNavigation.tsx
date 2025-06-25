
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useCart } from '@/context/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const FluidDropNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, signOut } = useOptimizedAuth();
  const { isAdmin } = useAdminCheck();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navItems = [
    { label: 'Produits', path: '/products' },
    { label: 'Loteries', path: '/lotteries' },
    { label: 'Compte', path: '/account' },
  ];

  if (isAuthenticated && isAdmin) {
    navItems.push({ label: 'Admin', path: '/admin' });
  }

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Fonction pour créer l'effet SMN_effect-66
  const createSMNEffect = (text: string, href: string) => (
    <Link
      to={href}
      className={`SMN_effect-66 ${isActivePath(href) ? 'active' : ''}`}
      data-hover={text}
    >
      <div className="top" data-hover={text}></div>
      <div className="bot" data-hover={text}></div>
    </Link>
  );

  if (isMobile) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-gradient">
              WinShirt
            </Link>

            <Button
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? '×' : '☰'}
            </Button>

            <Link to="/cart" className="relative lg:hidden">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-winshirt-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden bg-background/95 backdrop-blur-sm border-t border-border">
              <nav className="py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 text-sm ${
                      isActivePath(item.path)
                        ? 'text-winshirt-purple font-medium'
                        : 'text-foreground hover:text-winshirt-purple'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="fluid-header">
      <div className="fluid-menu-container">
        {/* Logo */}
        <div className="fluid-logo">
          <Link to="/">
            <img 
              src="https://shakass.com/wp-content/uploads/2025/06/Logo-Winshirt-Blanc.svg" 
              alt="Logo Winshirt" 
            />
          </Link>
        </div>

        {/* Navigation avec effet SMN_effect-66 */}
        <nav className="fluid-nav-menu">
          {navItems.map((item, index) => (
            <li key={item.path} className={`fluid-nav-item fluid-nav-item-${index + 1}`}>
              {createSMNEffect(item.label, item.path)}
            </li>
          ))}
        </nav>

        {/* Bouton Contact/Auth et Panier */}
        <div className="fluid-actions">
          {isAuthenticated ? (
            <button onClick={handleSignOut} className="fluid-contact-button">
              Déconnexion
            </button>
          ) : (
            <Link to="/auth" className="fluid-contact-button">
              Contact
            </Link>
          )}
          
          <Link to="/cart" className="fluid-cart-button">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="fluid-cart-count">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
