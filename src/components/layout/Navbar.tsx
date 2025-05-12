
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Menu, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import CartIcon from "@/components/cart/CartIcon";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    // Check user authentication status when component mounts
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Vous avez été déconnecté avec succès");
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Une erreur s'est produite lors de la déconnexion");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 pt-4">
        <div className="max-w-4xl mx-auto rounded-full bg-black/60 backdrop-blur-lg border border-white/10 shadow-lg">
          <div className="flex items-center justify-between h-14 px-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-gradient">WinShirt</span>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <ThemeToggle />
              <CartIcon />
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              <Link
                to="/"
                className="text-white/80 hover:text-white transition-colors px-3 py-1"
              >
                Accueil
              </Link>
              <Link
                to="/products"
                className="text-white/80 hover:text-white transition-colors px-3 py-1"
              >
                Shop
              </Link>
              <Link
                to="/lotteries"
                className="text-white/80 hover:text-white transition-colors px-3 py-1"
              >
                Loteries
              </Link>
              {isLoggedIn && (
                <Link
                  to="/admin"
                  className="text-white/80 hover:text-white transition-colors px-3 py-1"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* User Menu, Theme Toggle and Cart */}
            <div className="hidden md:flex items-center space-x-1">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuItem className="hover:bg-white/5">
                        <Link to="/account" className="flex w-full">Profil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/5">
                        <Link to="/orders" className="flex w-full">Mes commandes</Link>
                      </DropdownMenuItem>
                      {isLoggedIn && (
                        <>
                          <DropdownMenuItem className="hover:bg-white/5">
                            <Link to="/admin" className="flex w-full">Administration</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-white/5">
                            <Link to="/admin/mockups" className="flex w-full">Mockups Admin</Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem onClick={handleLogout} className="hover:bg-white/5 cursor-pointer">
                        Déconnexion
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem className="hover:bg-white/5">
                      <Link to="/login" className="flex w-full">Connexion</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <CartIcon />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 mt-2 glass-card max-w-4xl mx-auto px-4">
            <Link
              to="/"
              className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
              onClick={toggleMenu}
            >
              Shop
            </Link>
            <Link
              to="/lotteries"
              className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
              onClick={toggleMenu}
            >
              Loteries
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/admin"
                  className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Admin
                </Link>
                <Link
                  to="/admin/mockups"
                  className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Gestion des mockups
                </Link>
                <Link
                  to="/admin/theme"
                  className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Réglages du thème
                </Link>
                <Link
                  to="/account"
                  className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
                  onClick={toggleMenu}
                >
                  Mon compte
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left text-white/70 hover:text-white px-3 py-2 rounded-md"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
                onClick={toggleMenu}
              >
                Connexion
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
