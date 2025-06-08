
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CartIcon from "@/components/cart/CartIcon";
import SignOutButton from "@/components/auth/SignOutButton";
import { useAuth } from "@/context/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import ModernMobileMenu from "./ModernMobileMenu";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdminCheck();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 pt-4 py-[20px]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto rounded-full bg-white/5 backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
        >
          <div className="flex items-center justify-between h-14 px-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-gradient">WinShirt</span>
            </Link>

            {/* Modern Mobile Menu */}
            <ModernMobileMenu />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="text-white/80 hover:text-white transition-colors px-3 py-1">
                Accueil
              </Link>
              <Link to="/products" className="text-white/80 hover:text-white transition-colors px-3 py-1">
                Shop
              </Link>
              <Link to="/lotteries" className="text-white/80 hover:text-white transition-colors px-3 py-1">
                Loteries
              </Link>
              {isAuthenticated && isAdmin && (
                <Link to="/admin" className="text-white/80 hover:text-white transition-colors px-3 py-1">
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
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem className="hover:bg-white/5">
                        <Link to="/profile" className="flex w-full">Profil</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-white/5">
                        <Link to="/orders" className="flex w-full">Mes commandes</Link>
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
                    <>
                      <DropdownMenuItem className="hover:bg-white/5">
                        <Link to="/auth" className="flex w-full">Se connecter</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <CartIcon />
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Navbar;
