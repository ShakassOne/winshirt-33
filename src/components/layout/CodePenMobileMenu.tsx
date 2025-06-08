
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const CodePenMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdminCheck();
  
  const logoControls = useAnimation();
  const menuBgTopControls = useAnimation();
  const menuBgMiddleControls = useAnimation();
  const menuBgBottomControls = useAnimation();
  const menuControls = useAnimation();
  const openTriggerControls = useAnimation();
  const closeTriggerControls = useAnimation();

  const menuItems = [
    { to: "/", label: "Accueil" },
    { to: "/products", label: "Shop" },
    { to: "/lotteries", label: "Loteries" },
  ];

  if (isAuthenticated && isAdmin) {
    menuItems.push({ to: "/admin", label: "Admin" });
  }

  const openMenu = async () => {
    setIsOpen(true);
    
    // Logo animation
    logoControls.start({
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    });

    // Open trigger bars animation
    setTimeout(() => {
      openTriggerControls.start({
        opacity: 0,
        transition: { duration: 0.1 }
      });
    }, 400);

    // Menu backgrounds animation
    setTimeout(() => {
      menuBgTopControls.start({
        y: "13%",
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
      
      menuBgMiddleControls.start({
        scaleY: 1,
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
      
      menuBgBottomControls.start({
        y: "-114%",
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
    }, 0);

    // Menu content animation
    setTimeout(() => {
      menuControls.start({
        y: 0,
        opacity: 1,
        visibility: "visible",
        transition: { duration: 0.6, ease: "easeOut" }
      });
    }, 600);

    // Close trigger animation
    setTimeout(() => {
      closeTriggerControls.start({
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" }
      });
    }, 0);
  };

  const closeMenu = async () => {
    // Menu content fade out
    menuControls.start({
      y: 20,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    });

    // Close trigger fade out
    closeTriggerControls.start({
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    });

    // Menu backgrounds animation with color change
    setTimeout(() => {
      menuBgTopControls.start({
        y: "-113%",
        backgroundColor: "#6295ca",
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
      
      menuBgMiddleControls.start({
        scaleY: 0,
        backgroundColor: "#6295ca",
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
      
      menuBgBottomControls.start({
        y: "23%",
        backgroundColor: "#6295ca",
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
    }, 200);

    // Logo animation
    setTimeout(() => {
      logoControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
    }, 200);

    // Open trigger animation
    setTimeout(() => {
      openTriggerControls.start({
        opacity: 1,
        transition: { duration: 1, ease: "easeOut" }
      });
    }, 400);

    // Reset background colors
    setTimeout(() => {
      menuBgTopControls.start({ backgroundColor: "#ffffff" });
      menuBgMiddleControls.start({ backgroundColor: "#ffffff" });
      menuBgBottomControls.start({ backgroundColor: "#ffffff" });
    }, 1000);

    setTimeout(() => {
      setIsOpen(false);
    }, 1200);
  };

  useEffect(() => {
    // Initialize menu as hidden
    menuControls.set({
      y: 30,
      opacity: 0,
      visibility: "hidden"
    });
    
    closeTriggerControls.set({
      opacity: 0
    });
  }, []);

  return (
    <div className="md:hidden">
      <div className="codepen-menu-container">
        {/* Menu Trigger */}
        <motion.span 
          className="menu-trigger"
          onClick={openMenu}
          animate={openTriggerControls}
        >
          <i className="menu-trigger-bar top"></i>
          <i className="menu-trigger-bar middle"></i>
          <i className="menu-trigger-bar bottom"></i>
        </motion.span>

        {/* Close Trigger */}
        <motion.span 
          className="close-trigger"
          onClick={closeMenu}
          animate={closeTriggerControls}
        >
          <i className="close-trigger-bar left"></i>
          <i className="close-trigger-bar right"></i>
        </motion.span>

        {/* Logo */}
        <motion.span 
          className="logo"
          animate={logoControls}
        >
          <span>
            <span className="text-gradient text-2xl font-bold">WinShirt</span>
          </span>
        </motion.span>

        {/* Inner Container */}
        {isOpen && (
          <div className="inner-container">
            <motion.i 
              className="menu-bg top"
              animate={menuBgTopControls}
              initial={{ y: "-113%" }}
            ></motion.i>
            <motion.i 
              className="menu-bg middle"
              animate={menuBgMiddleControls}
              initial={{ scaleY: 0 }}
            ></motion.i>
            <motion.i 
              className="menu-bg bottom"
              animate={menuBgBottomControls}
              initial={{ y: "23%" }}
            ></motion.i>
            
            <div className="menu-container">
              <motion.ul 
                className="menu"
                animate={menuControls}
              >
                {menuItems.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} onClick={closeMenu}>
                      {item.label}
                    </Link>
                  </li>
                ))}
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/profile" onClick={closeMenu}>
                        Mon Profil
                      </Link>
                    </li>
                    <li>
                      <Link to="/orders" onClick={closeMenu}>
                        Mes Commandes
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link to="/admin/users" onClick={closeMenu}>
                          Utilisateurs
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link to="/auth" onClick={closeMenu}>
                        Déconnexion
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/auth" onClick={closeMenu}>
                      Se connecter
                    </Link>
                  </li>
                )}
              </motion.ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePenMobileMenu;
