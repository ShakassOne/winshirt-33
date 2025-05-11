
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { ThemeToggle } from '../theme-toggle';
import CartIndicator from '../cart/CartIndicator';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Produits', path: '/products' },
    { name: 'Loteries', path: '/lotteries' },
  ];

  return (
    <nav className="backdrop-blur-md bg-background/60 sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold">
                WinShirt
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex space-x-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.path)
                      ? 'text-white bg-primary/10'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <CartIndicator />
            <ThemeToggle />
          </div>
          <div className="flex items-center md:hidden">
            <CartIndicator />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden ${
          mobileMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive(item.path)
                  ? 'text-white bg-primary/10'
                  : 'text-white/60'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
