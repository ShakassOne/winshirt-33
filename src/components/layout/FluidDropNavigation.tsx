import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    { label: 'Shop', path: '/products' },
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
      className={`SMN_effect-66 ${isActivePath(href) ? 'active' : ''} text-foreground`}
      data-hover={text}
    >
      <div className="top" data-hover={text}></div>
      <div className="bot" data-hover={text}></div>
    </Link>
  );

  if (isMobile) {
    return (
      <>
        {/* Header mobile clean */}
        <header className={`fluid-header ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
          <div className="fluid-menu-container">
            {/* Logo */}
            <div className="fluid-logo-mobile">
              <Link to="/" className="text-foreground font-bold text-xl">
                WinShirt
              </Link>
            </div>

            {/* Actions mobiles */}
            <div className="fluid-actions-mobile">
              <Link to="/cart" className="fluid-cart-button-mobile text-foreground">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="fluid-cart-count-mobile">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="fluid-menu-toggle text-foreground"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </header>

        {/* Menu mobile avec animation */}
        {mobileMenuOpen && (
          <div className="fluid-mobile-menu">
            <div className="fluid-mobile-menu-content">
              <nav className="fluid-mobile-nav">
                {navItems.map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`fluid-mobile-nav-item text-foreground ${isActivePath(item.path) ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              <div className="fluid-mobile-auth">
                {isAuthenticated ? (
                  <button onClick={handleSignOut} className="fluid-mobile-contact-button">
                    Déconnexion
                  </button>
                ) : (
                  <Link to="/contact" className="fluid-mobile-contact-button" onClick={() => setMobileMenuOpen(false)}>
                    Contact
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <header className={`fluid-header ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div className="fluid-menu-container">
        {/* Logo */}
        <div className="fluid-logo">
          <Link to="/" className="text-foreground font-bold text-2xl">
            WinShirt
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
            <Link to="/contact" className="fluid-contact-button">
              Contact
            </Link>
          )}
          
          <Link to="/cart" className="fluid-cart-button text-foreground">
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