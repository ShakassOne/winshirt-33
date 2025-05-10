
import React from 'react';
import { 
  Upload, 
  Type, 
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  Target,
  PenTool
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomizationAccordion from '@/components/product/CustomizationAccordion';
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Design } from '@/types/supabase.types';
import TextCustomizationTools from '@/components/product/TextCustomizationTools';
import DesignCustomizationTools from '@/components/product/DesignCustomizationTools';

// Définition des polices Google Fonts
const googleFonts = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'PT Sans', label: 'PT Sans' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Ubuntu', label: 'Ubuntu' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Noto Sans', label: 'Noto Sans' },
  { value: 'Fira Sans', label: 'Fira Sans' },
  // ... add the rest of the fonts
];

interface CustomizationPanelProps {
  customizationMode: boolean;
  setCustomizationMode: React.Dispatch<React.SetStateAction<boolean>>;
  currentViewSide: 'front' | 'back';
  setDesignDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedDesignFront: Design | null;
  selectedDesignBack: Design | null;
  textContentFront: string;
  setTextContentFront: React.Dispatch<React.SetStateAction<string>>;
  textContentBack: string;
  setTextContentBack: React.Dispatch<React.SetStateAction<string>>;
  textFontFront: string;
  setTextFontFront: React.Dispatch<React.SetStateAction<string>>;
  textFontBack: string;
  setTextFontBack: React.Dispatch<React.SetStateAction<string>>;
  textColorFront: string;
  setTextColorFront: React.Dispatch<React.SetStateAction<string>>;
  textColorBack: string;
  setTextColorBack: React.Dispatch<React.SetStateAction<string>>;
  textShowColorPickerFront: boolean;
  setTextShowColorPickerFront: React.Dispatch<React.SetStateAction<boolean>>;
  textShowColorPickerBack: boolean;
  setTextShowColorPickerBack: React.Dispatch<React.SetStateAction<boolean>>;
  textStylesFront: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  setTextStylesFront: React.Dispatch<React.SetStateAction<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }>>;
  textStylesBack: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
  setTextStylesBack: React.Dispatch<React.SetStateAction<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }>>;
  designTransformFront: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  designTransformBack: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  textTransformFront: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  textTransformBack: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  handleDesignTransformChange: (property: string, value: any) => void;
  handleTextTransformChange: (property: string, value: any) => void;
  printSizeFront: string;
  setPrintSizeFront: React.Dispatch<React.SetStateAction<string>>;
  printSizeBack: string;
  setPrintSizeBack: React.Dispatch<React.SetStateAction<string>>;
  activeDesignSide: 'front' | 'back';
  activeTextSide: 'front' | 'back';
  setActiveDesignSide: React.Dispatch<React.SetStateAction<'front' | 'back'>>;
  setActiveTextSide: React.Dispatch<React.SetStateAction<'front' | 'back'>>;
  getCurrentDesign: () => Design | null;
  getCurrentDesignTransform: () => {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  getCurrentTextContent: () => string;
  getCurrentTextTransform: () => {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  getCurrentTextFont: () => string;
  getCurrentTextColor: () => string;
  getCurrentTextStyles: () => {
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
}

const CustomizationPanel = ({
  customizationMode,
  setCustomizationMode,
  currentViewSide,
  setDesignDialogOpen,
  handleFileUpload,
  fileInputRef,
  selectedDesignFront,
  selectedDesignBack,
  textContentFront,
  setTextContentFront,
  textContentBack,
  setTextContentBack,
  textFontFront,
  setTextFontFront,
  textFontBack,
  setTextFontBack,
  textColorFront,
  setTextColorFront,
  textColorBack,
  setTextColorBack,
  textShowColorPickerFront,
  setTextShowColorPickerFront,
  textShowColorPickerBack,
  setTextShowColorPickerBack,
  textStylesFront,
  setTextStylesFront,
  textStylesBack,
  setTextStylesBack,
  designTransformFront,
  designTransformBack,
  textTransformFront,
  textTransformBack,
  handleDesignTransformChange,
  handleTextTransformChange,
  printSizeFront,
  setPrintSizeFront,
  printSizeBack,
  setPrintSizeBack,
  activeDesignSide,
  activeTextSide,
  setActiveDesignSide,
  setActiveTextSide,
  getCurrentDesign,
  getCurrentDesignTransform,
  getCurrentTextContent,
  getCurrentTextTransform,
  getCurrentTextFont,
  getCurrentTextColor,
  getCurrentTextStyles
}: CustomizationPanelProps) => {
  
  const handleTextContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentViewSide === 'front') {
      setTextContentFront(e.target.value);
    } else {
      setTextContentBack(e.target.value);
    }
  };
  
  const toggleCustomizationMode = () => {
    setCustomizationMode(prev => !prev);
  };
  
  const handleTextStylesToggle = (styleName: 'bold' | 'italic' | 'underline', value: boolean) => {
    if (currentViewSide === 'front') {
      setTextStylesFront(prev => ({ ...prev, [styleName]: value }));
    } else {
      setTextStylesBack(prev => ({ ...prev, [styleName]: value }));
    }
  };
  
  return (
    <div>
      <Button onClick={toggleCustomizationMode} variant={customizationMode ? "outline" : "default"} className="mb-4 w-full">
        {customizationMode ? 'Désactiver la personnalisation' : 'Personnaliser ce produit'}
      </Button>
      
      {customizationMode && (
        <CustomizationAccordion>
          <Tabs defaultValue="design">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="design" className="flex-1">
                <ImageIcon className="mr-2 h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="text" className="flex-1">
                <Type className="mr-2 h-4 w-4" />
                Texte
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setDesignDialogOpen(true)}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Choisir un design
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Importer
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                  />
                </div>
                
                {(currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack) && (
                  <DesignCustomizationTools
                    currentViewSide={currentViewSide}
                    designTransform={currentViewSide === 'front' ? designTransformFront : designTransformBack}
                    handleDesignTransformChange={handleDesignTransformChange}
                    printSize={currentViewSide === 'front' ? printSizeFront : printSizeBack}
                    setPrintSize={currentViewSide === 'front' ? setPrintSizeFront : setPrintSizeBack}
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text-content">Texte</Label>
                  <Input 
                    id="text-content"
                    value={getCurrentTextContent()} 
                    onChange={handleTextContentChange}
                    placeholder="Votre texte ici..."
                    className="mt-1"
                  />
                </div>
                
                <TextCustomizationTools
                  currentViewSide={currentViewSide}
                  textFont={getCurrentTextFont()}
                  setTextFont={currentViewSide === 'front' ? setTextFontFront : setTextFontBack}
                  textColor={getCurrentTextColor()}
                  setTextColor={currentViewSide === 'front' ? setTextColorFront : setTextColorBack}
                  textShowColorPicker={currentViewSide === 'front' ? textShowColorPickerFront : textShowColorPickerBack}
                  setTextShowColorPicker={currentViewSide === 'front' ? setTextShowColorPickerFront : setTextShowColorPickerBack}
                  textStyles={getCurrentTextStyles()}
                  handleTextStylesToggle={handleTextStylesToggle}
                  textTransform={getCurrentTextTransform()}
                  handleTextTransformChange={handleTextTransformChange}
                  googleFonts={googleFonts}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CustomizationAccordion>
      )}
    </div>
  );
};

export default CustomizationPanel;
