
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomizationAccordionProps {
  children: React.ReactNode;
}

const CustomizationAccordion = ({ children }: CustomizationAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Utiliser une fonction indépendante pour la gestion du clic
  // afin d'éviter les problèmes de propagation d'événements
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
    
    // Petit délai pour laisser le DOM se mettre à jour
    setTimeout(() => {
      // Garder le focus sur le bouton pour éviter les problèmes de scroll
      document.activeElement && (document.activeElement as HTMLElement).blur();
    }, 10);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border border-white/10 rounded-lg overflow-hidden mt-6 mb-4 md:block"
    >
      <div className="bg-white/5 p-4">
        <CollapsibleTrigger asChild>
          <Button 
            variant="default" 
            className="w-full bg-gradient-purple"
            onClick={handleToggle}
          >
            <span>Commencer à personnaliser</span>
            <ChevronDown className={cn(
              "ml-2 h-4 w-4 transition-transform duration-300",
              isOpen && "transform rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="animate-accordion-down">
        <div className="p-4 pt-0">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CustomizationAccordion;
