import React, { useState, useCallback } from 'react';
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
import { FileImage, TextSelect, Color, Size, RotateCcw, RotateCw, ZoomIn, ZoomOut, Move, Download, Upload, Eraser, Sparkles } from "lucide-react"
import { Design } from '@/types/supabase.types';
import { MockupWithColors, MockupColor } from '@/types/mockup.types';
import { ProductDesign } from '@/components/product/ProductDesign';
import { ProductText } from '@/components/product/ProductText';
import { CompactUpload } from '@/components/product/CompactUpload';
import { AIImageGenerator } from '@/components/product/AIImageGenerator';
import { SvgEditor } from '@/components/product/SvgEditor';

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
  productAvailableColors,
  mockup,
  selectedMockupColor,
  onMockupColorChange,
  selectedDesignFront,
  selectedDesignBack,
  onSelectDesign,
  setSelectedDesignFront,
  setSelectedDesignBack,
  onFileUpload,
  onAIImageGenerated,
  onRemoveBackground,
  isRemovingBackground,
  svgColorFront,
  svgColorBack,
  svgContentFront,
  svgContentBack,
  onSvgColorChange,
  onSvgContentChange,
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
  onTextTransformChange,
  designTransformFront,
  designTransformBack,
  selectedSizeFront,
  selectedSizeBack,
  onDesignTransformChange,
  onSizeChange,
  onDesignMouseDown,
  onTextMouseDown,
  onTouchMove
}) => {

  return (
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
                <ProductDesign
                  productImageUrl={productImageUrl}
                  mockup={mockup}
                  selectedMockupColor={selectedMockupColor}
                  selectedDesign={currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack}
                  designTransform={currentViewSide === 'front' ? designTransformFront : designTransformBack}
                  textContent={currentViewSide === 'front' ? textContentFront : textContentBack}
                  textFont={currentViewSide === 'front' ? textFontFront : textFontBack}
                  textColor={currentViewSide === 'front' ? textColorFront : textColorBack}
                  textStyles={currentViewSide === 'front' ? textStylesFront : textStylesBack}
                  textTransform={currentViewSide === 'front' ? textTransformFront : textTransformBack}
                  svgColor={currentViewSide === 'front' ? svgColorFront : svgColorBack}
                  svgContent={currentViewSide === 'front' ? svgContentFront : svgContentBack}
                />
              </div>
            </AspectRatio>
          </div>

          {/* Panneau de contrôle */}
          <div className="p-6 flex flex-col justify-between h-full">
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

                  {/* AI Image Generator */}
                  <AIImageGenerator onAIImageGenerated={onAIImageGenerated} />
                </div>

                {/* Design Options */}
                <ProductText
                  textContent={currentViewSide === 'front' ? textContentFront : textContentBack}
                  textFont={currentViewSide === 'front' ? textFontFront : textFontBack}
                  textColor={currentViewSide === 'front' ? textColorFront : textColorBack}
                  textStyles={currentViewSide === 'front' ? textStylesFront : textStylesBack}
                  onTextContentChange={onTextContentChange}
                  onTextFontChange={onTextFontChange}
                  onTextColorChange={onTextColorChange}
                  onTextStylesChange={onTextStylesChange}
                  onTextTransformChange={onTextTransformChange}
                  onTextMouseDown={onTextMouseDown}
                />

                {/* SVG Editor */}
                <SvgEditor
                  svgColor={currentViewSide === 'front' ? svgColorFront : svgColorBack}
                  svgContent={currentViewSide === 'front' ? svgContentFront : svgContentBack}
                  onSvgColorChange={onSvgColorChange}
                  onSvgContentChange={onSvgContentChange}
                />
              </div>
            </TabsContent>

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
  );
};

export default ModalPersonnalisation;
