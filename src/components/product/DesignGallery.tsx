
import React from 'react';
import { Design } from '@/types/supabase.types';
import { Label } from '@/components/ui/label';

interface DesignGalleryProps {
  designs: Design[];
  selectedDesign: Design | null;
  onDesignSelect: (design: Design) => void;
}

export default function DesignGallery({
  designs,
  selectedDesign,
  onDesignSelect
}: DesignGalleryProps) {
  const isSvgDesign = (imageUrl: string): boolean => {
    if (!imageUrl) return false;
    return imageUrl.toLowerCase().endsWith('.svg') || 
           imageUrl.includes('data:image/svg+xml');
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-medium text-white">Choisir un design</Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {designs.map((design) => (
          <button
            key={design.id}
            onClick={() => onDesignSelect(design)}
            className={`relative group p-3 border-2 rounded-lg transition-all duration-200 hover:border-purple-400 hover:scale-105 ${
              selectedDesign?.id === design.id 
                ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25' 
                : 'border-white/20 bg-white/5'
            }`}
          >
            <div className="aspect-square relative overflow-hidden rounded-md bg-white/10">
              <img
                src={design.image_url}
                alt={design.name}
                className="w-full h-full object-contain"
              />
              
              {/* Badge SVG */}
              {isSvgDesign(design.image_url) && (
                <span className="absolute top-1 right-1 text-xs bg-purple-500 text-white px-2 py-1 rounded-full font-medium">
                  SVG
                </span>
              )}
              
              {/* Overlay de sélection */}
              {selectedDesign?.id === design.id && (
                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-sm text-white/80 mt-2 truncate">{design.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
