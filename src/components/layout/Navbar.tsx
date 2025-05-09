
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'bg-black/30 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-bold text-gradient">WinShirt</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="/">Accueil</NavLink>
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/loteries">Loteries</NavLink>
          <NavLink href="/comment-ca-marche">Comment ça marche</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-winshirt-purple text-xs font-bold">
              0
            </span>
          </Button>
          
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Admin
          </Button>
          
          <Button size="sm">
            Connexion
          </Button>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const isActive = window.location.pathname === href;
  
  return (
    <Link 
      to={href} 
      className={cn(
        'relative py-2 text-sm font-medium transition-colors hover:text-white',
        isActive ? 'text-white' : 'text-white/70'
      )}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-winshirt-purple to-winshirt-blue" />
      )}
    </Link>
  );
};

export default Navbar;
