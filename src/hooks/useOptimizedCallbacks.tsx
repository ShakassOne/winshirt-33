
import { useCallback } from 'react';
import { usePerformanceOptimization } from './usePerformanceOptimization';
import { Design } from '@/types/supabase.types';
import logger from '@/utils/logger';

interface CallbackHandlers {
  onSelectDesign: (design: Design) => void;
  onTextContentChange: (content: string) => void;
  onTextFontChange: (font: string) => void;
  onTextColorChange: (color: string) => void;
  onTextStylesChange: (styles: { bold: boolean; italic: boolean; underline: boolean }) => void;
  onSvgColorChange: (color: string) => void;
}

export const useOptimizedCallbacks = (
  currentSide: 'front' | 'back',
  handlers: CallbackHandlers
) => {
  const { debouncedTextUpdate, optimizedCallback } = usePerformanceOptimization();

  const handleDesignSelect = optimizedCallback((design: Design) => {
    logger.log(`[OptimizedCallbacks] Design select - ${currentSide}:`, design.name);
    handlers.onSelectDesign(design);
  });

  const handleTextContentChange = useCallback((content: string) => {
    debouncedTextUpdate(() => {
      logger.log(`[OptimizedCallbacks] Text content change - ${currentSide}: ${content.length} chars`);
      handlers.onTextContentChange(content);
    }, content);
  }, [debouncedTextUpdate, handlers, currentSide]);

  const handleTextFontChange = optimizedCallback((font: string) => {
    logger.log(`[OptimizedCallbacks] Text font change - ${currentSide}: ${font}`);
    handlers.onTextFontChange(font);
  });

  const handleTextColorChange = optimizedCallback((color: string) => {
    logger.log(`[OptimizedCallbacks] Text color change - ${currentSide}: ${color}`);
    handlers.onTextColorChange(color);
  });

  const handleTextStylesChange = optimizedCallback((styles: { bold: boolean; italic: boolean; underline: boolean }) => {
    logger.log(`[OptimizedCallbacks] Text styles change - ${currentSide}:`, styles);
    handlers.onTextStylesChange(styles);
  });

  const handleSvgColorChange = optimizedCallback((color: string) => {
    logger.log(`[OptimizedCallbacks] SVG color change - ${currentSide}: ${color}`);
    handlers.onSvgColorChange(color);
  });

  return {
    handleDesignSelect,
    handleTextContentChange,
    handleTextFontChange,
    handleTextColorChange,
    handleTextStylesChange,
    handleSvgColorChange
  };
};
