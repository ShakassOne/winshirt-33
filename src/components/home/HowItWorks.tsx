
import React from 'react';
import GlassCard from '../ui/GlassCard';
import { cn } from '@/lib/utils';

interface HowItWorksProps {
  className?: string;
}

const steps = [
  {
    id: 1,
    title: 'Choisissez votre produit',
    description: 'Parcourez notre sélection de vêtements personnalisables et choisissez votre favoris.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-winshirt-purple">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Personnalisez-le',
    description: 'Ajoutez vos designs, textes ou images pour créer un produit unique qui vous ressemble.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-winshirt-purple">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Participez aux loteries',
    description: 'Lors de votre achat, obtenez des tickets pour participer à des loteries et gagner des prix exceptionnels.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-winshirt-purple">
        <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/>
        <path d="m18 2 4 4-4 4"/>
        <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/>
        <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/>
        <path d="m18 14 4 4-4 4"/>
      </svg>
    )
  }
];

const HowItWorks: React.FC<HowItWorksProps> = ({ className }) => {
  return (
    <section className={cn('py-20 section-optimized', className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Comment ça marche</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            WinShirt révolutionne votre expérience shopping en combinant personnalisation de vêtements et opportunités de gagner des prix exceptionnels
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <GlassCard 
              key={step.id}
              className="p-8 flex flex-col items-center text-center"
              hover3D={true}
            >
              <div className="mb-6 relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-winshirt-purple to-winshirt-blue opacity-30 blur-sm" />
                <div className="relative h-16 w-16 flex items-center justify-center rounded-full bg-white/5">
                  {step.icon}
                </div>
              </div>
              
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-winshirt-purple/20 mb-4">
                <span className="font-bold">{step.id}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-white/70">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-winshirt-purple/50">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
