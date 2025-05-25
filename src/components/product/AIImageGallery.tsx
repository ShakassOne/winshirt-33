
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Search, Recycle, Clock } from 'lucide-react';
import { AIImage, getAvailableAIImages } from '@/services/aiImages.service';

interface AIImageGalleryProps {
  onImageSelect: (imageUrl: string, imageName: string) => void;
}

const AIImageGallery = ({ onImageSelect }: AIImageGalleryProps) => {
  const [images, setImages] = useState<AIImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<AIImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      const availableImages = await getAvailableAIImages(50);
      setImages(availableImages);
      setFilteredImages(availableImages);
      setIsLoading(false);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredImages(images);
    } else {
      const filtered = images.filter(image =>
        image.prompt.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredImages(filtered);
    }
  }, [searchTerm, images]);

  const handleImageSelect = (image: AIImage) => {
    onImageSelect(image.image_url, `IA: ${image.prompt.substring(0, 30)}...`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <Sparkles className="h-6 w-6 mx-auto mb-2 animate-pulse text-winshirt-purple" />
          <p className="text-xs text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Recycle className="h-3 w-3 text-green-500" />
        <span>Images IA disponibles ({images.length}) - Recyclage écologique</span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm">Rechercher</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par description..."
            className="pl-9 h-8 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="h-48 border rounded-lg p-2">
        {filteredImages.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {searchTerm ? 'Aucune image trouvée' : 'Aucune image IA disponible'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative border rounded-lg overflow-hidden cursor-pointer hover:border-winshirt-purple transition-colors"
                onClick={() => handleImageSelect(image)}
              >
                <img
                  src={image.image_url}
                  alt={image.prompt}
                  className="w-full h-16 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm" variant="secondary" className="text-xs h-6 px-2">
                    Utiliser
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                  <p className="text-xs text-white truncate">{image.prompt}</p>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <Clock className="h-2 w-2" />
                    <span>{image.usage_count}x</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default AIImageGallery;
