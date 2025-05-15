
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

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border border-white/10 rounded-lg overflow-hidden mt-6 mb-4"
    >
      <div className="bg-white/5 p-4">
        <CollapsibleTrigger asChild>
          <Button 
            variant="default" 
            className="w-full bg-gradient-purple"
            onClick={() => setIsOpen(!isOpen)}
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
