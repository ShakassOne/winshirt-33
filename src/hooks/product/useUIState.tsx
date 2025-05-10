
import { useState, useEffect } from 'react';
import { MockupColor } from '@/types/mockup.types';

export const useUIState = () => {
  const [currentViewSide, setCurrentViewSide] = useState<'front' | 'back'>('front');
  const [customizationMode, setCustomizationMode] = useState(false);
  const [selectedMockupColor, setSelectedMockupColor] = useState<MockupColor | null>(null);
  const [designDialogOpen, setDesignDialogOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [pageScrollLocked, setPageScrollLocked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Handle document body overflow based on UI state
  useEffect(() => {
    if (pageScrollLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pageScrollLocked]);

  return {
    currentViewSide,
    setCurrentViewSide,
    customizationMode,
    setCustomizationMode,
    selectedMockupColor,
    setSelectedMockupColor,
    designDialogOpen,
    setDesignDialogOpen,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    pageScrollLocked,
    setPageScrollLocked,
    quantity,
    setQuantity,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize
  };
};
