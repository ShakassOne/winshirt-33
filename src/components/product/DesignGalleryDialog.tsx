
import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Design } from '@/types/supabase.types';

interface DesignGalleryDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  designs: Design[];
  uniqueCategories: string[];
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  handleDesignSelect: (design: Design) => void;
  isLoading: boolean;
}

const DesignGalleryDialog = ({
  isOpen,
  setIsOpen,
  designs,
  uniqueCategories,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  handleDesignSelect,
  isLoading
}: DesignGalleryDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Choisir un design</span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
            <TabsList className="w-full mb-4 flex overflow-auto">
              {uniqueCategories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="capitalize"
                >
                  {category === 'all' ? 'Tous' : category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedCategoryFilter} className="flex-1 mt-0">
              <ScrollArea className="h-[60vh]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
                    {designs.map(design => (
                      <Card 
                        key={design.id}
                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => handleDesignSelect(design)}
                      >
                        <div className="aspect-square w-full relative">
                          <img 
                            src={design.image_url} 
                            alt={design.name}
                            className="w-full h-full object-contain p-2" 
                          />
                        </div>
                        <div className="p-2 text-center text-sm truncate">
                          {design.name}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignGalleryDialog;
