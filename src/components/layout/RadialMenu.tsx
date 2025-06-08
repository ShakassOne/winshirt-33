import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Home, Shirt, Ticket, User } from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  { to: "/", icon: Home, label: "Accueil" },
  { to: "/products", icon: Shirt, label: "Shop" },
  { to: "/lotteries", icon: Ticket, label: "Loteries" },
  { to: "/account", icon: User, label: "Compte" },
];

const radius = 90;

export default function RadialMenu() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle button */}
      <button
        onClick={toggle}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue text-white shadow-lg focus:outline-none"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        <span className="sr-only">Menu</span>
      </button>
      {/* Menu items */}
      {items.map((item, index) => {
        const angle = (index / (items.length - 1)) * Math.PI / 2; // spread in quarter circle
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const Icon = item.icon;
        return (
          <motion.div
            key={item.to}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={open ? { x: -x, y: -y, scale: 1, opacity: 1 } : { x: 0, y: 0, scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, delay: index * 0.05 }}
            className="absolute bottom-0 right-0"
          >
            <Link
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-black/80 text-white backdrop-blur hover:bg-black"
            >
              <Icon className="w-5 h-5" />
              <span className="sr-only">{item.label}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
