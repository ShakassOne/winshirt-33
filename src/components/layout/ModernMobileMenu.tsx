
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import CartIcon from "@/components/cart/CartIcon";
import SignOutButton from "@/components/auth/SignOutButton";
import { useAuth } from "@/context/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const ModernMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdminCheck();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const menuItems = [
    { to: "/", label: "Accueil" },
    { to: "/products", label: "Shop" },
    { to: "/lotteries", label: "Loteries" },
  ];

  if (isAuthenticated && isAdmin) {
    menuItems.push({ to: "/admin", label: "Admin" });
  }

  return (
    <>
      {/* Mobile controls bar */}
      <div className="md:hidden flex items-center space-x-2">
        <ThemeToggle />
        <CartIcon />
        
        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="relative w-8 h-8 flex flex-col justify-center items-center z-[1001] focus:outline-none"
          aria-label="Toggle menu"
        >
          <span 
            className={`block h-0.5 w-6 bg-white/80 rounded transition-all duration-300 ease-in-out ${
              isOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}
          />
          <span 
            className={`block h-0.5 w-6 bg-white/80 rounded transition-all duration-300 ease-in-out my-1 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span 
            className={`block h-0.5 w-6 bg-white/80 rounded transition-all duration-300 ease-in-out ${
              isOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 z-[1000] transition-all duration-500 ease-in-out
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}>
        {/* Glassmorphic Background */}
        <div className="absolute inset-0 backdrop-blur-xl bg-black/60" />
        
        {/* Menu Content */}
        <div className={`
          relative h-full flex flex-col justify-center items-center p-8
          transition-all duration-700 ease-out
          ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        `}>
          {/* Logo */}
          <div className={`
            mb-16 transition-all duration-500 ease-out
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} style={{ transitionDelay: isOpen ? '200ms' : '0ms' }}>
            <Link to="/" onClick={closeMenu} className="logo">
              <span className="text-gradient text-3xl font-bold">WinShirt</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col items-center space-y-8 mb-16">
            {menuItems.map((item, index) => (
              <div
                key={item.to}
                className={`
                  transition-all duration-500 ease-out
                  ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
                `}
                style={{ 
                  transitionDelay: isOpen ? `${300 + index * 100}ms` : '0ms' 
                }}
              >
                <Link 
                  to={item.to} 
                  onClick={closeMenu}
                  className="
                    text-white text-2xl font-light tracking-wider uppercase
                    hover:text-primary transition-colors duration-300
                    relative group
                  "
                >
                  {item.label}
                  <span className="
                    absolute bottom-0 left-0 w-0 h-0.5 bg-primary
                    group-hover:w-full transition-all duration-300
                  " />
                </Link>
              </div>
            ))}
          </nav>

          {/* User Section */}
          <div className={`
            flex flex-col items-center space-y-6 max-w-xs w-full
            transition-all duration-500 ease-out
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} style={{ 
            transitionDelay: isOpen ? `${300 + menuItems.length * 100 + 100}ms` : '0ms' 
          }}>
            {isAuthenticated ? (
              <div className="flex flex-col items-center space-y-4 w-full">
                <Link 
                  to="/profile" 
                  onClick={closeMenu} 
                  className="
                    flex items-center justify-center gap-3 text-white/90
                    hover:text-white transition-colors duration-300
                    p-4 rounded-lg hover:bg-white/10 w-full
                  "
                >
                  <User className="w-5 h-5" />
                  <span className="text-lg">Mon Profil</span>
                </Link>
                
                <Link 
                  to="/orders" 
                  onClick={closeMenu} 
                  className="
                    text-white/90 hover:text-white transition-colors duration-300
                    p-4 rounded-lg hover:bg-white/10 w-full text-center text-lg
                  "
                >
                  Mes Commandes
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin/users" 
                    onClick={closeMenu} 
                    className="
                      text-white/90 hover:text-white transition-colors duration-300
                      p-4 rounded-lg hover:bg-white/10 w-full text-center text-lg
                    "
                  >
                    Utilisateurs
                  </Link>
                )}
                
                <div className="w-full mt-4">
                  <SignOutButton 
                    variant="outline" 
                    className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50" 
                  />
                </div>
              </div>
            ) : (
              <Link to="/auth" onClick={closeMenu} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-lg py-6"
                >
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernMobileMenu;
