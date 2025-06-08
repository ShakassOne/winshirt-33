
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const CodePenMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAdminCheck();
  
  // Animation controls for each element
  const logoControls = useAnimation();
  const menuBgTopControls = useAnimation();
  const menuBgMiddleControls = useAnimation();
  const menuBgBottomControls = useAnimation();
  const menuControls = useAnimation();
  
  // Hamburger bars controls
  const openTriggerTopControls = useAnimation();
  const openTriggerMiddleControls = useAnimation();
  const openTriggerBottomControls = useAnimation();
  const openTriggerControls = useAnimation();
  
  // Close trigger controls
  const closeTriggerLeftControls = useAnimation();
  const closeTriggerRightControls = useAnimation();
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
    
    // Phase 1: Logo shrink and hamburger bars move out (preOpen)
    const logoAnimation = logoControls.start({
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    });

    const topBarAnimation = openTriggerTopControls.start({
      x: 80,
      y: -80,
      transition: { duration: 0.4, delay: 0.1, ease: [0.55, 0, 0.1, 1] }
    });

    const middleBarAnimation = openTriggerMiddleControls.start({
      x: 80,
      y: -80,
      transition: { duration: 0.4, ease: [0.55, 0, 0.1, 1] }
    });

    const bottomBarAnimation = openTriggerBottomControls.start({
      x: 80,
      y: -80,
      transition: { duration: 0.4, delay: 0.2, ease: [0.55, 0, 0.1, 1] }
    });

    // After bars animation, hide the open trigger
    setTimeout(() => {
      openTriggerControls.start({ opacity: 0, visibility: "hidden" });
      closeTriggerControls.start({ zIndex: 25 });
    }, 500);

    // Phase 2: Menu backgrounds animation (open) - starts 0.4s before bars finish
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

    // Phase 3: Menu content appears
    setTimeout(() => {
      menuControls.start({
        y: 0,
        opacity: 1,
        visibility: "visible",
        transition: { duration: 0.6, ease: "easeOut" }
      });
    }, 600);

    // Phase 4: Close trigger bars animate in (preClose)
    setTimeout(() => {
      closeTriggerLeftControls.start({
        x: -100,
        y: 100,
        transition: { duration: 0.8, ease: "easeOut" }
      });
      
      closeTriggerRightControls.start({
        x: 100,
        y: 100,
        transition: { duration: 0.8, delay: 0.2, ease: "easeOut" }
      });
    }, 0);
  };

  const closeMenu = async () => {
    // Phase 1: Change background colors and setup
    menuBgTopControls.start({
      backgroundColor: "rgba(98, 149, 202, 0.9)",
      transition: { duration: 0.2, ease: [0.55, 0, 0.1, 1] }
    });
    
    menuBgMiddleControls.start({
      backgroundColor: "rgba(98, 149, 202, 0.9)",
      transition: { duration: 0.2, ease: [0.55, 0, 0.1, 1] }
    });
    
    menuBgBottomControls.start({
      backgroundColor: "rgba(98, 149, 202, 0.9)",
      transition: { duration: 0.2, ease: [0.55, 0, 0.1, 1] }
    });

    setTimeout(() => {
      logoControls.start({ zIndex: 26 });
      closeTriggerControls.start({ zIndex: 5 });
      openTriggerControls.start({ opacity: 1, visibility: "visible" });
    }, 200);

    // Phase 2: Menu content fade out
    menuControls.start({
      y: 20,
      opacity: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    }).then(() => {
      menuControls.set({ visibility: "hidden" });
    });

    // Phase 3: Logo scale back up
    setTimeout(() => {
      logoControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
    }, 200);

    // Phase 4: Menu backgrounds move out
    setTimeout(() => {
      menuBgTopControls.start({
        y: "-113%",
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
      
      menuBgMiddleControls.start({
        scaleY: 0,
        transition: { duration: 0.8, ease: [0.55, 0, 0.1, 1] }
      });
      
      menuBgBottomControls.start({
        y: "23%",
        transition: { 
          duration: 0.8, 
          ease: [0.55, 0, 0.1, 1],
          onComplete: () => {
            // Reset background colors after animation
            menuBgTopControls.set({ backgroundColor: "rgba(255, 255, 255, 0.9)" });
            menuBgMiddleControls.set({ backgroundColor: "rgba(255, 255, 255, 0.9)" });
            menuBgBottomControls.set({ backgroundColor: "rgba(255, 255, 255, 0.9)" });
          }
        }
      });
    }, 400);

    // Phase 5: Close trigger bars move out
    closeTriggerLeftControls.start({
      x: 100,
      y: -100,
      transition: { duration: 0.2, ease: "easeIn" }
    });
    
    closeTriggerRightControls.start({
      x: -100,
      y: -100,
      transition: { duration: 0.2, delay: 0.1, ease: "easeIn" }
    });

    // Phase 6: Open trigger bars move back in
    setTimeout(() => {
      openTriggerTopControls.start({
        x: 0,
        y: 0,
        transition: { duration: 1, delay: 0.2, ease: "easeOut" }
      });
      
      openTriggerMiddleControls.start({
        x: 0,
        y: 0,
        transition: { duration: 1, ease: "easeOut" }
      });
      
      openTriggerBottomControls.start({
        x: 0,
        y: 0,
        transition: { duration: 1, delay: 0.1, ease: "easeOut" }
      });
    }, 200);

    // Final cleanup
    setTimeout(() => {
      setIsOpen(false);
    }, 1200);
  };

  useEffect(() => {
    // Initialize all animations to starting positions
    menuControls.set({
      y: 30,
      opacity: 0,
      visibility: "hidden"
    });
    
    closeTriggerControls.set({
      zIndex: 5
    });
    
    closeTriggerLeftControls.set({
      x: 100,
      y: -100
    });
    
    closeTriggerRightControls.set({
      x: -100,
      y: -100
    });

    // Initialize menu backgrounds
    menuBgTopControls.set({
      y: "-113%"
    });
    
    menuBgMiddleControls.set({
      scaleY: 0
    });
    
    menuBgBottomControls.set({
      y: "23%"
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
          <motion.i 
            className="menu-trigger-bar top"
            animate={openTriggerTopControls}
          ></motion.i>
          <motion.i 
            className="menu-trigger-bar middle"
            animate={openTriggerMiddleControls}
          ></motion.i>
          <motion.i 
            className="menu-trigger-bar bottom"
            animate={openTriggerBottomControls}
          ></motion.i>
        </motion.span>

        {/* Close Trigger */}
        <motion.span 
          className="close-trigger"
          onClick={closeMenu}
          animate={closeTriggerControls}
        >
          <motion.i 
            className="close-trigger-bar left"
            animate={closeTriggerLeftControls}
          ></motion.i>
          <motion.i 
            className="close-trigger-bar right"
            animate={closeTriggerRightControls}
          ></motion.i>
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
            ></motion.i>
            <motion.i 
              className="menu-bg middle"
              animate={menuBgMiddleControls}
            ></motion.i>
            <motion.i 
              className="menu-bg bottom"
              animate={menuBgBottomControls}
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
