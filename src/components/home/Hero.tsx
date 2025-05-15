
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section className={cn('relative min-h-screen flex items-center pt-16', className)}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-winshirt-purple/20 rounded-full filter blur-3xl animate-pulse-light" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-winshirt-blue/20 rounded-full filter blur-3xl animate-pulse-light" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            Portez <span className="text-gradient">votre style</span>, 
            <br />tentez votre <span className="text-gradient">chance</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Un concept innovant qui allie mode et loterie. Chaque achat vous donne une chance de gagner des prix exceptionnels.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" className="bg-gradient-purple hover:opacity-90">
              Découvrir les produits
            </Button>
            <Button size="lg" variant="outline" className="border-winshirt-purple text-white">
              Voir les loteries
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Stat value="1000+" label="Produits vendus" />
            <Stat value="24" label="Loteries actives" />
            <Stat value="120" label="Gagnants" />
            <Stat value="50 000€" label="Prix distribués" />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button 
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors animate-bounce"
          onClick={() => window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          })}
        >
          <span className="text-sm mb-2">Explorer</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>
    </section>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => {
  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-white/60">{label}</p>
    </div>
  );
};

export default Hero;
