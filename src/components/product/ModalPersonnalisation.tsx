
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { FileImage, TextSelect, Palette, Sparkles } from "lucide-react"
import { Design } from '@/types/supabase.types';
import { MockupWithColors, MockupColor } from '@/types/mockup.types';
import { CompactUpload } from '@/components/product/CompactUpload';
import AIImageGenerator from '@/components/product/AIImageGenerator';

interface ModalPersonnalisationProps {
  open: boolean;
  onClose: () => void;
  currentViewSide: 'front' | 'back';
  onViewSideChange: (side: 'front' | 'back') => void;
  productName: string;
  productImageUrl: string;
  productAvailableColors: string[] | null;
  mockup: MockupWithColors | null;
  selectedMockupColor: MockupColor | null;
  onMockupColorChange: (color: MockupColor | null) => void;
  selectedDesignFront: Design | null;
  selectedDesignBack: Design | null;
  onSelectDesign: (design: Design) => void;
  setSelectedDesignFront: (design: Design | null) => void;
  setSelectedDesignBack: (design: Design | null) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAIImageGenerated: (imageUrl: string, imageName: string) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
  svgColorFront: string;
  svgColorBack: string;
  svgContentFront: string;
  svgContentBack: string;
  onSvgColorChange: (color: string) => void;
  onSvgContentChange: (content: string) => void;
  textContentFront: string;
  textContentBack: string;
  textFontFront: string;
  textFontBack: string;
  textColorFront: string;
  textColorBack: string;
  textStylesFront: { bold: boolean; italic: boolean; underline: boolean };
  textStylesBack: { bold: boolean; italic: boolean; underline: boolean };
  textTransformFront: { position: { x: number; y: number }; scale: number; rotation: number };
  textTransformBack: { position: { x: number; y: number }; scale: number; rotation: number };
  onTextContentChange: (content: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onTextStylesChange: (styles: { bold: boolean; italic: boolean; underline: boolean }) => void;
  onTextTransformChange: (property: string, value: any) => void;
  designTransformFront: { position: { x: number; y: number }; scale: number; rotation: number };
  designTransformBack: { position: { x: number; y: number }; scale: number; rotation: number };
  selectedSizeFront: string;
  selectedSizeBack: string;
  onDesignTransformChange: (property: string, value: any) => void;
  onSizeChange: (size: string) => void;
  onDesignMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onTextMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onTouchMove: (e: React.MouseEvent | React.TouchEvent) => void;
}

const ModalPersonnalisation: React.FC<ModalPersonnalisationProps> = ({
  open,
  onClose,
  currentViewSide,
  onViewSideChange,
  productName,
  productImageUrl,
  mockup,
  selectedMockupColor,
  selectedDesignFront,
  selectedDesignBack,
  onFileUpload,
  onAIImageGenerated,
  onRemoveBackground,
  isRemovingBackground,
  svgColorFront,
  svgColorBack,
  onSvgColorChange,
  textContentFront,
  textContentBack,
  textFontFront,
  textFontBack,
  textColorFront,
  textColorBack,
  textStylesFront,
  textStylesBack,
  textTransformFront,
  textTransformBack,
  onTextContentChange,
  onTextFontChange,
  onTextColorChange,
  onTextStylesChange,
  designTransformFront,
  designTransformBack,
  onDesignMouseDown,
  onTextMouseDown,
  onTouchMove
}) => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
          aria-describedby="customization-dialog-description"
        >
          <div id="customization-dialog-description" className="sr-only">
            Interface de personnalisation du produit {productName}
          </div>
          
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-2xl text-white">{productName} - Personnalisation</DialogTitle>
            <DialogDescription className="text-gray-400">
              Exprimez votre créativité en personnalisant ce produit.
            </DialogDescription>
            <Tabs defaultValue={currentViewSide} className="mt-4">
              <TabsList>
                <TabsTrigger value="front" onClick={() => onViewSideChange('front')}>Avant</TabsTrigger>
                <TabsTrigger value="back" onClick={() => onViewSideChange('back')}>Arrière</TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Canvas de prévisualisation */}
            <div className="p-6 border-r border-gray-800 flex items-center justify-center">
              <AspectRatio ratio={1 / 1} className="w-full max-w-md">
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onTouchStart={onDesignMouseDown}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onClose}
                  onMouseDown={onDesignMouseDown}
                  onMouseMove={onTouchMove}
                  onMouseUp={onClose}
                  onMouseLeave={onClose}
                >
                  {/* Simple mockup display */}
                  <img
                    src={productImageUrl}
                    alt={productName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  
                  {/* Design overlay */}
                  {(currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack) && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '20%',
                        left: '20%',
                        width: '60%',
                        height: '60%',
                        transform: `translate(${(currentViewSide === 'front' ? designTransformFront : designTransformBack).position.x}px, ${(currentViewSide === 'front' ? designTransformFront : designTransformBack).position.y}px) scale(${(currentViewSide === 'front' ? designTransformFront : designTransformBack).scale}) rotate(${(currentViewSide === 'front' ? designTransformFront : designTransformBack).rotation}deg)`,
                        pointerEvents: 'auto',
                        cursor: 'move'
                      }}
                    >
                      <img
                        src={(currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack)?.image_url}
                        alt="Design"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Text overlay */}
                  {(currentViewSide === 'front' ? textContentFront : textContentBack) && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '40%',
                        left: '40%',
                        transform: `translate(${(currentViewSide === 'front' ? textTransformFront : textTransformBack).position.x}px, ${(currentViewSide === 'front' ? textTransformFront : textTransformBack).position.y}px) scale(${(currentViewSide === 'front' ? textTransformFront : textTransformBack).scale}) rotate(${(currentViewSide === 'front' ? textTransformFront : textTransformBack).rotation}deg)`,
                        color: currentViewSide === 'front' ? textColorFront : textColorBack,
                        fontFamily: currentViewSide === 'front' ? textFontFront : textFontBack,
                        fontWeight: (currentViewSide === 'front' ? textStylesFront : textStylesBack).bold ? 'bold' : 'normal',
                        fontStyle: (currentViewSide === 'front' ? textStylesFront : textStylesBack).italic ? 'italic' : 'normal',
                        textDecoration: (currentViewSide === 'front' ? textStylesFront : textStylesBack).underline ? 'underline' : 'none',
                        pointerEvents: 'auto',
                        cursor: 'move'
                      }}
                    >
                      {currentViewSide === 'front' ? textContentFront : textContentBack}
                    </div>
                  )}
                </div>
              </AspectRatio>
            </div>

            {/* Panneau de contrôle */}
            <div className="p-6 flex flex-col justify-between h-full">
              <Tabs defaultValue={currentViewSide} className="outline-none">
                <TabsContent value={currentViewSide} className="outline-none">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Upload Design */}
                      <CompactUpload
                        onFileUpload={onFileUpload}
                        onRemoveBackground={onRemoveBackground}
                        isRemovingBackground={isRemovingBackground}
                        currentDesign={currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack}
                      />

                      {/* AI Image Generator Button */}
                      <Button
                        onClick={() => setIsAIModalOpen(true)}
                        className="h-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold flex flex-col items-center justify-center space-y-1"
                      >
                        <Sparkles className="h-5 w-5" />
                        <span className="text-xs">Générer IA</span>
                      </Button>
                    </div>

                    {/* Text Input Section */}
                    <div className="space-y-3">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <TextSelect className="h-4 w-4" />
                        Texte personnalisé
                      </h3>
                      
                      <input
                        type="text"
                        placeholder="Votre texte ici..."
                        value={currentViewSide === 'front' ? textContentFront : textContentBack}
                        onChange={(e) => onTextContentChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60"
                      />
                      
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={currentViewSide === 'front' ? textColorFront : textColorBack}
                          onChange={(e) => onTextColorChange(e.target.value)}
                          className="w-12 h-10 rounded border border-white/20"
                        />
                        
                        <select
                          value={currentViewSide === 'front' ? textFontFront : textFontBack}
                          onChange={(e) => onTextFontChange(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                        </select>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const currentStyles = currentViewSide === 'front' ? textStylesFront : textStylesBack;
                            onTextStylesChange({ ...currentStyles, bold: !currentStyles.bold });
                          }}
                          className={`px-3 py-2 rounded border ${(currentViewSide === 'front' ? textStylesFront : textStylesBack).bold ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/20'} text-white font-bold`}
                        >
                          B
                        </button>
                        <button
                          onClick={() => {
                            const currentStyles = currentViewSide === 'front' ? textStylesFront : textStylesBack;
                            onTextStylesChange({ ...currentStyles, italic: !currentStyles.italic });
                          }}
                          className={`px-3 py-2 rounded border ${(currentViewSide === 'front' ? textStylesFront : textStylesBack).italic ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/20'} text-white italic`}
                        >
                          I
                        </button>
                        <button
                          onClick={() => {
                            const currentStyles = currentViewSide === 'front' ? textStylesFront : textStylesBack;
                            onTextStylesChange({ ...currentStyles, underline: !currentStyles.underline });
                          }}
                          className={`px-3 py-2 rounded border ${(currentViewSide === 'front' ? textStylesFront : textStylesBack).underline ? 'bg-white/20 border-white/40' : 'bg-white/10 border-white/20'} text-white underline`}
                        >
                          U
                        </button>
                      </div>
                    </div>

                    {/* SVG Color Editor */}
                    <div className="space-y-3">
                      <h3 className="text-white font-medium flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Couleur SVG
                      </h3>
                      
                      <input
                        type="color"
                        value={currentViewSide === 'front' ? svgColorFront : svgColorBack}
                        onChange={(e) => onSvgColorChange(e.target.value)}
                        className="w-full h-12 rounded border border-white/20"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={onClose}>
                  Fermer
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Image Generator Modal */}
      <AIImageGenerator
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onImageGenerated={onAIImageGenerated}
      />
    </>
  );
};

export default ModalPersonnalisation;
