import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import CartIcon from "@/components/cart/CartIcon";
import SignOutButton from "@/components/auth/SignOutButton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full bg-black/80 border-b border-white/10 fixed z-50 top-0 left-0 shadow">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-white tracking-wide">
          WinShirt
        </Link>

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
                <Link to="/admin/users" className="flex w-full">Utilisateurs</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              {/* BOUTON DECONNEXION */}
              <DropdownMenuItem className="hover:bg-white/5 p-0">
                <SignOutButton variant="ghost" className="w-full justify-start px-2 border-0 shadow-none" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <CartIcon />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
