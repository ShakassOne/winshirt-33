import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ShoppingCart, Check, ArrowLeft, Minus, Plus, PenTool, Sparkles, UsersRound, Target } from 'lucide-react';
import { fetchProductById, fetchAllLotteries, fetchAllDesigns, fetchMockupById } from '@/services/api.service';
import { Design, Lottery, CartItem } from '@/types/supabase.types';
import { MockupColor } from '@/types/mockup.types';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { useCart } from '@/context/CartContext';
import AIImageGenerator from '@/components/product/AIImageGenerator';
import { RemoveFlatBackground } from '@/components/product/RemoveFlatBackground';
import { supabase } from '@/integrations/supabase/client';
import { SocialShareButton } from '@/components/SocialShareButton';
import { SVGColorEditor } from '@/components/product/SVGColorEditor';
import { ModalPersonnalisation } from '@/components/product/ModalPersonnalisation';
import { HDVisualCapture } from '@/components/product/HDVisualCapture';
import { useHDCaptureOnAddToCart } from '@/hooks/useHDCaptureOnAddToCart';
import { enrichCustomizationWithCaptures } from '@/services/unifiedCapture.service';
import { CaptureElements } from '@/components/product/CaptureElements';

// Définition des polices Google Fonts
const googleFonts = [{
  value: 'Roboto',
  label: 'Roboto'
}, {
  value: 'Open Sans',
  label: 'Open Sans'
}, {
  value: 'Lato',
  label: 'Lato'
}, {
  value: 'Montserrat',
  label: 'Montserrat'
}, {
  value: 'Playfair Display',
  label: 'Playfair Display'
}, {
  value: 'Raleway',
  label: 'Raleway'
}, {
  value: 'Nunito',
  label: 'Nunito'
}, {
  value: 'Oswald',
  label: 'Oswald'
}, {
  value: 'Source Sans Pro',
  label: 'Source Sans Pro'
}, {
  value: 'PT Sans',
  label: 'PT Sans'
}, {
  value: 'Poppins',
  label: 'Poppins'
}, {
  value: 'Ubuntu',
  label: 'Ubuntu'
}, {
  value: 'Merriweather',
  label: 'Merriweather'
}, {
  value: 'Noto Sans',
  label: 'Noto Sans'
}, {
  value: 'Fira Sans',
  label: 'Fira Sans'
}, {
  value: 'Quicksand',
  label: 'Quicksand'
}, {
  value: 'Dancing Script',
  label: 'Dancing Script'
}, {
  value: 'Pacifico',
  label: 'Pacifico'
}, {
  value: 'Shadows Into Light',
  label: 'Shadows Into Light'
}, {
  value: 'Lobster',
  label: 'Lobster'
}, {
  value: 'Caveat',
  label: 'Caveat'
}, {
  value: 'Comfortaa',
  label: 'Comfortaa'
}, {
  value: 'Indie Flower',
  label: 'Indie Flower'
}, {
  value: 'Sacramento',
  label: 'Sacramento'
}, {
  value: 'Architects Daughter',
  label: 'Architects Daughter'
}, {
  value: 'Permanent Marker',
  label: 'Permanent Marker'
}, {
  value: 'Satisfy',
  label: 'Satisfy'
}, {
  value: 'Amatic SC',
  label: 'Amatic SC'
}, {
  value: 'Pathway Gothic One',
  label: 'Pathway Gothic One'
}, {
  value: 'Abel',
  label: 'Abel'
}, {
  value: 'Barlow',
  label: 'Barlow'
}, {
  value: 'Cabin',
  label: 'Cabin'
}, {
  value: 'Crimson Text',
  label: 'Crimson Text'
}, {
  value: 'Exo 2',
  label: 'Exo 2'
}, {
  value: 'Fjalla One',
  label: 'Fjalla One'
}, {
  value: 'Josefin Sans',
  label: 'Josefin Sans'
}, {
  value: 'Karla',
  label: 'Karla'
}, {
  value: 'Libre Baskerville',
  label: 'Libre Baskerville'
}, {
  value: 'Muli',
  label: 'Muli'
}, {
  value: 'Noto Serif',
  label: 'Noto Serif'
}, {
  value: 'Oxygen',
  label: 'Oxygen'
}, {
  value: 'Prompt',
  label: 'Prompt'
}, {
  value: 'Rubik',
  label: 'Rubik'
}, {
  value: 'Space Mono',
  label: 'Space Mono'
}, {
  value: 'Work Sans',
  label: 'Work Sans'
}, {
  value: 'Yanone Kaffeesatz',
  label: 'Yanone Kaffeesatz'
}, {
  value: 'Bree Serif',
  label: 'Bree Serif'
}, {
  value: 'Crete Round',
  label: 'Crete Round'
}, {
  value: 'Abril Fatface',
  label: 'Abril Fatface'
}, {
  value: 'Righteous',
  label: 'Righteous'
}, {
  value: 'Philosopher',
  label: 'Philosopher'
}, {
  value: 'Kanit',
  label: 'Kanit'
}, {
  value: 'Russo One',
  label: 'Russo One'
}, {
  value: 'Archivo',
  label: 'Archivo'
}, {
  value: 'Arvo',
  label: 'Arvo'
}, {
  value: 'Bitter',
  label: 'Bitter'
}, {
  value: 'Cairo',
  label: 'Cairo'
}, {
  value: 'Cormorant Garamond',
  label: 'Cormorant Garamond'
}, {
  value: 'Didact Gothic',
  label: 'Didact Gothic'
}, {
  value: 'EB Garamond',
  label: 'EB Garamond'
}, {
  value: 'Fredoka One',
  label: 'Fredoka One'
}, {
  value: 'Gloria Hallelujah',
  label: 'Gloria Hallelujah'
}, {
  value: 'Hind',
  label: 'Hind'
}, {
  value: 'IBM Plex Sans',
  label: 'IBM Plex Sans'
}, {
  value: 'Inter',
  label: 'Inter'
}, {
  value: 'Kalam',
  label: 'Kalam'
}, {
  value: 'Lora',
  label: 'Lora'
}, {
  value: 'Maven Pro',
  label: 'Maven Pro'
}, {
  value: 'Neucha',
  label: 'Neucha'
}, {
  value: 'Overpass',
  label: 'Overpass'
}, {
  value: 'Patrick Hand',
  label: 'Patrick Hand'
}, {
  value: 'Quattrocento Sans',
  label: 'Quattrocento Sans'
}, {
  value: 'Roboto Condensed',
  label: 'Roboto Condensed'
}, {
  value: 'Roboto Mono',
  label: 'Roboto Mono'
}, {
  value: 'Roboto Slab',
  label: 'Roboto Slab'
}, {
  value: 'Signika',
  label: 'Signika'
}, {
  value: 'Teko',
  label: 'Teko'
}, {
  value: 'Ubuntu Condensed',
  label: 'Ubuntu Condensed'
}, {
  value: 'Varela Round',
  label: 'Varela Round'
}, {
  value: 'Acme',
  label: 'Acme'
}, {
  value: 'Alegreya',
  label: 'Alegreya'
}, {
  value: 'Anton',
  label: 'Anton'
}, {
  value: 'Asap',
  label: 'Asap'
}, {
  value: 'Assistant',
  label: 'Assistant'
}, {
  value: 'Baloo 2',
  label: 'Baloo 2'
}, {
  value: 'Bangers',
  label: 'Bangers'
}, {
  value: 'BioRhyme',
  label: 'BioRhyme'
}, {
  value: 'Catamaran',
  label: 'Catamaran'
}, {
  value: 'Coda',
  label: 'Coda'
}, {
  value: 'Courgette',
  label: 'Courgette'
}, {
  value: 'Cousine',
  label: 'Cousine'
}, {
  value: 'DM Sans',
  label: 'DM Sans'
}, {
  value: 'Dosis',
  label: 'Dosis'
}, {
  value: 'Fira Code',
  label: 'Fira Code'
}];

// Correspondances entre formats et échelles
const sizePresets = [{
  label: 'A3',
  min: 81,
  max: 100
}, {
  label: 'A4',
  min: 61,
  max: 80
}, {
  label: 'A5',
  min: 41,
  max: 60
}, {
  label: 'A6',
  min: 21,
  max: 40
}, {
  label: 'A7',
  min: 1,
  max: 20
}];
const ProductDetail = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const isMobile = useIsMobile();
  const {
    addItem
  } = useCart();
  const productCanvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook pour la capture HD
  const {
    captureForProduction,
    isCapturing
  } = useHDCaptureOnAddToCart();

  // États pour la personnalisation et autres
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Modal state
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [customizationMode, setCustomizationMode] = useState(false);
  const [currentViewSide, setCurrentViewSide] = useState<'front' | 'back'>('front');
  const [selectedMockupColor, setSelectedMockupColor] = useState<MockupColor | null>(null);

  // État pour les designs - maintenant séparés par côté (recto/verso)
  const [selectedDesignFront, setSelectedDesignFront] = useState<Design | null>(null);
  const [selectedDesignBack, setSelectedDesignBack] = useState<Design | null>(null);

  // État pour les transformations des designs - séparés par côté
  const [designTransformFront, setDesignTransformFront] = useState({
    position: {
      x: 0,
      y: 0
    },
    scale: 1,
    rotation: 0
  });
  const [designTransformBack, setDesignTransformBack] = useState({
    position: {
      x: 0,
      y: 0
    },
    scale: 1,
    rotation: 0
  });

  // État pour les tailles d'impression - séparées par côté
  const [printSizeFront, setPrintSizeFront] = useState<string>('A4');
  const [printSizeBack, setPrintSizeBack] = useState<string>('A4');

  // Nouveaux états pour la synchronisation échelle ↔ formats
  const [selectedSizeFront, setSelectedSizeFront] = useState<string>('A4');
  const [selectedSizeBack, setSelectedSizeBack] = useState<string>('A4');

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
    position: {
      x: 0,
      y: 0
    },
    scale: 1,
    rotation: 0
  });
  const [textTransformBack, setTextTransformBack] = useState({
    position: {
      x: 0,
      y: 0
    },
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
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({
    x: 0,
    y: 0
  });
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [startPosText, setStartPosText] = useState({
    x: 0,
    y: 0
  });
  const [activeDesignSide, setActiveDesignSide] = useState<'front' | 'back'>('front');
  const [activeTextSide, setActiveTextSide] = useState<'front' | 'back'>('front');
  // États pour les loteries - maintenant un tableau simple permettant les doublons
  const [selectedLotteries, setSelectedLotteries] = useState<(Lottery | null)[]>([]);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [backgroundRemovalImage, setBackgroundRemovalImage] = useState<string | null>(null);

  // Missing state variables
  const [pageScrollLocked, setPageScrollLocked] = useState(false);

  // Nouveaux états pour la gestion SVG - séparés par côté
  const [svgColorFront, setSvgColorFront] = useState('#000000');
  const [svgColorBack, setSvgColorBack] = useState('#000000');
  const [svgContentFront, setSvgContentFront] = useState('');
  const [svgContentBack, setSvgContentBack] = useState('');

  // Unified customization data for capture elements
  const unifiedCustomization = useMemo(() => {
    const frontDesign = selectedDesignFront
      ? {
          designId: selectedDesignFront.id,
          designUrl: selectedDesignFront.image_url,
          designName: selectedDesignFront.name,
          printSize: selectedSizeFront || 'A4',
          transform: designTransformFront,
        }
      : null;

    const backDesign = selectedDesignBack
      ? {
          designId: selectedDesignBack.id,
          designUrl: selectedDesignBack.image_url,
          designName: selectedDesignBack.name,
          printSize: selectedSizeBack || 'A4',
          transform: designTransformBack,
        }
      : null;

    const frontText = textContentFront
      ? {
          content: textContentFront,
          font: textFontFront,
          color: textColorFront,
          styles: textStylesFront,
          transform: textTransformFront,
        }
      : null;

    const backText = textContentBack
      ? {
          content: textContentBack,
          font: textFontBack,
          color: textColorBack,
          styles: textStylesBack,
          transform: textTransformBack,
        }
      : null;

    return {
      frontDesign,
      backDesign,
      frontText,
      backText,
    };
  }, [
    selectedDesignFront,
    selectedDesignBack,
    selectedSizeFront,
    selectedSizeBack,
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
  ]);

  // Fonctions utilitaires pour la synchronisation
  const getSizeLabel = (scale: number): string => {
    const scalePercent = Math.round(scale * 100);
    const preset = sizePresets.find(p => scalePercent >= p.min && scalePercent <= p.max);
    return preset?.label || 'Custom';
  };
  const handleSizeClick = (label: string) => {
    const preset = sizePresets.find(p => p.label === label);
    if (preset) {
      const newScale = (preset.min + preset.max) / 200; // Convertir en échelle (0-1)

      if (currentViewSide === 'front') {
        setDesignTransformFront(prev => ({
          ...prev,
          scale: newScale
        }));
        setSelectedSizeFront(label);
        setPrintSizeFront(label);
      } else {
        setDesignTransformBack(prev => ({
          ...prev,
          scale: newScale
        }));
        setSelectedSizeBack(label);
        setPrintSizeBack(label);
      }
    }
  };
  const handleScaleChange = (value: number[]) => {
    const newScale = value[0] / 100; // Convertir de pourcentage à échelle (0-1)
    const newSizeLabel = getSizeLabel(newScale);
    if (currentViewSide === 'front') {
      setDesignTransformFront(prev => ({
        ...prev,
        scale: newScale
      }));
      setSelectedSizeFront(newSizeLabel);
      setPrintSizeFront(newSizeLabel);
    } else {
      setDesignTransformBack(prev => ({
        ...prev,
        scale: newScale
      }));
      setSelectedSizeBack(newSizeLabel);
      setPrintSizeBack(newSizeLabel);
    }
  };

  // Fonctions utilitaires pour SVG - améliorées
  const getCurrentSvgColor = () => {
    return currentViewSide === 'front' ? svgColorFront : svgColorBack;
  };
  const getCurrentSvgContent = () => {
    return currentViewSide === 'front' ? svgContentFront : svgContentBack;
  };
  const handleSvgColorChange = (color: string) => {
    if (currentViewSide === 'front') {
      setSvgColorFront(color);
    } else {
      setSvgColorBack(color);
    }
  };
  const handleSvgContentChange = (svgContent: string) => {
    if (currentViewSide === 'front') {
      setSvgContentFront(svgContent);
    } else {
      setSvgContentBack(svgContent);
    }
  };
  const isSvgDesign = () => {
    const currentDesign = getCurrentDesign();
    if (!currentDesign?.image_url) return false;

    // Vérification plus robuste des SVG
    const url = currentDesign.image_url.toLowerCase();
    return url.includes('.svg') || url.includes('svg') || currentDesign.image_url.includes('data:image/svg');
  };
  const {
    data: product,
    isLoading
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id
  });
  const {
    data: mockup,
    isLoading: isLoadingMockup
  } = useQuery({
    queryKey: ['mockup', product?.mockup_id],
    queryFn: () => fetchMockupById(product?.mockup_id!),
    enabled: !!product?.mockup_id
  });
  const {
    data: lotteries = [],
    isLoading: isLoadingLotteries
  } = useQuery({
    queryKey: ['lotteries'],
    queryFn: fetchAllLotteries
  });
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
    // Filter mockup colors based on product's available colors
    if (mockup?.colors && product?.available_colors) {
      const filteredColors = mockup.colors.filter(mockupColor => product.available_colors!.some(availableColor => mockupColor.name.toLowerCase() === availableColor.toLowerCase()));
      if (filteredColors.length > 0) {
        setSelectedMockupColor(filteredColors[0]);
      }
    } else if (mockup?.colors && mockup.colors.length > 0) {
      // If no available_colors specified, use all mockup colors
      setSelectedMockupColor(mockup.colors[0]);
    }
  }, [mockup, product]);
  useEffect(() => {
    if (isDragging || isDraggingText || pageScrollLocked && customizationMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pageScrollLocked, isDragging, isDraggingText, customizationMode]);
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
    // Ne pas fermer le modal immédiatement après la sélection d'un design
    // afin de permettre à l'utilisateur de continuer sa personnalisation.
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
  // Fonction pour gérer la sélection/désélection des loteries - nouvelle logique
  const handleLotteryToggle = (lottery: Lottery, slotIndex: number) => {
    setSelectedLotteries(prev => {
      const newSelected = [...prev];

      // S'assurer que le tableau a la bonne taille
      while (newSelected.length < (product?.tickets_offered || 0)) {
        newSelected.push(null);
      }
      if (newSelected[slotIndex]?.id === lottery.id) {
        // Si c'est la même loterie au même slot, la désélectionner
        newSelected[slotIndex] = null;
      } else {
        // Sinon, la sélectionner à ce slot
        newSelected[slotIndex] = lottery;
      }
      return newSelected;
    });
  };
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
      setStartPosText({
        x: clientX,
        y: clientY
      });
    } else {
      setIsDragging(true);
      setStartPos({
        x: clientX,
        y: clientY
      });
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
      setStartPos({
        x: clientX,
        y: clientY
      });
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
      setStartPosText({
        x: clientX,
        y: clientY
      });
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingText(false);
    setPageScrollLocked(false);
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
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove, {
      passive: false
    });
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, startPos, isDraggingText, startPosText]);
  useEffect(() => {
    if (currentViewSide === 'front') {
      setActiveDesignSide('front');
      setActiveTextSide('front');
    } else {
      setActiveDesignSide('back');
      setActiveTextSide('back');
    }
  }, [currentViewSide]);
  const calculatePrice = () => {
    if (!product) return 0;
    let price = product.price * quantity;
    if (customizationMode) {
      const frontDesignPrice = selectedDesignFront ? printSizeFront === 'A3' ? mockup?.price_a3 || 15 : printSizeFront === 'A4' ? mockup?.price_a4 || 10 : printSizeFront === 'A5' ? mockup?.price_a5 || 8 : mockup?.price_a6 || 5 : 0;
      const backDesignPrice = selectedDesignBack ? printSizeBack === 'A3' ? mockup?.price_a3 || 15 : printSizeBack === 'A4' ? mockup?.price_a4 || 10 : printSizeBack === 'A5' ? mockup?.price_a5 || 8 : mockup?.price_a6 || 5 : 0;
      const frontTextPrice = textContentFront ? mockup?.text_price_front || 3 : 0;
      const backTextPrice = textContentBack ? mockup?.text_price_back || 3 : 0;
      price += frontDesignPrice + backDesignPrice + frontTextPrice + backTextPrice;
    }
    return price;
  };
  const getColorHexCode = (colorName: string) => {
    const colorMap: {
      [key: string]: string;
    } = {
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'blue': '#0000ff',
      'gray': '#808080',
      'navy': '#000080'
    };
    return colorName.startsWith('#') ? colorName : colorMap[colorName.toLowerCase()] || '#000000';
  };
  const getProductImage = () => {
    if (!customizationMode) {
      return product?.image_url;
    }
    if (selectedMockupColor) {
      return currentViewSide === 'front' ? selectedMockupColor.front_image_url : selectedMockupColor.back_image_url || product?.image_url;
    } else if (mockup) {
      return currentViewSide === 'front' ? mockup.svg_front_url : mockup.svg_back_url || product?.image_url;
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
  const getCurrentSelectedSize = () => {
    return currentViewSide === 'front' ? selectedSizeFront : selectedSizeBack;
  };

  // Helper function to get filtered mockup colors
  const getFilteredMockupColors = () => {
    if (!mockup?.colors) return [];
    if (!product?.available_colors || product.available_colors.length === 0) {
      return mockup.colors;
    }
    return mockup.colors.filter(mockupColor => product.available_colors!.some(availableColor => mockupColor.name.toLowerCase() === availableColor.toLowerCase()));
  };
  const handleAddToCart = async () => {
    if (!product) return;

    // Créer la liste des IDs de loteries en filtrant les null
    const selectedLotteryIds = selectedLotteries.filter(lottery => lottery !== null).map(lottery => lottery!.id);

    let cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: calculatePrice(),
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      image_url: product.image_url,
      lotteries: selectedLotteryIds.length > 0 ? selectedLotteryIds : undefined
    };

    const customization: any = {};
    // Stocker toujours les loteries sélectionnées dans la personnalisation
    if (selectedLotteryIds.length > 0) {
      customization.lotteries = selectedLotteryIds;
      if (selectedLotteryIds.length === 1) {
        const lot = lotteries.find(l => l.id === selectedLotteryIds[0]);
        if (lot) customization.lotteryName = lot.title;
      }
    }

    if (customizationMode) {
      if (selectedDesignFront) {
        customization.frontDesign = {
          designId: selectedDesignFront.id,
          designName: selectedDesignFront.name,
          designUrl: selectedDesignFront.image_url,
          printSize: printSizeFront,
          transform: designTransformFront,
          // Ajouter les informations SVG si applicable
          ...(selectedDesignFront.image_url?.toLowerCase().endsWith('.svg') && {
            svgColor: svgColorFront,
            svgContent: svgContentFront
          })
        };
      }
      if (selectedDesignBack) {
        customization.backDesign = {
          designId: selectedDesignBack.id,
          designName: selectedDesignBack.name,
          designUrl: selectedDesignBack.image_url,
          printSize: printSizeBack,
          transform: designTransformBack,
          // Ajouter les informations SVG si applicable
          ...(selectedDesignBack.image_url?.toLowerCase().endsWith('.svg') && {
            svgColor: svgColorBack,
            svgContent: svgContentBack
          })
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
      if (Object.keys(customization).length > 0) {
        console.log('🎨 [ProductDetail] Personnalisation détectée, génération des fichiers HD...');

        // Capturer les visuels HD pour la production avec les bons paramètres
        const hdData = await captureForProduction(customization);

        // Enrichir la personnalisation avec les données HD
        const enrichedCustomization = enrichCustomizationWithCaptures(customization, hdData);
        cartItem.customization = enrichedCustomization;
      }
    }

    // Si aucune personnalisation visuelle mais qu'on a des loteries sélectionnées
    if (!customizationMode && Object.keys(customization).length > 0) {
      cartItem.customization = customization;
    }
    addItem(cartItem);
    toast.success('Produit ajouté au panier !');
  };
  if (isLoading || !product) {
    return <div className="min-h-screen flex flex-col">
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
      </div>;
  }
  const activeLotteries = lotteries.filter(lottery => lottery.is_active);
  const filteredMockupColors = getFilteredMockupColors();
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging || isDraggingText) {
      e.preventDefault();
    }
  };
  const handleAIImageGenerated = (imageUrl: string, imageName: string) => {
    const design: Design = {
      id: `ai-${Date.now()}`,
      name: imageName,
      image_url: imageUrl,
      category: 'ai-generated',
      is_active: true
    };
    if (currentViewSide === 'front') {
      setSelectedDesignFront(design);
      setActiveDesignSide('front');
    } else {
      setSelectedDesignBack(design);
      setActiveDesignSide('back');
    }
  };
  const handleRemoveBackground = async () => {
    const currentDesign = getCurrentDesign();
    if (!currentDesign) return;
    setIsRemovingBackground(true);
    setBackgroundRemovalImage(currentDesign.image_url);
  };
  const handleBackgroundRemovalReady = async (cleanedImageUrl: string) => {
    try {
      const response = await fetch(cleanedImageUrl);
      const blob = await response.blob();
      const fileName = `bg-removed-${Date.now()}.png`;
      const {
        data: uploadData,
        error: uploadError
      } = await supabase.storage.from('ai-images').upload(fileName, blob);
      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error("Erreur lors de la sauvegarde de l'image");
        return;
      }
      const {
        data: urlData
      } = supabase.storage.from('ai-images').getPublicUrl(fileName);
      if (!urlData.publicUrl) {
        toast.error("Erreur lors de la récupération de l'URL");
        return;
      }
      const cleanedDesign = {
        ...getCurrentDesign()!,
        id: `cleaned-${Date.now()}`,
        name: `${getCurrentDesign()!.name} (sans fond)`,
        image_url: urlData.publicUrl,
        category: 'ai-generated-cleaned'
      };
      if (currentViewSide === 'front') {
        setSelectedDesignFront(cleanedDesign);
      } else {
        setSelectedDesignBack(cleanedDesign);
      }
      toast.success('Fond supprimé avec succès !');
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Erreur lors de la suppression du fond');
    } finally {
      setIsRemovingBackground(false);
      setBackgroundRemovalImage(null);
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-[10px] py-[105px]">
        <div className="mb-6">
          <Link to="/products" className="flex items-center text-sm text-winshirt-purple hover:text-winshirt-blue transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux produits
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product image - Simplified when not in customization mode */}
          <div className="relative">
            {!customizationMode ? <div className="relative bg-black/30 rounded-lg overflow-hidden shadow-xl aspect-square flex justify-center items-center">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
              </div> : <div className="relative bg-black/30 rounded-lg overflow-hidden shadow-xl aspect-square flex justify-center items-center" style={{
            touchAction: 'none'
          }} onTouchMove={handleTouchMove}>
                <img src={getProductImage()} alt={product.name} className="w-full h-full object-contain" />

                {/* Conteneur pour la capture HD - visible absolument positionné avec un ID spécifique */}
                <HDVisualCapture side={currentViewSide === 'front' ? 'recto' : 'verso'} className="w-full h-full">
                  {/* Design element */}
                  {getCurrentDesign() && <div className="absolute cursor-move select-none" style={{
                transform: `translate(${getCurrentDesignTransform().position.x}px, ${getCurrentDesignTransform().position.y}px) 
                                       rotate(${getCurrentDesignTransform().rotation}deg) 
                                       scale(${getCurrentDesignTransform().scale})`,
                transformOrigin: 'center',
                zIndex: 10,
                left: '50%',
                top: '50%',
                marginLeft: '-100px',
                marginTop: '-100px'
              }} onMouseDown={e => handleMouseDown(e)} onTouchStart={e => handleMouseDown(e)}>
                      {isSvgDesign() && getCurrentSvgContent() ? <div className="w-[200px] h-[200px] flex items-center justify-center" dangerouslySetInnerHTML={{
                  __html: getCurrentSvgContent().replace(/<svg([^>]*)>/i, '<svg$1 width="100%" height="100%" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">')
                }} style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  overflow: 'visible'
                }} /> : <img src={getCurrentDesign()!.image_url} alt={getCurrentDesign()!.name} className="max-w-[200px] max-h-[200px] w-auto h-auto" draggable={false} />}
                    </div>}
                  
                  {/* Text element */}
                  {getCurrentTextContent() && <div className="absolute cursor-move select-none" style={{
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
                zIndex: 20,
                left: '50%',
                top: '50%',
                marginLeft: '-50px',
                marginTop: '-12px'
              }} onMouseDown={e => handleMouseDown(e, true)} onTouchStart={e => handleMouseDown(e, true)}>
                      {getCurrentTextContent()}
                    </div>}
                </HDVisualCapture>

                {getCurrentDesign() && (getCurrentDesign()!.category === 'ai-generated' || getCurrentDesign()!.category === 'ai-generated-cleaned') && <div className="absolute bottom-4 right-4 z-30">
                    <Button size="sm" variant="secondary" onClick={handleRemoveBackground} disabled={isRemovingBackground} className="bg-black/60 hover:bg-black/80 text-white border-white/20" title="Supprimer le fond de l'image">
                      {isRemovingBackground ? <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Traitement...
                        </> : <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Supprimer fond
                        </>}
                    </Button>
                  </div>}
              </div>}

            {backgroundRemovalImage && <div style={{
            display: 'none'
          }}>
                <RemoveFlatBackground imageUrl={backgroundRemovalImage} tolerance={35} onReady={handleBackgroundRemovalReady} />
              </div>}

            {customizationMode && mockup && mockup.svg_back_url && <div className="flex justify-center mt-4">
                <ToggleGroup type="single" value={currentViewSide} onValueChange={value => value && setCurrentViewSide(value as 'front' | 'back')} className="bg-black/40 backdrop-blur-sm rounded-lg">
                  <ToggleGroupItem value="front" className="text-sm data-[state=on]:bg-winshirt-purple/70" aria-label="Voir le recto">
                    Avant
                  </ToggleGroupItem>
                  <ToggleGroupItem value="back" className="text-sm data-[state=on]:bg-winshirt-purple/70" aria-label="Voir le verso">
                    Arrière
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>}
          </div>

          {/* Product info and options */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <SocialShareButton url={window.location.href} title={product.name} description={product.description || "Découvrez ce produit personnalisable"} className="ml-4" />
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue text-white">
                {product.category}
              </Badge>
              
              {product.is_customizable && <Badge variant="outline" className="bg-white/5">
                  Personnalisable
                </Badge>}
            </div>
            
            <p className="text-white/70 mb-6">{product.description}</p>
            
            <div className="text-2xl font-bold mb-6">
              {calculatePrice().toFixed(2)} €
            </div>

            <div className="space-y-6">
              {product.available_sizes && product.available_sizes.length > 0 && <div>
                  <h3 className="text-sm font-medium mb-3">Taille</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map(size => <div key={size} className={`px-3 py-1 rounded cursor-pointer ${selectedSize === size ? 'bg-winshirt-purple text-white' : 'bg-black/20 hover:bg-black/30'}`} onClick={() => setSelectedSize(size)}>
                        {size}
                      </div>)}
                  </div>
                </div>}

              {/* New customization button */}
              {product.is_customizable && <div className="space-y-4">
                  {filteredMockupColors.length > 0 && <div>
                      <h3 className="text-sm font-medium mb-3">Couleur du produit</h3>
                      <div className="flex flex-wrap gap-3">
                        {filteredMockupColors.map((color, index) => <div key={index} className={`relative flex flex-col items-center gap-1 cursor-pointer`} onClick={() => setSelectedMockupColor(color)}>
                            <div className={`w-10 h-10 rounded-full border-2 ${selectedMockupColor === color ? 'border-winshirt-purple' : 'border-gray-600'}`} style={{
                      backgroundColor: color.color_code
                    }}>
                              {selectedMockupColor === color && <div className="absolute inset-0 flex items-center justify-center">
                                  <Check className="text-white h-4 w-4 drop-shadow-[0_0,2px_rgba(0,0,0,0.5)]" />
                                </div>}
                            </div>
                            <span className="text-xs truncate max-w-[80px] text-center">{color.name}</span>
                          </div>)}
                      </div>
                    </div>}

                  <div className="p-4 bg-gradient-to-r from-winshirt-purple/20 to-winshirt-blue/20 rounded-lg border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-lg">🎨 Personnalisation</h3>
                        <p className="text-sm text-white/70">Ajoutez vos designs et textes personnalisés</p>
                      </div>
                      <PenTool className="h-6 w-6 text-winshirt-purple" />
                    </div>
                    <Button onClick={() => {
                  setCustomizationMode(true);
                  setCustomizationModalOpen(true);
                }} className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90" size="lg">
                      <PenTool className="h-5 w-5 mr-2" />
                      Commencer la personnalisation
                    </Button>
                  </div>
                </div>}

              {product.tickets_offered > 0 && activeLotteries.length > 0 && <div className="space-y-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <h3 className="flex items-center text-lg font-medium">
                    <UsersRound className="h-5 w-5 mr-2 text-winshirt-purple" />
                    Participez à {product.tickets_offered} {product.tickets_offered > 1 ? 'loteries' : 'loterie'}
                  </h3>
                  
                  <p className="text-sm text-white/70">
                    Ce produit vous permet de participer à {product.tickets_offered} {product.tickets_offered > 1 ? 'loteries' : 'loterie'}.
                    Vous pouvez sélectionner la même loterie plusieurs fois si vous le souhaitez.
                  </p>
                  
                  <div className="space-y-3">
                    {Array.from({
                  length: product.tickets_offered
                }).map((_, index) => <div key={index} className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              {selectedLotteries[index] ? <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center">
                                    <Target className="h-4 w-4 mr-2 text-winshirt-purple" />
                                    <span>{selectedLotteries[index]!.title}</span>
                                  </div>
                                  <Badge variant="secondary" className="ml-2">
                                    {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 0
                            }).format(selectedLotteries[index]!.value)}
                                  </Badge>
                                </div> : <>
                                  <Target className="h-4 w-4 mr-2 text-winshirt-purple" />
                                  <span>Choisir une loterie (slot {index + 1})</span>
                                </>}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[280px]">
                            <DropdownMenuLabel>Loteries disponibles</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-[200px] overflow-y-auto">
                              {activeLotteries.map(lottery => {
                          const isSelectedInThisSlot = selectedLotteries[index]?.id === lottery.id;
                          return <DropdownMenuItem key={lottery.id} className={`flex justify-between cursor-pointer ${isSelectedInThisSlot ? 'bg-winshirt-purple/20' : ''}`} onClick={() => handleLotteryToggle(lottery, index)}>
                                    <span>{lottery.title}</span>
                                    {isSelectedInThisSlot && <Check className="h-4 w-4" />}
                                  </DropdownMenuItem>;
                        })}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>)}
                  </div>
                </div>}

              <div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center rounded-md overflow-hidden">
                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange('decrease')} disabled={quantity <= 1} className="rounded-r-none">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-12 py-2 text-center bg-white/5 border-y border-input">
                      {quantity}
                    </div>
                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange('increase')} className="rounded-l-none">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button size="lg" className="flex-1 bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90" onClick={handleAddToCart} disabled={isCapturing}>
                    {isCapturing ? <>
                        <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Génération HD...
                      </> : <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Ajouter au panier
                      </>}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Modal */}
        <ModalPersonnalisation open={customizationModalOpen} onClose={() => setCustomizationModalOpen(false)} currentViewSide={currentViewSide} onViewSideChange={setCurrentViewSide}

      // Product data
      productName={product.name} productImageUrl={product.image_url}

      // Mockup data
      mockup={mockup} selectedMockupColor={selectedMockupColor} onMockupColorChange={setSelectedMockupColor}

      // Design props
      selectedDesignFront={selectedDesignFront} selectedDesignBack={selectedDesignBack} onSelectDesign={handleDesignSelect} onFileUpload={handleFileUpload} onAIImageGenerated={handleAIImageGenerated} onRemoveBackground={handleRemoveBackground} isRemovingBackground={isRemovingBackground}

      // SVG props
      svgColorFront={svgColorFront} svgColorBack={svgColorBack} svgContentFront={svgContentFront} svgContentBack={svgContentBack} onSvgColorChange={handleSvgColorChange} onSvgContentChange={handleSvgContentChange}

      // Text props
      textContentFront={textContentFront} textContentBack={textContentBack} textFontFront={textFontFront} textFontBack={textFontBack} textColorFront={textColorFront} textColorBack={textColorBack} textStylesFront={textStylesFront} textStylesBack={textStylesBack} textTransformFront={textTransformFront} textTransformBack={textTransformBack} onTextContentChange={content => {
        if (currentViewSide === 'front') {
          setTextContentFront(content);
        } else {
          setTextContentBack(content);
        }
      }} onTextFontChange={font => {
        if (currentViewSide === 'front') {
          setTextFontFront(font);
        } else {
          setTextFontBack(font);
        }
      }} onTextColorChange={color => {
        if (currentViewSide === 'front') {
          setTextColorFront(color);
        } else {
          setTextColorBack(color);
        }
      }} onTextStylesChange={styles => {
        if (currentViewSide === 'front') {
          setTextStylesFront(styles);
        } else {
          setTextStylesBack(styles);
        }
      }} onTextTransformChange={handleTextTransformChange}

      // Design transform props
      designTransformFront={designTransformFront} designTransformBack={designTransformBack} selectedSizeFront={selectedSizeFront} selectedSizeBack={selectedSizeBack} onDesignTransformChange={handleDesignTransformChange} onSizeChange={handleSizeClick}

      // Interaction handlers
      onDesignMouseDown={handleMouseDown} onTextMouseDown={e => handleMouseDown(e, true)} onTouchMove={handleTouchMove} />

        {/* Hidden capture elements for unified capture */}
        <CaptureElements
          customization={unifiedCustomization}
          selectedMockupColor={selectedMockupColor}
          mockup={mockup}
        />
      </main>
      
      <Footer />
    </div>;
};
export default ProductDetail;
