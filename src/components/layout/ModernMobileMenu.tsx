
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

  const styles = {
    hamburgerBtn: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-around',
      width: '24px',
      height: '24px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '0',
      zIndex: 1001,
    },
    hamburgerSpan: {
      width: '24px',
      height: '2px',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '2px',
      transition: 'all 0.3s linear',
      position: 'relative' as const,
      transformOrigin: '1px',
    },
    hamburgerSpanActive1: {
      transform: 'rotate(45deg)',
    },
    hamburgerSpanActive2: {
      opacity: 0,
      transform: 'translateX(20px)',
    },
    hamburgerSpanActive3: {
      transform: 'rotate(-45deg)',
    },
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(15px)',
      zIndex: 1000,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' as const : 'hidden' as const,
      transition: 'all 0.3s ease',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuContent: {
      width: '100%',
      maxWidth: '400px',
      height: 'auto',
      maxHeight: '80vh',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
      opacity: isOpen ? 1 : 0,
      transition: 'all 0.3s ease',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    },
    menuList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      textAlign: 'center' as const,
      width: '100%',
    },
    menuItem: (index: number) => ({
      margin: '1rem 0',
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'translateY(0)' : 'translateY(30px)',
      transition: `all 0.5s ease ${index * 0.1}s`,
    }),
    menuLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '1.5rem',
      fontWeight: 300,
      letterSpacing: '2px',
      textTransform: 'uppercase' as const,
      transition: 'all 0.3s ease',
      display: 'block',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
    },
    menuFooter: {
      marginTop: '3rem',
      textAlign: 'center' as const,
      width: '100%',
      maxWidth: '300px',
    },
    authSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
      width: '100%',
    },
    profileLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      color: 'white',
      textDecoration: 'none',
      padding: '0.75rem',
      borderRadius: '8px',
      transition: 'background 0.3s ease',
    },
    ordersLink: {
      color: 'white',
      textDecoration: 'none',
      padding: '0.75rem',
      borderRadius: '8px',
      transition: 'background 0.3s ease',
      display: 'block',
      textAlign: 'center' as const,
    },
  };

  return (
    <>
      {/* Hamburger Button */}
      <div className="md:hidden flex items-center space-x-2">
        <ThemeToggle />
        <CartIcon />
        <button
          onClick={toggleMenu}
          style={styles.hamburgerBtn}
          aria-label="Toggle menu"
        >
          <span style={{
            ...styles.hamburgerSpan,
            ...(isOpen ? styles.hamburgerSpanActive1 : {})
          }}></span>
          <span style={{
            ...styles.hamburgerSpan,
            ...(isOpen ? styles.hamburgerSpanActive2 : {})
          }}></span>
          <span style={{
            ...styles.hamburgerSpan,
            ...(isOpen ? styles.hamburgerSpanActive3 : {})
          }}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div style={styles.overlay} onClick={closeMenu}>
        {/* Menu Content */}
        <nav style={styles.menuContent} onClick={(e) => e.stopPropagation()}>
          <div style={{ marginBottom: '3rem' }}>
            <Link to="/" onClick={closeMenu} className="logo">
              <span className="text-gradient text-2xl font-bold">WinShirt</span>
            </Link>
          </div>

          <ul style={styles.menuList}>
            {menuItems.map((item, index) => (
              <li 
                key={item.to} 
                style={styles.menuItem(index)}
              >
                <Link 
                  to={item.to} 
                  onClick={closeMenu}
                  style={styles.menuLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#9b87f5';
                    e.currentTarget.style.background = 'rgba(155, 135, 245, 0.1)';
                    e.currentTarget.style.transform = 'translateX(10px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div style={styles.menuFooter}>
            {isAuthenticated ? (
              <div style={styles.authSection}>
                <Link 
                  to="/profile" 
                  onClick={closeMenu} 
                  style={styles.profileLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <User className="w-5 h-5" />
                  <span>Mon Profil</span>
                </Link>
                <Link 
                  to="/orders" 
                  onClick={closeMenu} 
                  style={styles.ordersLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Mes Commandes
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin/users" 
                    onClick={closeMenu} 
                    style={styles.ordersLink}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
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
    </>
  );
};

export default ModernMobileMenu;
