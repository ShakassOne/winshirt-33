
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, Menu, ShoppingCart, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-gradient">WinShirt</span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-white/70 hover:text-white transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="text-white/70 hover:text-white transition-colors"
            >
              Produits
            </Link>
            <Link
              to="/lotteries"
              className="text-white/70 hover:text-white transition-colors"
            >
              Loteries
            </Link>
            <Link
              to="/admin"
              className="text-white/70 hover:text-white transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* User Menu and Cart */}
          <div className="hidden md:flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 border-white/20">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="hover:bg-white/5">
                  <Link to="/profile" className="flex w-full">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/5">
                  <Link to="/orders" className="flex w-full">Mes commandes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/5">
                  <Link to="/admin" className="flex w-full">Administration</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/5">
                  <Link to="/admin/mockups" className="flex w-full">Mockups Admin</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="hover:bg-white/5">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
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
              Produits
            </Link>
            <Link
              to="/lotteries"
              className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
              onClick={toggleMenu}
            >
              Loteries
            </Link>
            <Link
              to="/admin"
              className="block text-white/70 hover:text-white px-3 py-2 rounded-md"
              onClick={toggleMenu}
            >
              Admin
            </Link>
            <Link
              to="/admin/mockups"
              className="block text-white/70 hover:text-white px-3 py-2 rounded-md font-medium"
              onClick={toggleMenu}
            >
              Gestion des mockups
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
