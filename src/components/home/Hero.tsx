
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <section className={cn('relative min-h-screen flex items-center justify-center bg-background', className)}>
      {/* Hero background with automotive pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight">
            <span className="block text-foreground">BMW M2</span>
            <span className="block text-4xl md:text-5xl lg:text-6xl font-normal text-muted-foreground mt-4">
              COMPÉTITION
            </span>
            <span className="block text-3xl md:text-4xl lg:text-5xl font-light text-muted-foreground/80 mt-2">
              by Winshirt
            </span>
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Button 
              size="lg" 
              className="clean-button-primary px-8 py-4 text-lg font-medium rounded-none uppercase tracking-wider"
            >
              Allez-y Joue
            </Button>
          </div>
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 uppercase tracking-wider">
            Porte ton style, tente ta chance !
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-start text-left">
              <h3 className="text-xl font-semibold text-foreground mb-2">T-Shirt M2</h3>
              <p className="text-lg text-foreground font-bold">19,00€</p>
              <ul className="text-sm text-muted-foreground mt-4 space-y-2">
                <li>• Un vêtement toujours tendance, vers une mode plus responsable.</li>
                <li>• Essentiel, bio et coloré.</li>
                <li>• Tous les coloris sont fabriqués à partir de coton en conversion biologique.</li>
                <li>• Encolure ronde en bord-côte avec élasthanne.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default Hero;
