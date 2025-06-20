
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useCart } from '@/context/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export const SimpleNavigation: React.FC = () => {
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
    { label: 'Accueil', path: '/' },
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

  if (isMobile) {
    return (
      <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-gradient">
              WinShirt
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Panier Mobile */}
            <Link to="/cart" className="relative lg:hidden">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-winshirt-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu */}
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
    <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gradient">
            WinShirt
          </Link>

          {/* Navigation Menu */}
          <nav className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? 'text-winshirt-purple'
                    : 'text-foreground hover:text-winshirt-purple'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Panier */}
            <Link to="/cart" className="nav-link relative px-3 py-2">
              <div className="flex items-center space-x-1">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-sm font-medium">Panier</span>
                {itemCount > 0 && (
                  <span className="bg-winshirt-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Contact/User */}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="nav-link"
              >
                Déconnexion
              </Button>
            ) : (
              <Link to="/auth" className="nav-link px-4 py-2 text-sm font-medium">
                Contact
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
