import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating?: number;
  isCustomizable?: boolean;
  tickets?: number;
  color?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  price,
  image,
  rating = 5,
  isCustomizable = false,
  tickets = 0,
  color,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const card = cardRef.current;
    const img = imageRef.current;
    if (!card || !img) return;
    
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let raf: number | null = null;
    
    function animate() {
      current.x += (target.x - current.x) * 0.10;
      current.y += (target.y - current.y) * 0.10;
      
      if (card && img) {
        card.style.transform = `perspective(1000px) rotateY(${current.x}deg) rotateX(${current.y}deg) scale3d(1.04,1.04,1)`;
        img.style.transform = `translate(-50%, -50%) translateX(${-current.x * 4}px) translateY(${current.y * 4}px) scale(1.15)`;
      }
      
      if (Math.abs(current.x - target.x) > 0.1 || Math.abs(current.y - target.y) > 0.1) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = null;
      }
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const normX = ((x / rect.width) - 0.5) * 2;
      const normY = ((y / rect.height) - 0.5) * 2;
      target.x = normX * 18;
      target.y = -normY * 18;
      if (!raf) animate();
    };
    
    const handleMouseEnter = () => {
      card.classList.add('flash');
      setTimeout(() => {
        card.classList.remove('flash');
      }, 1000);
    };
    
    const handleMouseLeave = () => {
      target.x = 0;
      target.y = 0;
      card.classList.remove('flash');
      if (!raf) animate();
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  
  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, action: 'add' | 'view') => {
    e.stopPropagation();
    if (action === 'view') {
      navigate(`/product/${id}`);
    }
    // Pour 'add', on peut ajouter la logique d'ajout au panier ici plus tard
  };
  
  return (
    <div 
      ref={cardRef} 
      className="tilt-card relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <AspectRatio ratio={1} className="w-full">
          <div className="h-full w-full overflow-hidden">
            <img
              ref={imageRef}
              src={image}
              alt={name}
              className="absolute left-50% top-50% w-full h-full object-cover transform-center"
            />
          </div>
        </AspectRatio>
        
        {isCustomizable && (
          <div className="absolute top-2 left-2 bg-winshirt-purple/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
            Personnalisable
          </div>
        )}
        {tickets > 0 && (
          <div className="absolute top-2 right-2 bg-winshirt-blue/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
            {tickets} {tickets > 1 ? 'tickets' : 'ticket'}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button 
            size="sm" 
            variant="secondary" 
            className="flex items-center gap-1"
            onClick={(e) => handleButtonClick(e, 'add')}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline-block">Ajouter</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={(e) => handleButtonClick(e, 'view')}
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline-block">Détails</span>
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-sm text-muted-foreground">{category}</p>
        <h3 className="font-medium mt-1 hover:text-winshirt-blue transition-colors">
          {name}
        </h3>
        
        <div className="mt-2 flex justify-between items-center">
          <p className="font-bold text-lg">{price.toFixed(2)} €</p>
          <div className="flex items-center">
            {Array(5).fill(0).map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  "h-4 w-4",
                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                )}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        
        {color && (
          <div className="mt-2 flex items-center gap-1">
            <div 
              className="h-4 w-4 rounded-full border border-white/30" 
              style={{ backgroundColor: color }}
            />
            <div className="h-4 w-4 rounded-full bg-white border border-white/30" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
