import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ArrowLeft,
  RotateCw,
  Minus,
  Plus,
  Type,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  Upload,
  UsersRound,
  Target,
  PenTool,
  X
} from 'lucide-react';
import { fetchProductById, fetchAllLotteries, fetchAllDesigns, fetchMockupById } from '@/services/api.service';
import { Product, Design, Lottery } from '@/types/supabase.types';
import { MockupWithColors, MockupColor } from '@/types/mockup.types';
import ProductImageSection from '@/components/product/ProductImageSection';
import ProductOrderSection from '@/components/product/ProductOrderSection';
import CustomizationPanel from '@/components/product/CustomizationPanel';
import DesignGalleryDialog from '@/components/product/DesignGalleryDialog';
import TextCustomizationTools from '@/components/product/TextCustomizationTools';
import DesignCustomizationTools from '@/components/product/DesignCustomizationTools';
import LotterySelector from '@/components/product/LotterySelector';
import ProductDescription from '@/components/product/ProductDescription';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';

// Add this function before the ProductDetail component
const getContrastColor = (hexColor: string): string => {
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

const ProductDetail = () => {
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const productCanvasRef = useRef<HTMLDivElement>(null);

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

  const uniqueCategories = React.useMemo(() => {
    if (!designs) return ['all'];
    const categories = designs.map(design => design.category);
    return ['all', ...new Set(categories)];
  }, [designs]);
  
  const filteredDesigns = React.useMemo(() => {
    if (!designs) return [];
    if (selectedCategoryFilter === 'all') {
      return designs.filter(design => design.is_active !== false);
    } else {
      return designs.filter(design => 
        design.is_active !== false && design.category === selectedCategoryFilter
      );
    }
  }, [designs, selectedCategoryFilter]);

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

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (isDragging || isDraggingText) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isDragging, isDraggingText]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, startPos, isDraggingText, startPosText]);

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
    let clientX: number, clientY: number;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    if (isDragging) {
      const deltaX = clientX - startPos.x;
      const deltaY = clientY - startPos.y;
      
      if (activeDesignSide === 'front') {
        setDesignTransformFront(prev => ({
          ...prev,
          position: {
            x: prev.position.x + deltaX,
            y: prev.position.y + deltaY
          }
        }));
      } else {
        setDesignTransformBack(prev => ({
          ...prev,
          position: {
            x: prev.position.x + deltaX,
            y: prev.position.y + deltaY
          }
        }));
      }
      
      setStartPos({ x: clientX, y: clientY });
    } else if (isDraggingText) {
      const deltaX = clientX - startPosText.x;
      const deltaY = clientY - startPosText.y;
      
      if (activeTextSide === 'front') {
        setTextTransformFront(prev => ({
          ...prev,
          position: {
            x: prev.position.x + deltaX,
            y: prev.position.y + deltaY
          }
        }));
      } else {
        setTextTransformBack(prev => ({
          ...prev,
          position: {
            x: prev.position.x + deltaX,
            y: prev.position.y + deltaY
          }
        }));
      }
      
      setStartPosText({ x: clientX, y: clientY });
    }
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
    setDesignDialogOpen(false);
    setPageScrollLocked(true);
  };

  const handleDesignTransformChange = (property: keyof typeof designTransformFront, value: any) => {
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

  const handleTextTransformChange = (property: keyof typeof textTransformFront, value: any) => {
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

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const activeLotteries = lotteries.filter(lottery => lottery.is_active);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Bouton retour */}
          <Link to="/products" className="flex items-center gap-2 font-medium mb-8">
            <ArrowLeft className="h-5 w-5" />
            Retour aux produits
          </Link>

          {/* Product display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Product Image */}
            <ProductImageSection 
              product={product}
              mockup={mockup}
              customizationMode={customizationMode}
              currentViewSide={currentViewSide}
              setCurrentViewSide={setCurrentViewSide}
              selectedMockupColor={selectedMockupColor}
              getProductImage={getProductImage}
              selectedDesignFront={selectedDesignFront}
              selectedDesignBack={selectedDesignBack}
              designTransformFront={designTransformFront}
              designTransformBack={designTransformBack}
              textContentFront={textContentFront}
              textContentBack={textContentBack}
              textTransformFront={textTransformFront}
              textTransformBack={textTransformBack}
              textFontFront={textFontFront}
              textFontBack={textFontBack}
              textColorFront={textColorFront}
              textColorBack={textColorBack}
              textStylesFront={textStylesFront}
              textStylesBack={textStylesBack}
              handleMouseDown={handleMouseDown}
              productCanvasRef={productCanvasRef}
              isDragging={isDragging}
              isDraggingText={isDraggingText}
            />
            
            {/* Right column - Product Info */}
            <div className="space-y-6">
              {/* Product info */}
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-xl font-semibold mt-2">
                  {calculatePrice().toFixed(2)}€
                </p>

                {product.is_new && (
                  <Badge className="mt-2 bg-green-500 hover:bg-green-600">Nouveau</Badge>
                )}
              </div>
              
              {/* Product customization */}
              {product.is_customizable && (
                <CustomizationPanel 
                  customizationMode={customizationMode}
                  setCustomizationMode={setCustomizationMode}
                  currentViewSide={currentViewSide}
                  setDesignDialogOpen={setDesignDialogOpen}
                  handleFileUpload={handleFileUpload}
                  fileInputRef={fileInputRef}
                  selectedDesignFront={selectedDesignFront}
                  selectedDesignBack={selectedDesignBack}
                  textContentFront={textContentFront}
                  setTextContentFront={setTextContentFront}
                  textContentBack={textContentBack}
                  setTextContentBack={setTextContentBack}
                  textFontFront={textFontFront}
                  setTextFontFront={setTextFontFront}
                  textFontBack={textFontBack}
                  setTextFontBack={setTextFontBack}
                  textColorFront={textColorFront}
                  setTextColorFront={setTextColorFront}
                  textColorBack={textColorBack}
                  setTextColorBack={setTextColorBack}
                  textShowColorPickerFront={textShowColorPickerFront}
                  setTextShowColorPickerFront={setTextShowColorPickerFront}
                  textShowColorPickerBack={textShowColorPickerBack}
                  setTextShowColorPickerBack={setTextShowColorPickerBack}
                  textStylesFront={textStylesFront}
                  setTextStylesFront={setTextStylesFront}
                  textStylesBack={textStylesBack}
                  setTextStylesBack={setTextStylesBack}
                  designTransformFront={designTransformFront}
                  designTransformBack={designTransformBack}
                  textTransformFront={textTransformFront}
                  textTransformBack={textTransformBack}
                  handleDesignTransformChange={handleDesignTransformChange}
                  handleTextTransformChange={handleTextTransformChange}
                  printSizeFront={printSizeFront}
                  setPrintSizeFront={setPrintSizeFront}
                  printSizeBack={printSizeBack}
                  setPrintSizeBack={setPrintSizeBack}
                  activeDesignSide={activeDesignSide}
                  activeTextSide={activeTextSide}
                  setActiveDesignSide={setActiveDesignSide}
                  setActiveTextSide={setActiveTextSide}
                  getCurrentDesign={getCurrentDesign}
                  getCurrentDesignTransform={getCurrentDesignTransform}
                  getCurrentTextContent={getCurrentTextContent}
                  getCurrentTextTransform={getCurrentTextTransform}
                  getCurrentTextFont={getCurrentTextFont}
                  getCurrentTextColor={getCurrentTextColor}
                  getCurrentTextStyles={getCurrentTextStyles}
                />
              )}

              {/* Color selection */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Couleur</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color
                            ? 'border-black'
                            : 'border-gray-300'
                        }`}
                        style={{
                          backgroundColor: getColorHexCode(color),
                        }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Couleur: ${color}`}
                      >
                        {selectedColor === color && (
                          <Check
                            className="w-4 h-4 mx-auto text-white"
                            style={{
                              color: getContrastColor(getColorHexCode(color)),
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mockup colors */}
              {customizationMode && mockup?.colors && mockup.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Couleur du produit</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockup.colors.map((mockupColor) => (
                      <button
                        key={mockupColor.id || mockupColor.name}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedMockupColor?.color_code === mockupColor.color_code
                            ? 'border-black'
                            : 'border-gray-300'
                        }`}
                        style={{
                          backgroundColor: mockupColor.hex_code,
                        }}
                        onClick={() => setSelectedMockupColor(mockupColor)}
                        aria-label={`Couleur: ${mockupColor.name}`}
                      >
                        {selectedMockupColor?.color_code === mockupColor.color_code && (
                          <Check
                            className="w-5 h-5 mx-auto"
                            style={{
                              color: getContrastColor(mockupColor.hex_code),
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Taille</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map((size) => (
                      <button
                        key={size}
                        className={`px-4 py-2 rounded border ${
                          selectedSize === size
                            ? 'bg-black text-white'
                            : 'border-gray-300'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to cart */}
              <ProductOrderSection
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                handleAddToCart={handleAddToCart}
              />

              {/* Lottery tickets */}
              {product.tickets_offered && product.tickets_offered > 0 && (
                <LotterySelector
                  product={product}
                  activeLotteries={activeLotteries}
                  selectedLotteries={selectedLotteries}
                  handleLotteryToggle={handleLotteryToggle}
                />
              )}
              
              {/* Product description */}
              <ProductDescription 
                product={product}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Design gallery dialog */}
      <DesignGalleryDialog
        isOpen={designDialogOpen}
        setIsOpen={setDesignDialogOpen}
        designs={filteredDesigns}
        uniqueCategories={uniqueCategories}
        selectedCategoryFilter={selectedCategoryFilter}
        setSelectedCategoryFilter={setSelectedCategoryFilter}
        handleDesignSelect={handleDesignSelect}
        isLoading={isLoadingDesigns}
      />
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
