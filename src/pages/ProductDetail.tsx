
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
  PenTool
} from 'lucide-react';
import { fetchProductById, fetchAllLotteries, fetchAllDesigns, fetchMockupById } from '@/services/api.service';
import { Design, Lottery, CartItem } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { HexColorPicker } from 'react-colorful';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/context/CartContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Définition des polices Google Fonts
const googleFonts = [
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'PT Sans', label: 'PT Sans' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Ubuntu', label: 'Ubuntu' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Noto Sans', label: 'Noto Sans' },
  { value: 'Fira Sans', label: 'Fira Sans' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'Dancing Script', label: 'Dancing Script' },
  { value: 'Pacifico', label: 'Pacifico' },
  { value: 'Shadows Into Light', label: 'Shadows Into Light' },
  { value: 'Lobster', label: 'Lobster' },
  { value: 'Caveat', label: 'Caveat' },
  { value: 'Comfortaa', label: 'Comfortaa' },
  { value: 'Indie Flower', label: 'Indie Flower' },
  { value: 'Sacramento', label: 'Sacramento' },
  { value: 'Architects Daughter', label: 'Architects Daughter' },
  { value: 'Permanent Marker', label: 'Permanent Marker' },
  { value: 'Satisfy', label: 'Satisfy' },
  { value: 'Amatic SC', label: 'Amatic SC' },
  { value: 'Pathway Gothic One', label: 'Pathway Gothic One' },
  { value: 'Abel', label: 'Abel' },
  { value: 'Barlow', label: 'Barlow' },
  { value: 'Cabin', label: 'Cabin' },
  { value: 'Crimson Text', label: 'Crimson Text' },
  { value: 'Exo 2', label: 'Exo 2' },
  { value: 'Fjalla One', label: 'Fjalla One' },
  { value: 'Josefin Sans', label: 'Josefin Sans' },
  { value: 'Karla', label: 'Karla' },
  { value: 'Libre Baskerville', label: 'Libre Baskerville' },
  { value: 'Muli', label: 'Muli' },
  { value: 'Noto Serif', label: 'Noto Serif' },
  { value: 'Oxygen', label: 'Oxygen' },
  { value: 'Prompt', label: 'Prompt' },
  { value: 'Rubik', label: 'Rubik' },
  { value: 'Space Mono', label: 'Space Mono' },
  { value: 'Work Sans', label: 'Work Sans' },
  { value: 'Yanone Kaffeesatz', label: 'Yanone Kaffeesatz' },
  { value: 'Bree Serif', label: 'Bree Serif' },
  { value: 'Crete Round', label: 'Crete Round' },
  { value: 'Abril Fatface', label: 'Abril Fatface' },
  { value: 'Righteous', label: 'Righteous' },
  { value: 'Philosopher', label: 'Philosopher' },
  { value: 'Kanit', label: 'Kanit' },
  { value: 'Russo One', label: 'Russo One' },
  { value: 'Archivo', label: 'Archivo' },
  { value: 'Arvo', label: 'Arvo' },
  { value: 'Bitter', label: 'Bitter' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'Didact Gothic', label: 'Didact Gothic' },
  { value: 'EB Garamond', label: 'EB Garamond' },
  { value: 'Fredoka One', label: 'Fredoka One' },
  { value: 'Gloria Hallelujah', label: 'Gloria Hallelujah' },
  { value: 'Hind', label: 'Hind' },
  { value: 'IBM Plex Sans', label: 'IBM Plex Sans' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Kalam', label: 'Kalam' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Maven Pro', label: 'Maven Pro' },
  { value: 'Neucha', label: 'Neucha' },
  { value: 'Overpass', label: 'Overpass' },
  { value: 'Patrick Hand', label: 'Patrick Hand' },
  { value: 'Quattrocento Sans', label: 'Quattrocento Sans' },
  { value: 'Roboto Condensed', label: 'Roboto Condensed' },
  { value: 'Roboto Mono', label: 'Roboto Mono' },
  { value: 'Roboto Slab', label: 'Roboto Slab' },
  { value: 'Signika', label: 'Signika' },
  { value: 'Teko', label: 'Teko' },
  { value: 'Ubuntu Condensed', label: 'Ubuntu Condensed' },
  { value: 'Varela Round', label: 'Varela Round' },
  { value: 'Acme', label: 'Acme' },
  { value: 'Alegreya', label: 'Alegreya' },
  { value: 'Anton', label: 'Anton' },
  { value: 'Asap', label: 'Asap' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Baloo 2', label: 'Baloo 2' },
  { value: 'Bangers', label: 'Bangers' },
  { value: 'BioRhyme', label: 'BioRhyme' },
  { value: 'Catamaran', label: 'Catamaran' },
  { value: 'Coda', label: 'Coda' },
  { value: 'Courgette', label: 'Courgette' },
  { value: 'Cousine', label: 'Cousine' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Dosis', label: 'Dosis' },
  { value: 'Fira Code', label: 'Fira Code' }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const { addItem } = useCart();
  const productCanvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('design');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [designDialogOpen, setDesignDialogOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [pageScrollLocked, setPageScrollLocked] = useState(false);
  const [currentViewSide, setCurrentViewSide] = useState<'front' | 'back'>('front');
  const [customizationMode, setCustomizationMode] = useState(false);
  const [selectedMockupColor, setSelectedMockupColor] = useState<MockupColor | null>(null);
  
  // État pour les designs - maintenant séparés par côté (recto/verso)
  const [selectedDesignFront, setSelectedDesignFront] = useState<Design | null>(null);
  const [selectedDesignBack, setSelectedDesignBack] = useState<Design | null>(null);
  
  // État pour les transformations des designs - séparés par côté
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
  
  // État pour les tailles d'impression - séparées par côté
  const [printSizeFront, setPrintSizeFront] = useState<string>('A4');
  const [printSizeBack, setPrintSizeBack] = useState<string>('A4');

  // État pour le texte - séparé par côté
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

  // États pour le drag & drop
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [startPosText, setStartPosText] = useState({ x: 0, y: 0 });
  const [activeDesignSide, setActiveDesignSide] = useState<'front' | 'back'>('front');
  const [activeTextSide, setActiveTextSide] = useState<'front' | 'back'>('front');
  
  // États pour les loteries - support pour plusieurs loteries
  const [selectedLotteryIds, setSelectedLotteryIds] = useState<string[]>([]);
  const [selectedLotteries, setSelectedLotteries] = useState<Lottery[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    color?: string;
    size?: string;
    lottery?: string;
  }>({});

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
  
  // Effet pour initialiser la couleur du mockup par défaut
  useEffect(() => {
    if (mockup?.colors && mockup.colors.length > 0) {
      setSelectedMockupColor(mockup.colors[0]);
    }
  }, [mockup]);

  // Verrouiller le défilement de la page pendant la personnalisation
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

  // Removed automatic lottery selection useEffect to make it optional

  // Helper functions for accessing the current design based on the active side
  const getCurrentDesign = () => {
    return currentViewSide === 'front' ? selectedDesignFront : selectedDesignBack;
  };

  const getCurrentDesignTransform = () => {
    return currentViewSide === 'front' ? designTransformFront : designTransformBack;
  };

  // Helper functions for accessing the current text content based on the active side
  const getCurrentTextContent = () => {
    return currentViewSide === 'front' ? textContentFront : textContentBack;
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

  const getCurrentTextTransform = () => {
    return currentViewSide === 'front' ? textTransformFront : textTransformBack;
  };

  // Handle design transformation changes
  const handleDesignTransformChange = (property: 'scale' | 'rotation', value: number) => {
    if (currentViewSide === 'front') {
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

  // Handle text transformation changes
  const handleTextTransformChange = (property: 'scale' | 'rotation', value: number) => {
    if (currentViewSide === 'front') {
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

  // Handle mouse/touch interactions for dragging designs and text
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, isText: boolean = false) => {
    e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    if (isText) {
      setIsDraggingText(true);
      setStartPosText({ x: clientX, y: clientY });
      setActiveTextSide(currentViewSide);
      
      const handleTextMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
        if (isDraggingText) {
          const moveClientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
          const moveClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
          
          const deltaX = moveClientX - startPosText.x;
          const deltaY = moveClientY - startPosText.y;
          
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
          
          setStartPosText({ x: moveClientX, y: moveClientY });
        }
      };
      
      const handleTextMouseUp = () => {
        setIsDraggingText(false);
        document.removeEventListener('mousemove', handleTextMouseMove);
        document.removeEventListener('touchmove', handleTextMouseMove);
        document.removeEventListener('mouseup', handleTextMouseUp);
        document.removeEventListener('touchend', handleTextMouseUp);
      };
      
      document.addEventListener('mousemove', handleTextMouseMove);
      document.addEventListener('touchmove', handleTextMouseMove);
      document.addEventListener('mouseup', handleTextMouseUp);
      document.addEventListener('touchend', handleTextMouseUp);
    } else {
      setIsDragging(true);
      setStartPos({ x: clientX, y: clientY });
      setActiveDesignSide(currentViewSide);
      
      const handleDesignMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
        if (isDragging) {
          const moveClientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
          const moveClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
          
          const deltaX = moveClientX - startPos.x;
          const deltaY = moveClientY - startPos.y;
          
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
          
          setStartPos({ x: moveClientX, y: moveClientY });
        }
      };
      
      const handleDesignMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleDesignMouseMove);
        document.removeEventListener('touchmove', handleDesignMouseMove);
        document.removeEventListener('mouseup', handleDesignMouseUp);
        document.removeEventListener('touchend', handleDesignMouseUp);
      };
      
      document.addEventListener('mousemove', handleDesignMouseMove);
      document.addEventListener('touchmove', handleDesignMouseMove);
      document.addEventListener('mouseup', handleDesignMouseUp);
      document.addEventListener('touchend', handleDesignMouseUp);
    }
  };

  // Handle file upload for custom designs
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const uploadedDesign: Design = {
        id: `custom-${Date.now()}`,
        name: file.name,
        image_url: e.target?.result as string,
        category: 'custom'
      };
      
      if (currentViewSide === 'front') {
        setSelectedDesignFront(uploadedDesign);
      } else {
        setSelectedDesignBack(uploadedDesign);
      }
    };
    
    reader.readAsDataURL(file);
  };

  // Handle lottery selection
  const handleLotteryToggle = (lottery: Lottery, index: number) => {
    // Create a copy of the current selectedLotteries array
    const updatedLotteries = [...selectedLotteries];
    const updatedLotteryIds = [...selectedLotteryIds];
    
    // Check if this lottery is already selected
    const existingIndex = updatedLotteryIds.indexOf(lottery.id);
    
    if (existingIndex !== -1) {
      // Lottery is already selected, remove it
      updatedLotteryIds.splice(existingIndex, 1);
      updatedLotteries.splice(existingIndex, 1);
    } else {
      // Lottery is not selected, add it at the specified index
      if (index < updatedLotteries.length) {
        // Replace lottery at the specific index
        updatedLotteryIds[index] = lottery.id;
        updatedLotteries[index] = lottery;
      } else {
        // Add to the end if index is out of bounds
        updatedLotteryIds.push(lottery.id);
        updatedLotteries.push(lottery);
      }
    }
    
    setSelectedLotteryIds(updatedLotteryIds);
    setSelectedLotteries(updatedLotteries);
  };

  const validateSelection = () => {
    const errors: { color?: string; size?: string; lottery?: string } = {};
    let isValid = true;

    // Validate color selection if product has colors
    if (product?.available_colors && product.available_colors.length > 0 && !selectedColor) {
      errors.color = "Veuillez sélectionner une couleur";
      isValid = false;
    }

    // Validate size selection if product has sizes
    if (product?.available_sizes && product.available_sizes.length > 0 && !selectedSize) {
      errors.size = "Veuillez sélectionner une taille";
      isValid = false;
    }

    // Validate lottery selection if product offers tickets and none are selected
    if (product?.tickets_offered && product.tickets_offered > 0 && selectedLotteryIds.length === 0) {
      errors.lottery = "Veuillez sélectionner une loterie";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

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

    // Validate required selections
    if (!validateSelection()) {
      // Show toast for validation errors
      const errorMessages = Object.values(validationErrors).filter(Boolean);
      if (errorMessages.length > 0) {
        toast.error(errorMessages[0]);
      }
      return;
    }

    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: calculatePrice(),
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      image_url: product.image_url,
      cartItemId: `cart-item-${Date.now()}`
    };

    // Add lotteries if selected
    if (selectedLotteryIds.length > 0) {
      cartItem.lotteries = selectedLotteryIds;
    }

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

    // Use Cart Context to add the item to cart
    addItem(cartItem);
    
    toast.success('Produit ajouté au panier !');
  };
  
  // Fonction pour obtenir l'image à afficher en fonction du mode et de la couleur sélectionnée
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

  // Prévenir le défilement de la page pendant la personnalisation sur mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging || isDraggingText) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products" className="flex items-center text-sm text-winshirt-purple hover:text-winshirt-blue transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux produits
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image et visualisation du produit */}
          <div className="relative">
            <div 
              ref={productCanvasRef}
              className="relative bg-black/30 rounded-lg overflow-hidden shadow-xl aspect-square flex justify-center items-center"
              style={{ touchAction: 'none' }}
              onTouchMove={handleTouchMove}
            >
              <img 
                src={getProductImage()} 
                alt={product.name}
                className="w-full h-full object-contain"
              />

              {/* Design superposé - maintenant séparé par côté */}
              {customizationMode && getCurrentDesign() && (
                <div 
                  className="absolute cursor-move select-none"
                  style={{ 
                    transform: `translate(${getCurrentDesignTransform().position.x}px, ${getCurrentDesignTransform().position.y}px) 
                               rotate(${getCurrentDesignTransform().rotation}deg) 
                               scale(${getCurrentDesignTransform().scale})`,
                    transformOrigin: 'center',
                    zIndex: 10
                  }}
                  onMouseDown={(e) => handleMouseDown(e)}
                  onTouchStart={(e) => handleMouseDown(e)}
                >
                  <img 
                    src={getCurrentDesign()!.image_url} 
                    alt={getCurrentDesign()!.name}
                    className="max-w-[200px] max-h-[200px] w-auto h-auto"
                    draggable={false}
                  />
                </div>
              )}
              
              {/* Texte superposé - maintenant séparé par côté */}
              {customizationMode && getCurrentTextContent() && (
                <div 
                  className="absolute cursor-move select-none"
                  style={{ 
                    transform: `translate(${getCurrentTextTransform().position.x}px, ${getCurrentTextTransform().position.y}px) 
                               rotate(${getCurrentTextTransform().rotation}deg) 
                               scale(${getCurrentTextTransform().scale})`,
                    transformOrigin: 'center',
                    fontFamily: getCurrentTextFont(),
                    color: getCurrentTextColor(),
                    fontWeight: getCurrentTextStyles().bold ? 'bold' : 'normal',
                    fontStyle: getCurrentTextStyles().italic ? 'italic' : 'normal',
                    textDecoration: getCurrentTextStyles().underline ? 'underline' : 'none',
                    fontSize: '24px',
                    textShadow: '0px 0px 3px rgba(0,0,0,0.5)',
                    zIndex: 20
                  }}
                  onMouseDown={(e) => handleMouseDown(e, true)}
                  onTouchStart={(e) => handleMouseDown(e, true)}
                >
                  {getCurrentTextContent()}
                </div>
              )}
            </div>

            {/* Boutons pour basculer entre le recto et le verso déplacés en dessous de l'image */}
            {customizationMode && mockup && mockup.svg_back_url && (
              <div className="flex justify-center mt-4">
                <ToggleGroup 
                  type="single" 
                  value={currentViewSide}
                  onValueChange={(value) => value && setCurrentViewSide(value as 'front' | 'back')}
                  className="bg-black/40 backdrop-blur-sm rounded-lg"
                >
                  <ToggleGroupItem 
                    value="front" 
                    className="text-sm data-[state=on]:bg-winshirt-purple/70"
                    aria-label="Voir le recto"
                  >
                    Avant
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="back" 
                    className="text-sm data-[state=on]:bg-winshirt-purple/70"
                    aria-label="Voir le verso"
                  >
                    Arrière
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}
          </div>

          {/* Informations du produit et options */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue text-white">
                {product.category}
              </Badge>
              
              {product.is_customizable && (
                <Badge variant="outline" className="bg-white/5">
                  Personnalisable
                </Badge>
              )}
            </div>
            
            <p className="text-white/70 mb-6">{product.description}</p>
            
            <div className="text-2xl font-bold mb-6">
              {calculatePrice().toFixed(2)} €
            </div>

            {/* Options du produit */}
            <div className="space-y-6">
              {/* Couleurs disponibles */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">
                    Couleur {validationErrors.color && <span className="text-red-500 text-xs ml-1">*</span>}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_colors.map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                          selectedColor === color ? 'border-winshirt-purple' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: getColorHexCode(color) }}
                        onClick={() => {
                          setSelectedColor(color);
                          setValidationErrors({...validationErrors, color: undefined});
                        }}
                      />
                    ))}
                  </div>
                  {validationErrors.color && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.color}</p>
                  )}
                </div>
              )}

              {/* Tailles disponibles */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">
                    Taille {validationErrors.size && <span className="text-red-500 text-xs ml-1">*</span>}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map((size) => (
                      <div
                        key={size}
                        className={`px-3 py-1 rounded cursor-pointer ${
                          selectedSize === size
                            ? 'bg-winshirt-purple text-white'
                            : 'bg-black/20 hover:bg-black/30'
                        }`}
                        onClick={() => {
                          setSelectedSize(size);
                          setValidationErrors({...validationErrors, size: undefined});
                        }}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                  {validationErrors.size && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.size}</p>
                  )}
                </div>
              )}

              {/* Personnalisation accordéon */}
              {product.is_customizable && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="customization" className="border-b-0">
                    <AccordionTrigger 
                      className="py-3 px-4 bg-gradient-to-r from-winshirt-purple/30 to-winshirt-blue/30 rounded-lg hover:no-underline" 
                      onClick={() => setCustomizationMode(prevState => !prevState)}
                    >
                      <span className="flex items-center">
                        <PenTool className="mr-2 h-4 w-4" />
                        <span>{customizationMode ? "Masquer" : "Commencer à"} la personnalisation</span>
                      </span>
                    </AccordionTrigger>
                    
                    <AccordionContent className="pt-4">
                      {mockup?.colors && mockup.colors.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium mb-3">Couleur du produit</h3>
                          <div className="flex flex-wrap gap-3">
                            {mockup.colors.map((color, index) => (
                              <div
                                key={index}
                                className={`relative flex flex-col items-center gap-1 cursor-pointer`}
                                onClick={() => setSelectedMockupColor(color)}
                              >
                                <div 
                                  className={`w-10 h-10 rounded-full border-2 ${
                                    selectedMockupColor === color ? 'border-winshirt-purple' : 'border-gray-600'
                                  }`} 
                                  style={{ backgroundColor: color.color_code }}
                                >
                                  {selectedMockupColor === color && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Check className="text-white h-4 w-4 drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs truncate max-w-[80px] text-center">{color.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Tabs defaultValue="design" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                          <TabsTrigger value="design">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Design
                          </TabsTrigger>
                          <TabsTrigger value="text">
                            <Type className="h-4 w-4 mr-2" />
                            Texte
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="design" className="space-y-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium">Ajouter un design</h4>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setDesignDialogOpen(true)}
                              >
                                {currentViewSide === 'front' ? 
                                  (selectedDesignFront ? 'Changer' : 'Sélectionner') : 
                                  (selectedDesignBack ? 'Changer' : 'Sélectionner')
                                }
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Importer
                              </Button>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                              />
                            </div>
                          </div>
                          
                          {/* Paramètres de design après sélection */}
                          {getCurrentDesign() && (
                            <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                              <div>
                                <Label className="mb-2 block">Taille d'impression</Label>
                                <div className="flex gap-2">
                                  {['A3', 'A4', 'A5', 'A6'].map((size) => (
                                    <Button
                                      key={size}
                                      variant="outline"
                                      size="sm"
                                      className={`${
                                        (currentViewSide === 'front' ? printSizeFront : printSizeBack) === size
                                          ? 'bg-winshirt-purple'
                                          : ''
                                      }`}
                                      onClick={() => {
                                        if (currentViewSide === 'front') {
                                          setPrintSizeFront(size);
                                        } else {
                                          setPrintSizeBack(size);
                                        }
                                      }}
                                    >
                                      {size}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Échelle ({Math.round(getCurrentDesignTransform().scale * 100)}%)</Label>
                                <Slider
                                  value={[getCurrentDesignTransform().scale * 100]}
                                  min={50}
                                  max={200}
                                  step={5}
                                  onValueChange={(value) =>
                                    handleDesignTransformChange('scale', value[0] / 100)
                                  }
                                  className="flex-1"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Rotation ({getCurrentDesignTransform().rotation}°)</Label>
                                <div className="flex gap-2 items-center">
                                  <Slider
                                    value={[getCurrentDesignTransform().rotation + 180]}
                                    min={0}
                                    max={360}
                                    step={5}
                                    onValueChange={(value) =>
                                      handleDesignTransformChange('rotation', value[0] - 180)
                                    }
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      handleDesignTransformChange('rotation', 0)
                                    }
                                  >
                                    <RotateCw className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="text" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="textContent">Texte</Label>
                            <Input
                              id="textContent"
                              value={getCurrentTextContent()}
                              onChange={(e) => {
                                if (currentViewSide === 'front') {
                                  setTextContentFront(e.target.value);
                                } else {
                                  setTextContentBack(e.target.value);
                                }
                              }}
                              placeholder="Entrez votre texte ici..."
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="textFont">Police</Label>
                            <Select
                              value={getCurrentTextFont()}
                              onValueChange={(value) => {
                                if (currentViewSide === 'front') {
                                  setTextFontFront(value);
                                } else {
                                  setTextFontBack(value);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choisir une police" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                <SelectGroup>
                                  {googleFonts.map((font) => (
                                    <SelectItem key={font.value} value={font.value}>
                                      {font.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Style de texte</Label>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className={
                                  getCurrentTextStyles().bold
                                    ? 'bg-winshirt-purple/40'
                                    : ''
                                }
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextStylesFront({
                                      ...textStylesFront,
                                      bold: !textStylesFront.bold,
                                    });
                                  } else {
                                    setTextStylesBack({
                                      ...textStylesBack,
                                      bold: !textStylesBack.bold,
                                    });
                                  }
                                }}
                              >
                                <Bold className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className={
                                  getCurrentTextStyles().italic
                                    ? 'bg-winshirt-purple/40'
                                    : ''
                                }
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextStylesFront({
                                      ...textStylesFront,
                                      italic: !textStylesFront.italic,
                                    });
                                  } else {
                                    setTextStylesBack({
                                      ...textStylesBack,
                                      italic: !textStylesBack.italic,
                                    });
                                  }
                                }}
                              >
                                <Italic className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className={
                                  getCurrentTextStyles().underline
                                    ? 'bg-winshirt-purple/40'
                                    : ''
                                }
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextStylesFront({
                                      ...textStylesFront,
                                      underline: !textStylesFront.underline,
                                    });
                                  } else {
                                    setTextStylesBack({
                                      ...textStylesBack,
                                      underline: !textStylesBack.underline,
                                    });
                                  }
                                }}
                              >
                                <Underline className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label>Couleur</Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextShowColorPickerFront(!textShowColorPickerFront);
                                    setTextShowColorPickerBack(false);
                                  } else {
                                    setTextShowColorPickerBack(!textShowColorPickerBack);
                                    setTextShowColorPickerFront(false);
                                  }
                                }}
                              >
                                <div
                                  className="w-4 h-4 mr-2 rounded"
                                  style={{ backgroundColor: getCurrentTextColor() }}
                                ></div>
                                {currentViewSide === 'front' ? 
                                  (textShowColorPickerFront ? 'Fermer' : 'Choisir') : 
                                  (textShowColorPickerBack ? 'Fermer' : 'Choisir')
                                }
                              </Button>
                            </div>
                            
                            {((currentViewSide === 'front' && textShowColorPickerFront) ||
                              (currentViewSide === 'back' && textShowColorPickerBack)) && (
                              <div className="mt-2">
                                <HexColorPicker
                                  color={getCurrentTextColor()}
                                  onChange={(color) => {
                                    if (currentViewSide === 'front') {
                                      setTextColorFront(color);
                                    } else {
                                      setTextColorBack(color);
                                    }
                                  }}
                                  className="w-full"
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Échelle ({Math.round(getCurrentTextTransform().scale * 100)}%)</Label>
                            <Slider
                              value={[getCurrentTextTransform().scale * 100]}
                              min={50}
                              max={200}
                              step={5}
                              onValueChange={(value) =>
                                handleTextTransformChange('scale', value[0] / 100)
                              }
                              className="flex-1"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Rotation ({getCurrentTextTransform().rotation}°)</Label>
                            <div className="flex gap-2 items-center">
                              <Slider
                                value={[getCurrentTextTransform().rotation + 180]}
                                min={0}
                                max={360}
                                step={5}
                                onValueChange={(value) =>
                                  handleTextTransformChange('rotation', value[0] - 180)
                                }
                                className="flex-1"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleTextTransformChange('rotation', 0)
                                }
                              >
                                <RotateCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {/* Dialog pour sélection de design */}
              <Dialog open={designDialogOpen} onOpenChange={setDesignDialogOpen}>
                <DialogContent className="bg-black/70 backdrop-blur-lg border-white/20 max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Sélectionner un design</DialogTitle>
                  </DialogHeader>
                  
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {uniqueCategories.map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          size="sm"
                          className={selectedCategoryFilter === category ? "bg-winshirt-purple" : ""}
                          onClick={() => setSelectedCategoryFilter(category)}
                        >
                          {category === 'all' ? 'Tous' : category}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {filteredDesigns.map((design) => (
                        <Card
                          key={design.id}
                          className="bg-black/40 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border-white/10 hover:border-winshirt-purple/30"
                          onClick={() => handleDesignSelect(design)}
                        >
                          <div className="aspect-square overflow-hidden bg-gray-900/40">
                            <img
                              src={design.image_url}
                              alt={design.name}
                              className="object-contain w-full h-full p-2"
                            />
                          </div>
                          <div className="p-2">
                            <p className="text-xs truncate">{design.name}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    {filteredDesigns.length === 0 && (
                      <div className="text-center py-8 text-white/50">
                        {isLoadingDesigns ? "Chargement..." : "Aucun design trouvé dans cette catégorie."}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Loteries disponibles */}
              {product.tickets_offered > 0 && activeLotteries.length > 0 && (
                <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <h3 className="flex items-center text-lg font-medium">
                    <UsersRound className="h-5 w-5 mr-2 text-winshirt-purple" />
                    Participez à {product.tickets_offered} {product.tickets_offered > 1 ? 'loteries' : 'loterie'}
                    {validationErrors.lottery && <span className="text-red-500 text-xs ml-1">*</span>}
                  </h3>
                  
                  <p className="text-sm text-white/70">
                    Ce produit vous permet de participer à {product.tickets_offered} {product.tickets_offered > 1 ? 'loteries' : 'loterie'}.
                    Sélectionnez {product.tickets_offered > 1 ? 'celles qui vous intéressent' : 'celle qui vous intéresse'}.
                  </p>
                  
                  {validationErrors.lottery && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.lottery}</p>
                  )}
                  
                  <div className="space-y-3">
                    {Array.from({ length: product.tickets_offered }).map((_, index) => (
                      <div key={index} className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              {selectedLotteries[index] ? (
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <Target className="h-4 w-4 mr-2 text-winshirt-purple" />
                                    <span>{selectedLotteries[index].title}</span>
                                  </div>
                                  <Badge variant="secondary" className="ml-2">
                                    {new Intl.NumberFormat('fr-FR', {
                                      style: 'currency',
                                      currency: 'EUR',
                                      maximumFractionDigits: 0
                                    }).format(selectedLotteries[index].value)}
                                  </Badge>
                                </div>
                              ) : (
                                <>
                                  <Target className="h-4 w-4 mr-2 text-winshirt-purple" />
                                  <span>Choisir une loterie</span>
                                </>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[280px]">
                            <DropdownMenuLabel>Loteries disponibles</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-[200px] overflow-y-auto">
                              {activeLotteries.map((lottery) => {
                                const isSelected = selectedLotteryIds.includes(lottery.id);
                                return (
                                  <DropdownMenuItem
                                    key={lottery.id}
                                    className={`flex justify-between cursor-pointer ${isSelected ? 'bg-winshirt-purple/20' : ''}`}
                                    onClick={() => {
                                      handleLotteryToggle(lottery, index);
                                      setValidationErrors({...validationErrors, lottery: undefined});
                                    }}
                                  >
                                    <span>{lottery.title}</span>
                                    {isSelected && <Check className="h-4 w-4" />}
                                  </DropdownMenuItem>
                                );
                              })}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantité et ajout au panier */}
              <div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center rounded-md overflow-hidden">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="rounded-r-none"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-12 py-2 text-center bg-white/5 border-y border-input">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange('increase')}
                      className="rounded-l-none"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;

