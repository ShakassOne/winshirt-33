
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Ticket, 
  Palette, 
  Shirt,
  Settings 
} from 'lucide-react';

const AdminNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/admin', 
      label: 'Tableau de bord',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />
    },
    { 
      path: '/admin/products', 
      label: 'Produits',
      icon: <ShoppingBag className="mr-2 h-4 w-4" /> 
    },
    { 
      path: '/admin/lotteries', 
      label: 'Loteries',
      icon: <Ticket className="mr-2 h-4 w-4" />
    },
    { 
      path: '/admin/mockups', 
      label: 'Mockups',
      icon: <Shirt className="mr-2 h-4 w-4" />
    },
    { 
      path: '/admin/designs', 
      label: 'Designs',
      icon: <Palette className="mr-2 h-4 w-4" />
    },
    { 
      path: '/admin/theme', 
      label: 'Apparence',
      icon: <Settings className="mr-2 h-4 w-4" />
    }
  ];

  // Check if we're on a path that starts with the nav item path
  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="mb-8">
      <NavigationMenu className="max-w-full w-full justify-start">
        <NavigationMenuList className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.path}>
              <Link to={item.path}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "flex items-center",
                    isActivePath(item.path) 
                      ? "bg-accent text-accent-foreground" 
                      : ""
                  )}
                >
                  {item.icon}
                  {item.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default AdminNavigation;
