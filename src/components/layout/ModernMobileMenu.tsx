
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
        
        {/* Hamburger Menu Button - CodePen Style */}
        <div className="relative">
          <input
            type="checkbox"
            id="menu-toggle"
            className="hidden"
            checked={isOpen}
            onChange={toggleMenu}
          />
          <label
            htmlFor="menu-toggle"
            className="relative z-[1001] block w-8 h-8 cursor-pointer"
          >
            <span className={`
              block absolute h-0.5 w-6 bg-white rounded-sm transition-all duration-300 ease-in-out
              ${isOpen ? 'top-3.5 rotate-45' : 'top-2'}
            `} />
            <span className={`
              block absolute h-0.5 w-6 bg-white rounded-sm transition-all duration-300 ease-in-out top-3.5
              ${isOpen ? 'opacity-0' : 'opacity-100'}
            `} />
            <span className={`
              block absolute h-0.5 w-6 bg-white rounded-sm transition-all duration-300 ease-in-out
              ${isOpen ? 'top-3.5 -rotate-45' : 'top-5'}
            `} />
          </label>
        </div>
      </div>

      {/* Mobile Menu Overlay - CodePen Style */}
      <div className={`
        fixed top-0 left-0 w-full h-full z-[1000] transition-all duration-500 ease-in-out
        ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
      `}>
        {/* Glassmorphic Background */}
        <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/60 to-black/80" />
        
        {/* Menu Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center">
          {/* Logo */}
          <div className={`
            mb-12 transition-all duration-800 ease-out
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          `} style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}>
            <Link to="/" onClick={closeMenu}>
              <span className="text-gradient text-4xl font-bold tracking-wide">WinShirt</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col items-center space-y-6 mb-12">
            {menuItems.map((item, index) => (
              <div
                key={item.to}
                className={`
                  transition-all duration-700 ease-out
                  ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                `}
                style={{ 
                  transitionDelay: isOpen ? `${200 + index * 150}ms` : '0ms' 
                }}
              >
                <Link 
                  to={item.to} 
                  onClick={closeMenu}
                  className="
                    block text-white text-3xl font-light tracking-widest uppercase
                    hover:text-primary transition-all duration-300 ease-out
                    relative overflow-hidden group py-2 px-4
                  "
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="
                    absolute inset-0 bg-white/5 backdrop-blur-sm rounded-lg
                    scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out
                    origin-left
                  " />
                  <div className="
                    absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent
                    group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out
                  " />
                </Link>
              </div>
            ))}
          </nav>

          {/* User Section */}
          <div className={`
            flex flex-col items-center space-y-4 w-full max-w-xs px-8
            transition-all duration-700 ease-out
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
          `} style={{ 
            transitionDelay: isOpen ? `${200 + menuItems.length * 150 + 100}ms` : '0ms' 
          }}>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  onClick={closeMenu} 
                  className="
                    flex items-center justify-center gap-3 text-white/90 text-lg
                    hover:text-white transition-all duration-300 ease-out
                    p-4 rounded-xl hover:bg-white/10 w-full backdrop-blur-sm
                    border border-white/10 hover:border-white/20
                  "
                >
                  <User className="w-5 h-5" />
                  <span>Mon Profil</span>
                </Link>
                
                <Link 
                  to="/orders" 
                  onClick={closeMenu} 
                  className="
                    text-white/90 hover:text-white transition-all duration-300 ease-out
                    p-4 rounded-xl hover:bg-white/10 w-full text-lg backdrop-blur-sm
                    border border-white/10 hover:border-white/20
                  "
                >
                  Mes Commandes
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin/users" 
                    onClick={closeMenu} 
                    className="
                      text-white/90 hover:text-white transition-all duration-300 ease-out
                      p-4 rounded-xl hover:bg-white/10 w-full text-lg backdrop-blur-sm
                      border border-white/10 hover:border-white/20
                    "
                  >
                    Utilisateurs
                  </Link>
                )}
                
                <div className="w-full mt-2">
                  <SignOutButton 
                    variant="outline" 
                    className="
                      w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30
                      backdrop-blur-sm rounded-xl py-4 text-lg transition-all duration-300
                    " 
                  />
                </div>
              </>
            ) : (
              <Link to="/auth" onClick={closeMenu} className="w-full">
                <Button 
                  variant="outline" 
                  className="
                    w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30
                    backdrop-blur-sm rounded-xl py-6 text-lg transition-all duration-300
                  "
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
