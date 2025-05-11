
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check, LucideImage, ShoppingCart, TextCursorInput } from "lucide-react";
import CustomizationAccordion from './CustomizationAccordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CustomizationFormProps {
  product: any;
  onCheckout: (customization: any) => void;
}

const fontOptions = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Impact', label: 'Impact' },
];

const positionOptions = [
  { value: 'top', label: 'Top' },
  { value: 'middle', label: 'Middle' },
  { value: 'bottom', label: 'Bottom' },
];

const CustomizationForm = ({ product, onCheckout }: CustomizationFormProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('color');
  
  // State for customization
  const [color, setColor] = useState('#000000');
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textFont, setTextFont] = useState('Arial');
  const [textPosition, setTextPosition] = useState('middle');
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [designPosition, setDesignPosition] = useState('middle');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState(false);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveDesign = () => {
    setDesignImage(null);
  };
  
  const handleBuyNow = () => {
    const customization = {
      color,
      text: text.trim() || undefined,
      textColor: text.trim() ? textColor : undefined,
      textFont: text.trim() ? textFont : undefined,
      textPosition: text.trim() ? textPosition : undefined,
      designImage: designImage || undefined,
      designPosition: designImage ? designPosition : undefined,
    };
    
    onCheckout(customization);
  };
  
  const PreviewPanel = () => (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 relative">
      <h3 className="text-sm font-medium mb-2">Preview</h3>
      <div className="aspect-square relative rounded-md overflow-hidden bg-white dark:bg-black">
        {/* Product base */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: color }}
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply opacity-90"
          />
        </div>
        
        {/* Text overlay */}
        {text && (
          <div 
            className="absolute w-full text-center px-4"
            style={{
              top: textPosition === 'top' ? '20%' : 
                   textPosition === 'bottom' ? '70%' : '45%',
              color: textColor,
              fontFamily: textFont,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              transform: 'translateY(-50%)'
            }}
          >
            {text}
          </div>
        )}
        
        {/* Design image overlay */}
        {designImage && (
          <div 
            className="absolute w-1/2 h-1/2 left-1/2 transform -translate-x-1/2"
            style={{
              top: designPosition === 'top' ? '10%' : 
                   designPosition === 'bottom' ? '50%' : '25%',
            }}
          >
            <img 
              src={designImage} 
              alt="Custom design" 
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <CustomizationAccordion>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="color">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2 border border-white/30" 
                    style={{ backgroundColor: color }}
                  />
                  Color
                </div>
              </TabsTrigger>
              <TabsTrigger value="text">
                <TextCursorInput className="w-4 h-4 mr-2" />
                Text
              </TabsTrigger>
              <TabsTrigger value="design">
                <LucideImage className="w-4 h-4 mr-2" />
                Design
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="color" className="space-y-4">
              <div>
                <Label htmlFor="color">Product Color</Label>
                <div className="flex items-center gap-4 mt-1.5">
                  <Popover 
                    open={isColorPickerOpen} 
                    onOpenChange={setIsColorPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "w-10 h-10 p-0 rounded-full border-2",
                          isColorPickerOpen && "ring-2 ring-ring"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" side="right">
                      <HexColorPicker color={color} onChange={setColor} />
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs font-mono">{color}</div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7"
                          onClick={() => setIsColorPickerOpen(false)}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <div className="grid grid-cols-6 gap-2">
                    {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map((presetColor) => (
                      <Button 
                        key={presetColor}
                        variant="outline" 
                        className={cn(
                          "w-8 h-8 p-0 rounded-full",
                          color === presetColor && "ring-2 ring-ring"
                        )}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => setColor(presetColor)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                <AlertCircle className="inline-block w-3.5 h-3.5 mr-1" />
                Choose a color for your product
              </div>
            </TabsContent>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Add Text</Label>
                <Input 
                  id="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="Enter your text here" 
                  maxLength={50}
                />
                <div className="text-xs text-right text-muted-foreground">
                  {text.length}/50 characters
                </div>
              </div>
              
              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex items-center gap-4 mt-1.5">
                  <Popover 
                    open={isTextColorPickerOpen} 
                    onOpenChange={setIsTextColorPickerOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "w-10 h-10 p-0 rounded-full border-2",
                          isTextColorPickerOpen && "ring-2 ring-ring"
                        )}
                        style={{ backgroundColor: textColor }}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" side="right">
                      <HexColorPicker color={textColor} onChange={setTextColor} />
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs font-mono">{textColor}</div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="h-7"
                          onClick={() => setIsTextColorPickerOpen(false)}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <div className="grid grid-cols-6 gap-2">
                    {['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'].map((presetColor) => (
                      <Button 
                        key={presetColor}
                        variant="outline" 
                        className={cn(
                          "w-8 h-8 p-0 rounded-full",
                          textColor === presetColor && "ring-2 ring-ring"
                        )}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => setTextColor(presetColor)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="textFont">Text Font</Label>
                <Select value={textFont} onValueChange={setTextFont}>
                  <SelectTrigger id="textFont" className="mt-1.5">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem 
                        key={font.value} 
                        value={font.value}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="textPosition">Text Position</Label>
                <Select value={textPosition} onValueChange={setTextPosition}>
                  <SelectTrigger id="textPosition" className="mt-1.5">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positionOptions.map((position) => (
                      <SelectItem key={position.value} value={position.value}>
                        {position.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              {designImage ? (
                <div>
                  <Label>Your Design</Label>
                  <div className="mt-1.5 border rounded-md p-2 relative">
                    <img 
                      src={designImage}
                      alt="Custom design"
                      className="w-full max-h-48 object-contain mx-auto"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveDesign}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="designUpload">Upload Design</Label>
                  <div className="mt-1.5 border-2 border-dashed rounded-md p-8 text-center">
                    <LucideImage className="w-10 h-10 mx-auto text-muted-foreground opacity-50" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      PNG, JPG or SVG (max 2MB)
                    </p>
                    <Input
                      id="designUpload"
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      variant="secondary"
                      className="mt-2"
                      onClick={() => document.getElementById('designUpload')?.click()}
                    >
                      Choose file
                    </Button>
                  </div>
                </div>
              )}
              
              {designImage && (
                <div>
                  <Label htmlFor="designPosition">Design Position</Label>
                  <Select value={designPosition} onValueChange={setDesignPosition}>
                    <SelectTrigger id="designPosition" className="mt-1.5">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <PreviewPanel />
          
          <Button 
            className="w-full mt-4 bg-gradient-purple"
            onClick={handleBuyNow}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </div>
    </CustomizationAccordion>
  );
};

export default CustomizationForm;
