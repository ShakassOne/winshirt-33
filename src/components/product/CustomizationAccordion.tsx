
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
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Utiliser une fonction indépendante pour la gestion du clic
  // afin d'éviter les problèmes de propagation d'événements
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsOpen(!isOpen);
    
    // Petit délai pour permettre à l'animation de démarrer correctement
    setTimeout(() => {
      // Garder le focus sur le bouton pour éviter les problèmes de scroll
      document.activeElement && (document.activeElement as HTMLElement).blur();
    }, 10);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (onFileUpload) {
      onFileUpload(file);
      toast({
        title: "Fichier sélectionné",
        description: "Votre image a été sélectionnée avec succès",
      });
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-md border border-gray-200 dark:border-gray-800 mb-4"
    >
      <CollapsibleTrigger asChild onClick={handleToggle}>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full justify-between p-4 font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
            isOpen && "rounded-b-none border-b"
          )}
        >
          <span>Personnalisation</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4">
          {children}
          {/* Hidden file input for upload functionality */}
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept="image/*"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CustomizationAccordion;
