
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
      {/* Hamburger Button */}
      <div className="md:hidden flex items-center space-x-2">
        <ThemeToggle />
        <CartIcon />
        <button
          onClick={toggleMenu}
          className={`hamburger-btn ${isOpen ? 'active' : ''}`}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}>
        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="close-btn"
          aria-label="Close menu"
        >
          ×
        </button>

        {/* Menu Content */}
        <nav className="mobile-menu-content">
          <div className="menu-header">
            <Link to="/" onClick={closeMenu} className="logo">
              <span className="text-gradient text-2xl font-bold">WinShirt</span>
            </Link>
          </div>

          <ul className="menu-list">
            {menuItems.map((item, index) => (
              <li 
                key={item.to} 
                className="menu-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Link 
                  to={item.to} 
                  onClick={closeMenu}
                  className="menu-link"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="menu-footer">
            {isAuthenticated ? (
              <div className="auth-section">
                <Link to="/profile" onClick={closeMenu} className="profile-link">
                  <User className="w-5 h-5" />
                  <span>Mon Profil</span>
                </Link>
                <Link to="/orders" onClick={closeMenu} className="orders-link">
                  Mes Commandes
                </Link>
                {isAdmin && (
                  <Link to="/admin/users" onClick={closeMenu} className="admin-link">
                    Utilisateurs
                  </Link>
                )}
                <SignOutButton 
                  variant="outline" 
                  className="w-full mt-4 border-white/20 text-white hover:bg-white/10" 
                />
              </div>
            ) : (
              <Link to="/auth" onClick={closeMenu}>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>

      <style jsx>{`
        .hamburger-btn {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
        }

        .hamburger-btn span {
          width: 24px;
          height: 2px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 2px;
          transition: all 0.3s linear;
          position: relative;
          transform-origin: 1px;
        }

        .hamburger-btn.active span:first-child {
          transform: rotate(45deg);
        }

        .hamburger-btn.active span:nth-child(2) {
          opacity: 0;
          transform: translateX(20px);
        }

        .hamburger-btn.active span:nth-child(3) {
          transform: rotate(-45deg);
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          z-index: 1001;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }

        .mobile-menu-overlay.active .mobile-menu-content {
          transform: translateX(0);
        }

        .menu-header {
          margin-bottom: 3rem;
        }

        .menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: center;
        }

        .menu-item {
          margin: 1rem 0;
          opacity: 0;
          transform: translateY(30px);
          animation: none;
        }

        .mobile-menu-overlay.active .menu-item {
          animation: slideInUp 0.5s ease forwards;
        }

        .menu-link {
          color: white;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          display: block;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .menu-link:hover {
          color: #9b87f5;
          background: rgba(155, 135, 245, 0.1);
          transform: translateX(10px);
        }

        .menu-footer {
          margin-top: 3rem;
          text-align: center;
          width: 100%;
          max-width: 300px;
        }

        .auth-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .profile-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: white;
          text-decoration: none;
          padding: 0.75rem;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .profile-link:hover,
        .orders-link:hover,
        .admin-link:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .orders-link,
        .admin-link {
          color: white;
          text-decoration: none;
          padding: 0.75rem;
          border-radius: 8px;
          transition: background 0.3s ease;
          display: block;
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (min-width: 768px) {
          .mobile-menu-overlay {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default ModernMobileMenu;
