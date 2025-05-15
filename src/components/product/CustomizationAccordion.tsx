
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';

interface CustomizationAccordionProps {
  children: React.ReactNode;
  onFileUpload?: (file: File) => void;
}

const CustomizationAccordion = ({ children, onFileUpload }: CustomizationAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  // Fonction pour gérer le téléchargement de fichiers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (onFileUpload) {
      onFileUpload(file);
      toast({
        title: "Fichier sélectionné",
        description: `${file.name} a été sélectionné avec succès`,
      });
    }
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
      
      {/* Input caché pour télécharger des fichiers */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept="image/*"
      />
    </Collapsible>
  );
};

export default CustomizationAccordion;
