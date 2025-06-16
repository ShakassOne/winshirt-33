
import { useState, useCallback } from 'react';
import { Design } from '@/types/supabase.types';
import logger from '@/utils/logger';

interface TextTransform {
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

interface DesignTransform {
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

export const useProductCustomization = () => {
  // Design states
  const [selectedDesignFront, setSelectedDesignFront] = useState<Design | null>(null);
  const [selectedDesignBack, setSelectedDesignBack] = useState<Design | null>(null);
  const [designTransformFront, setDesignTransformFront] = useState<DesignTransform>({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });
  const [designTransformBack, setDesignTransformBack] = useState<DesignTransform>({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });

  // Text states
  const [textContentFront, setTextContentFront] = useState('');
  const [textContentBack, setTextContentBack] = useState('');
  const [textFontFront, setTextFontFront] = useState('Arial');
  const [textFontBack, setTextFontBack] = useState('Arial');
  const [textColorFront, setTextColorFront] = useState('#ffffff');
  const [textColorBack, setTextColorBack] = useState('#ffffff');
  const [textStylesFront, setTextStylesFront] = useState({ bold: false, italic: false, underline: false });
  const [textStylesBack, setTextStylesBack] = useState({ bold: false, italic: false, underline: false });
  const [textTransformFront, setTextTransformFront] = useState<TextTransform>({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });
  const [textTransformBack, setTextTransformBack] = useState<TextTransform>({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });

  // SVG states
  const [svgColorFront, setSvgColorFront] = useState('#ffffff');
  const [svgColorBack, setSvgColorBack] = useState('#ffffff');
  const [svgContentFront, setSvgContentFront] = useState('');
  const [svgContentBack, setSvgContentBack] = useState('');

  // Handlers pour les designs
  const handleDesignTransformChange = useCallback((side: 'front' | 'back', property: string, value: any) => {
    logger.log(`[Customization] Design transform change - ${side}: ${property} = ${value}`);
    
    if (side === 'front') {
      setDesignTransformFront(prev => ({
        ...prev,
        [property]: property === 'position' ? value : value
      }));
    } else {
      setDesignTransformBack(prev => ({
        ...prev,
        [property]: property === 'position' ? value : value
      }));
    }
  }, []);

  const handleTextTransformChange = useCallback((side: 'front' | 'back', property: string, value: any) => {
    logger.log(`[Customization] Text transform change - ${side}: ${property} = ${value}`);
    
    if (side === 'front') {
      setTextTransformFront(prev => ({
        ...prev,
        [property]: property === 'position' ? value : value
      }));
    } else {
      setTextTransformBack(prev => ({
        ...prev,
        [property]: property === 'position' ? value : value
      }));
    }
  }, []);

  const handleRemoveDesign = useCallback((side: 'front' | 'back') => {
    logger.log(`[Customization] Remove design - ${side}`);
    if (side === 'front') {
      setSelectedDesignFront(null);
      setSvgContentFront('');
    } else {
      setSelectedDesignBack(null);
      setSvgContentBack('');
    }
  }, []);

  const handleRemoveText = useCallback((side: 'front' | 'back') => {
    logger.log(`[Customization] Remove text - ${side}`);
    if (side === 'front') {
      setTextContentFront('');
    } else {
      setTextContentBack('');
    }
  }, []);

  // Getters pour les données unifiées
  const getUnifiedCustomization = useCallback(() => {
    return {
      frontDesign: selectedDesignFront ? {
        design: selectedDesignFront,
        transform: designTransformFront,
        svgColor: svgColorFront,
        svgContent: svgContentFront
      } : null,
      backDesign: selectedDesignBack ? {
        design: selectedDesignBack,
        transform: designTransformBack,
        svgColor: svgColorBack,
        svgContent: svgContentBack
      } : null,
      frontText: textContentFront ? {
        content: textContentFront,
        font: textFontFront,
        color: textColorFront,
        styles: textStylesFront,
        transform: textTransformFront
      } : null,
      backText: textContentBack ? {
        content: textContentBack,
        font: textFontBack,
        color: textColorBack,
        styles: textStylesBack,
        transform: textTransformBack
      } : null
    };
  }, [
    selectedDesignFront, selectedDesignBack,
    designTransformFront, designTransformBack,
    svgColorFront, svgColorBack,
    svgContentFront, svgContentBack,
    textContentFront, textContentBack,
    textFontFront, textFontBack,
    textColorFront, textColorBack,
    textStylesFront, textStylesBack,
    textTransformFront, textTransformBack
  ]);

  return {
    // States
    selectedDesignFront,
    selectedDesignBack,
    designTransformFront,
    designTransformBack,
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
    svgColorFront,
    svgColorBack,
    svgContentFront,
    svgContentBack,
    
    // Setters
    setSelectedDesignFront,
    setSelectedDesignBack,
    setDesignTransformFront,
    setDesignTransformBack,
    setTextContentFront,
    setTextContentBack,
    setTextFontFront,
    setTextFontBack,
    setTextColorFront,
    setTextColorBack,
    setTextStylesFront,
    setTextStylesBack,
    setTextTransformFront,
    setTextTransformBack,
    setSvgColorFront,
    setSvgColorBack,
    setSvgContentFront,
    setSvgContentBack,
    
    // Handlers
    handleDesignTransformChange,
    handleTextTransformChange,
    handleRemoveDesign,
    handleRemoveText,
    getUnifiedCustomization
  };
};
