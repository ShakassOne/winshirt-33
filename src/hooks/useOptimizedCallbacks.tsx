
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
  const { debouncedTextUpdate } = usePerformanceOptimization();

  const handleDesignSelect = useCallback((design: Design) => {
    logger.log(`[OptimizedCallbacks] Design select - ${currentSide}:`, design.name);
    handlers.onSelectDesign(design);
  }, [handlers, currentSide]);

  const handleTextContentChange = useCallback((content: string) => {
    debouncedTextUpdate(() => {
      logger.log(`[OptimizedCallbacks] Text content change - ${currentSide}: ${content.length} chars`);
      handlers.onTextContentChange(content);
    }, content);
  }, [debouncedTextUpdate, handlers, currentSide]);

  const handleTextFontChange = useCallback((font: string) => {
    logger.log(`[OptimizedCallbacks] Text font change - ${currentSide}: ${font}`);
    handlers.onTextFontChange(font);
  }, [handlers, currentSide]);

  const handleTextColorChange = useCallback((color: string) => {
    logger.log(`[OptimizedCallbacks] Text color change - ${currentSide}: ${color}`);
    handlers.onTextColorChange(color);
  }, [handlers, currentSide]);

  const handleTextStylesChange = useCallback((styles: { bold: boolean; italic: boolean; underline: boolean }) => {
    logger.log(`[OptimizedCallbacks] Text styles change - ${currentSide}:`, styles);
    handlers.onTextStylesChange(styles);
  }, [handlers, currentSide]);

  const handleSvgColorChange = useCallback((color: string) => {
    logger.log(`[OptimizedCallbacks] SVG color change - ${currentSide}: ${color}`);
    handlers.onSvgColorChange(color);
  }, [handlers, currentSide]);

  return {
    handleDesignSelect,
    handleTextContentChange,
    handleTextFontChange,
    handleTextColorChange,
    handleTextStylesChange,
    handleSvgColorChange
  };
};
