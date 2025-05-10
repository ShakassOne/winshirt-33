import { useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Design, Lottery } from '@/types/supabase.types';
import { getContrastColor } from '@/hooks/useProductDetail';

export const useProductInteractions = (productDetailState: any) => {
  const {
    product,
    mockup,
    quantity,
    setQuantity,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    selectedMockupColor,
    currentViewSide,
    customizationMode,
    selectedDesignFront,
    setSelectedDesignFront,
    selectedDesignBack,
    setSelectedDesignBack,
    designTransformFront,
    setDesignTransformFront,
    designTransformBack,
    setDesignTransformBack,
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
    textTransformFront,
    setTextTransformFront,
    textTransformBack,
    setTextTransformBack,
    textStylesFront,
    setTextStylesFront,
    textStylesBack,
    setTextStylesBack,
    activeDesignSide,
    setActiveDesignSide,
    activeTextSide,
    setActiveTextSide,
    selectedLotteryIds,
    selectedLotteries,
    setSelectedLotteries,
    setSelectedLotteryIds,
    printSizeFront,
    printSizeBack,
    setIsDragging,
    setStartPos,
    setIsDraggingText,
    setStartPosText,
    setPageScrollLocked,
  } = productDetailState;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const productCanvasRef = useRef<HTMLDivElement>(null);

  // Mouse event handlers
  const handleMouseDown = (event: React.MouseEvent | React.TouchEvent, isText: boolean = false) => {
    event.preventDefault();
    
    let clientX: number, clientY: number;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    if (isText) {
      setIsDraggingText(true);
      setStartPosText({ x: clientX, y: clientY });
    } else {
      setIsDragging(true);
      setStartPos({ x: clientX, y: clientY });
    }
    
    setPageScrollLocked(true);
  };

  const handleMouseMove = (event: MouseEvent | TouchEvent) => {
    // This function is implemented in the useEffect in the main component
    // as it requires access to isDragging and isDraggingText state
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingText(false);
    setPageScrollLocked(false);
  };

  // Product interactions
  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleDesignSelect = (design: Design) => {
    if (currentViewSide === 'front') {
      setSelectedDesignFront(design);
      setActiveDesignSide('front');
    } else {
      setSelectedDesignBack(design);
      setActiveDesignSide('back');
    }
    productDetailState.setDesignDialogOpen(false);
    productDetailState.setPageScrollLocked(true);
  };

  const handleDesignTransformChange = (property: string, value: any) => {
    if (activeDesignSide === 'front') {
      setDesignTransformFront(prev => ({
        ...prev,
        [property]: value
      }));
    } else {
      setDesignTransformBack(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };

  const handleTextTransformChange = (property: string, value: any) => {
    if (activeTextSide === 'front') {
      setTextTransformFront(prev => ({
        ...prev,
        [property]: value
      }));
    } else {
      setTextTransformBack(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };

  const handleLotteryToggle = (lottery: Lottery, index: number) => {
    // Créer une copie des tableaux de loteries sélectionnées
    const updatedLotteries = [...selectedLotteries];
    const updatedLotteryIds = [...selectedLotteryIds];
    
    // Vérifier si la loterie est déjà sélectionnée
    const existingIndex = updatedLotteries.findIndex(l => l?.id === lottery.id);
    
    // Si la loterie est déjà sélectionnée
    if (existingIndex !== -1) {
      // Supprimer la loterie actuelle
      updatedLotteries.splice(existingIndex, 1);
      const idIndex = updatedLotteryIds.indexOf(lottery.id);
      if (idIndex !== -1) {
        updatedLotteryIds.splice(idIndex, 1);
      }
      
      // Si l'utilisateur a cliqué sur une loterie différente, l'ajouter
      if (index !== existingIndex) {
        // S'assurer que le tableau est assez grand
        while (updatedLotteries.length <= index) {
          updatedLotteries.push(null as unknown as Lottery);
        }
        
        updatedLotteries[index] = lottery;
        updatedLotteryIds.push(lottery.id);
      }
    } else {
      // La loterie n'est pas encore sélectionnée
      
      // Vérifier si on a déjà atteint le nombre maximum de loteries
      if (updatedLotteries.length >= (product?.tickets_offered || 0) && 
          !(index < updatedLotteries.length && updatedLotteries[index])) {
        toast.error(`Vous ne pouvez sélectionner que ${product?.tickets_offered} loterie(s) maximum pour ce produit.`);
        return;
      }
      
      // S'assurer que le tableau est assez grand
      while (updatedLotteries.length <= index) {
        updatedLotteries.push(null as unknown as Lottery);
      }
      
      // Si une loterie est déjà à cet index, supprimer son ID
      if (updatedLotteries[index]) {
        const oldIdIndex = updatedLotteryIds.indexOf(updatedLotteries[index].id);
        if (oldIdIndex !== -1) {
          updatedLotteryIds.splice(oldIdIndex, 1);
        }
      }
      
      // Ajouter la nouvelle loterie
      updatedLotteries[index] = lottery;
      updatedLotteryIds.push(lottery.id);
    }
    
    // Filtrer les entrées nulles et mettre à jour l'état
    const filteredLotteries = updatedLotteries.filter(l => l !== null);
    setSelectedLotteries(filteredLotteries);
    setSelectedLotteryIds(filteredLotteries.map(l => l.id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const design: Design = {
          id: `custom-${Date.now()}`,
          name: 'Mon design personnalisé',
          image_url: reader.result as string,
          category: 'custom',
          is_active: true
        };
        
        if (currentViewSide === 'front') {
          setSelectedDesignFront(design);
          setActiveDesignSide('front');
        } else {
          setSelectedDesignBack(design);
          setActiveDesignSide('back');
        }
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const calculatePrice = () => {
    if (!product) return 0;
    
    let price = product.price * quantity;
    
    if (customizationMode) {
      // Prix du design front
      const frontDesignPrice = selectedDesignFront ? 
        (printSizeFront === 'A3' ? mockup?.price_a3 || 15 : 
         printSizeFront === 'A4' ? mockup?.price_a4 || 10 : 
         printSizeFront === 'A5' ? mockup?.price_a5 || 8 : mockup?.price_a6 || 5) : 0;
      
      // Prix du design back
      const backDesignPrice = selectedDesignBack ? 
        (printSizeBack === 'A3' ? mockup?.price_a3 || 15 : 
         printSizeBack === 'A4' ? mockup?.price_a4 || 10 : 
         printSizeBack === 'A5' ? mockup?.price_a5 || 8 : mockup?.price_a6 || 5) : 0;
      
      // Prix du texte front
      const frontTextPrice = textContentFront ? (mockup?.text_price_front || 3) : 0;
      
      // Prix du texte back
      const backTextPrice = textContentBack ? (mockup?.text_price_back || 3) : 0;
      
      price += frontDesignPrice + backDesignPrice + frontTextPrice + backTextPrice;
    }
    
    return price;
  };

  const getColorHexCode = (colorName: string) => {
    // Convertir les noms de couleurs en codes hex
    const colorMap: {[key: string]: string} = {
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'blue': '#0000ff',
      'gray': '#808080',
      'navy': '#000080',
    };
    
    return colorName.startsWith('#') ? colorName : (colorMap[colorName.toLowerCase()] || '#000000');
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: calculatePrice(),
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      image_url: product.image_url,
      lotteries: selectedLotteryIds.length > 0 ? selectedLotteryIds : undefined,
      customization: undefined
    };

    // Customization object that includes both front and back designs and text
    if (customizationMode) {
      const customization: any = {};
      
      if (selectedDesignFront) {
        customization.frontDesign = {
          designId: selectedDesignFront.id,
          designName: selectedDesignFront.name,
          designUrl: selectedDesignFront.image_url,
          printSize: printSizeFront,
          transform: designTransformFront
        };
      }

      if (selectedDesignBack) {
        customization.backDesign = {
          designId: selectedDesignBack.id,
          designName: selectedDesignBack.name,
          designUrl: selectedDesignBack.image_url,
          printSize: printSizeBack,
          transform: designTransformBack
        };
      }

      if (textContentFront.trim()) {
        customization.frontText = {
          content: textContentFront,
          font: textFontFront,
          color: textColorFront,
          transform: textTransformFront,
          styles: textStylesFront
        };
      }

      if (textContentBack.trim()) {
        customization.backText = {
          content: textContentBack,
          font: textFontBack,
          color: textColorBack,
          transform: textTransformBack,
          styles: textStylesBack
        };
      }

      // Only add customization if there's at least one design or text
      if (Object.keys(customization).length > 0) {
        cartItem.customization = customization;
      }
    }

    // Ajouter l'élément au panier (localStorage pour l'instant)
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify([...existingCart, cartItem]));
    
    toast.success('Produit ajouté au panier !');
  };
  
  const getProductImage = () => {
    if (!customizationMode) {
      return product?.image_url;
    }
    
    if (selectedMockupColor) {
      return currentViewSide === 'front' 
        ? selectedMockupColor.front_image_url 
        : (selectedMockupColor.back_image_url || product?.image_url);
    } else if (mockup) {
      return currentViewSide === 'front' 
        ? mockup.svg_front_url 
        : (mockup.svg_back_url || product?.image_url);
    }
    
    return product?.image_url;
  };

  const getCurrentDesign = () => {
    return currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack;
  };
  
  const getCurrentDesignTransform = () => {
    return currentViewSide === 'front' ? designTransformFront : designTransformBack;
  };
  
  const getCurrentTextContent = () => {
    return currentViewSide === 'front' ? textContentFront : textContentBack;
  };
  
  const getCurrentTextTransform = () => {
    return currentViewSide === 'front' ? textTransformFront : textTransformBack;
  };
  
  const getCurrentTextFont = () => {
    return currentViewSide === 'front' ? textFontFront : textFontBack;
  };
  
  const getCurrentTextColor = () => {
    return currentViewSide === 'front' ? textColorFront : textColorBack;
  };
  
  const getCurrentTextStyles = () => {
    return currentViewSide === 'front' ? textStylesFront : textStylesBack;
  };

  return {
    fileInputRef,
    productCanvasRef,
    handleMouseDown,
    handleMouseUp,
    handleQuantityChange,
    handleDesignSelect,
    handleDesignTransformChange,
    handleTextTransformChange,
    handleLotteryToggle,
    handleFileUpload,
    calculatePrice,
    getColorHexCode,
    handleAddToCart,
    getProductImage,
    getCurrentDesign,
    getCurrentDesignTransform,
    getCurrentTextContent,
    getCurrentTextTransform,
    getCurrentTextFont,
    getCurrentTextColor,
    getCurrentTextStyles
  };
};
