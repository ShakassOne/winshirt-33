
import { useEffect } from 'react';
import { useProductQueries } from './useProductQueries';
import { useUIState } from './useUIState';
import { useDesignState } from './useDesignState';
import { useTextState } from './useTextState';
import { useLotteryState } from './useLotteryState';

// Helper function for contrast calculation
export const getContrastColor = (hexColor: string): string => {
  // Remove the # if it exists
  const hex = hexColor ? hexColor.replace('#', '') : '';
  
  // If no hex color is provided or it's invalid, return a default color
  if (!hex || hex.length < 6) {
    return '#000000'; // Default to black text
  }
  
  // Parse the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate the perceptive luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on the luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const useProductDetail = () => {
  // Get data from all the sub-hooks
  const productQueries = useProductQueries();
  const uiState = useUIState();
  const designState = useDesignState();
  const textState = useTextState();
  const lotteryState = useLotteryState(productQueries.product, productQueries.lotteries);

  const { product } = productQueries;
  const { currentViewSide, setCurrentViewSide, selectedCategoryFilter } = uiState;
  
  // Initialize product colors and sizes
  useEffect(() => {
    if (product) {
      if (product.available_colors && product.available_colors.length > 0) {
        uiState.setSelectedColor(product.available_colors[0]);
      }
      if (product.available_sizes && product.available_sizes.length > 0) {
        uiState.setSelectedSize(product.available_sizes[0]);
      }
    }
  }, [product, uiState]);
  
  // Initialize mockup colors
  useEffect(() => {
    if (productQueries.mockup?.colors && productQueries.mockup.colors.length > 0) {
      uiState.setSelectedMockupColor(productQueries.mockup.colors[0]);
    }
  }, [productQueries.mockup, uiState]);

  // Synchronize active side states
  useEffect(() => {
    if (currentViewSide === 'front') {
      designState.setActiveDesignSide('front');
      textState.setActiveTextSide('front');
    } else {
      designState.setActiveDesignSide('back');
      textState.setActiveTextSide('back');
    }
  }, [currentViewSide, designState, textState]);

  // Lock/unlock scroll based on drag states
  useEffect(() => {
    if (uiState.pageScrollLocked || designState.isDragging || textState.isDraggingText) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [uiState.pageScrollLocked, designState.isDragging, textState.isDraggingText]);

  // Get filtered designs based on selected category
  const filteredDesigns = productQueries.getFilteredDesigns(selectedCategoryFilter);

  // Combine all state into a single object to maintain the same API
  return {
    // Queries and data
    ...productQueries,
    
    // UI state
    ...uiState,
    
    // Design state
    ...designState,
    
    // Text state
    ...textState,
    
    // Lottery state
    ...lotteryState,

    // Computed values that depend on multiple states
    filteredDesigns
  };
};
