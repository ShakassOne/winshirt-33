
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, Design, Mockup, Lottery, PrintArea } from '@/types/supabase.types';
import { useDesignState } from './useDesignState';
import { useTextState } from './useTextState';
import { useLotteryState } from './useLotteryState';
import { useUIState } from './useUIState';

// Calculate contrast color for text over a background
export const getContrastColor = (hexColor: string | undefined) => {
  // Default to black if no color is provided
  if (!hexColor) return '#000000';

  // If hexColor starts with #, remove it
  if (hexColor.startsWith('#')) {
    hexColor = hexColor.slice(1);
  }

  // Convert hex to RGB
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark colors, black for light colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

export const useProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch product, mockup, designs, and lotteries
  const {
    data: product,
    isLoading: isLoadingProduct
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Product;
    }
  });
  
  // Fetch mockup if product is customizable
  const {
    data: mockup,
    isLoading: isLoadingMockup
  } = useQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: async () => {
      if (!product?.mockup_id) return null;
      
      const { data, error } = await supabase
        .from('mockups')
        .select('*')
        .eq('id', product.mockup_id)
        .single();

      if (error) {
        throw error;
      }

      // Process the data to ensure print_areas and colors are properly typed
      const processedData: Mockup = {
        ...data as any,
        print_areas: Array.isArray(data.print_areas) 
          ? data.print_areas.map((area: any) => ({
              id: area.id || '',
              name: area.name || '',
              x: area.x || area.position_x || 0,
              y: area.y || area.position_y || 0,
              width: area.width || 0,
              height: area.height || 0,
              side: area.side || 'front',
              position_x: area.position_x || area.x || 0,
              position_y: area.position_y || area.y || 0
            } as PrintArea))
          : [],
        colors: Array.isArray(data.colors) ? data.colors : []
      };

      return processedData;
    },
    enabled: !!product?.mockup_id && !!product?.is_customizable,
  });
  
  // Fetch designs for customization
  const {
    data: designs,
    isLoading: isLoadingDesigns
  } = useQuery({
    queryKey: ['designs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      return data as Design[];
    },
    enabled: !!product?.is_customizable,
  });
  
  // Fetch available lotteries
  const {
    data: lotteries,
    isLoading: isLoadingLotteries
  } = useQuery({
    queryKey: ['lotteries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lotteries')
        .select('*')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      return data as Lottery[];
    },
    enabled: !!product?.tickets_offered && product.tickets_offered > 0,
  });
  
  // State for quantity
  const [quantity, setQuantity] = useState<number>(1);
  
  // State for color and size selection
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedMockupColor, setSelectedMockupColor] = useState<any>(null);
  
  // Get states from custom hooks
  const designState = useDesignState();
  const textState = useTextState();
  const lotteryState = useLotteryState(product, lotteries || []);
  const uiState = useUIState();
  
  // Extract active lotteries
  const activeLotteries = lotteries?.filter(lottery => lottery.is_active) || [];
  
  // Extract unique design categories
  const uniqueCategories = designs ? [...new Set(designs.map(design => design.category))] : [];

  // Filter designs based on category
  const filteredDesigns = designs && uiState.selectedCategoryFilter
    ? designs.filter(design => design.category === uiState.selectedCategoryFilter)
    : designs || [];
  
  // Initialize selected color and size when product data is loaded
  useEffect(() => {
    if (product) {
      if (product.available_colors && product.available_colors.length > 0 && !selectedColor) {
        setSelectedColor(product.available_colors[0]);
      }
      
      if (product.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.available_sizes[0]);
      }
    }
  }, [product, selectedColor, selectedSize]);
  
  // Initialize mockup color when mockup data is loaded
  useEffect(() => {
    if (mockup?.colors && mockup.colors.length > 0 && !selectedMockupColor) {
      setSelectedMockupColor(mockup.colors[0]);
    }
  }, [mockup, selectedMockupColor]);
  
  // Combine all loading states
  const isLoading = isLoadingProduct || (product?.is_customizable && isLoadingMockup) || 
                    (product?.is_customizable && isLoadingDesigns) || 
                    (product?.tickets_offered && product.tickets_offered > 0 && isLoadingLotteries);
  
  return {
    product,
    mockup,
    designs,
    lotteries,
    isLoading,
    isLoadingDesigns,
    quantity,
    setQuantity,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    selectedMockupColor,
    setSelectedMockupColor,
    activeLotteries,
    uniqueCategories,
    filteredDesigns,
    ...designState,
    ...textState,
    ...lotteryState,
    ...uiState,
  };
};
