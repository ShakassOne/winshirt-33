
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchProductById, fetchMockupById, fetchAllLotteries, fetchAllDesigns } from '@/services/api.service';
import { Design, Lottery, MockupColor } from '@/types/supabase.types';

// Helper function moved from ProductDetail
export const getContrastColor = (hexColor: string): string => {
  // Remove the # if it exists
  const hex = hexColor.replace('#', '');
  
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
  const { id } = useParams<{ id: string }>();
  const [currentViewSide, setCurrentViewSide] = useState<'front' | 'back'>('front');
  const [customizationMode, setCustomizationMode] = useState(false);
  const [selectedMockupColor, setSelectedMockupColor] = useState<MockupColor | null>(null);
  const [designDialogOpen, setDesignDialogOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [pageScrollLocked, setPageScrollLocked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Designs state
  const [selectedDesignFront, setSelectedDesignFront] = useState<Design | null>(null);
  const [selectedDesignBack, setSelectedDesignBack] = useState<Design | null>(null);
  const [designTransformFront, setDesignTransformFront] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });
  const [designTransformBack, setDesignTransformBack] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });
  const [printSizeFront, setPrintSizeFront] = useState<string>('A4');
  const [printSizeBack, setPrintSizeBack] = useState<string>('A4');

  // Text state
  const [textContentFront, setTextContentFront] = useState('');
  const [textContentBack, setTextContentBack] = useState('');
  const [textFontFront, setTextFontFront] = useState('Roboto');
  const [textFontBack, setTextFontBack] = useState('Roboto');
  const [textColorFront, setTextColorFront] = useState('#ffffff');
  const [textColorBack, setTextColorBack] = useState('#ffffff');
  const [textShowColorPickerFront, setTextShowColorPickerFront] = useState(false);
  const [textShowColorPickerBack, setTextShowColorPickerBack] = useState(false);
  const [textTransformFront, setTextTransformFront] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });
  const [textTransformBack, setTextTransformBack] = useState({
    position: { x: 0, y: 0 },
    scale: 1,
    rotation: 0
  });
  const [textStylesFront, setTextStylesFront] = useState({
    bold: false,
    italic: false,
    underline: false
  });
  const [textStylesBack, setTextStylesBack] = useState({
    bold: false,
    italic: false,
    underline: false
  });

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [startPosText, setStartPosText] = useState({ x: 0, y: 0 });
  const [activeDesignSide, setActiveDesignSide] = useState<'front' | 'back'>('front');
  const [activeTextSide, setActiveTextSide] = useState<'front' | 'back'>('front');
  
  // Lottery state
  const [selectedLotteryIds, setSelectedLotteryIds] = useState<string[]>([]);
  const [selectedLotteries, setSelectedLotteries] = useState<Lottery[]>([]);

  // Queries
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });

  const { data: mockup, isLoading: isLoadingMockup } = useQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: () => fetchMockupById(product?.mockup_id!),
    enabled: !!product?.mockup_id,
  });

  const { data: lotteries = [], isLoading: isLoadingLotteries } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries,
  });

  const { data: designs = [], isLoading: isLoadingDesigns } = useQuery({
    queryKey: ['designs'],
    queryFn: fetchAllDesigns,
  });

  // Computed values
  const uniqueCategories = designs ? ['all', ...new Set(designs.map(design => design.category))] : ['all'];
  
  const filteredDesigns = designs ?
    selectedCategoryFilter === 'all' ?
      designs.filter(design => design.is_active !== false) :
      designs.filter(design => design.is_active !== false && design.category === selectedCategoryFilter) :
    [];

  const activeLotteries = lotteries.filter(lottery => lottery.is_active);

  // Effects
  useEffect(() => {
    if (product) {
      if (product.available_colors && product.available_colors.length > 0) {
        setSelectedColor(product.available_colors[0]);
      }
      if (product.available_sizes && product.available_sizes.length > 0) {
        setSelectedSize(product.available_sizes[0]);
      }
    }
  }, [product]);
  
  useEffect(() => {
    if (mockup?.colors && mockup.colors.length > 0) {
      setSelectedMockupColor(mockup.colors[0]);
    }
  }, [mockup]);

  useEffect(() => {
    if (pageScrollLocked || isDragging || isDraggingText) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pageScrollLocked, isDragging, isDraggingText]);

  useEffect(() => {
    if (product?.tickets_offered && product.tickets_offered > 0 && lotteries.length > 0) {
      const activeLotteries = lotteries.filter(lottery => lottery.is_active);
      if (activeLotteries.length > 0 && selectedLotteries.length === 0) {
        // Ajouter la première loterie par défaut
        setSelectedLotteries([activeLotteries[0]]);
        setSelectedLotteryIds([activeLotteries[0].id]);
      }
    }
  }, [product, lotteries, selectedLotteries.length]);

  useEffect(() => {
    if (currentViewSide === 'front') {
      setActiveDesignSide('front');
      setActiveTextSide('front');
    } else {
      setActiveDesignSide('back');
      setActiveTextSide('back');
    }
  }, [currentViewSide]);

  return {
    // State
    id,
    product,
    mockup,
    lotteries,
    designs,
    isLoading,
    isLoadingMockup,
    isLoadingLotteries,
    isLoadingDesigns,
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
    setSelectedSize,
    selectedDesignFront,
    setSelectedDesignFront,
    selectedDesignBack,
    setSelectedDesignBack,
    designTransformFront,
    setDesignTransformFront,
    designTransformBack,
    setDesignTransformBack,
    printSizeFront,
    setPrintSizeFront,
    printSizeBack,
    setPrintSizeBack,
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
    textTransformFront,
    setTextTransformFront,
    textTransformBack,
    setTextTransformBack,
    textStylesFront,
    setTextStylesFront,
    textStylesBack,
    setTextStylesBack,
    isDragging,
    setIsDragging,
    startPos,
    setStartPos,
    isDraggingText,
    setIsDraggingText,
    startPosText,
    setStartPosText,
    activeDesignSide,
    setActiveDesignSide,
    activeTextSide,
    setActiveTextSide,
    selectedLotteryIds,
    setSelectedLotteryIds,
    selectedLotteries,
    setSelectedLotteries,
    uniqueCategories,
    filteredDesigns,
    activeLotteries
  };
};
