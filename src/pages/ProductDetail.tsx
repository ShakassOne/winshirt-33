
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

  // Ajout automatique d'une loterie lors du montage si tickets_offered > 0 et lotteries disponibles
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
    // Vérifier si nous avons atteint la limite de tickets
    if (selectedLotteries.length >= (product?.tickets_offered || 0) && !selectedLotteryIds.includes(lottery.id)) {
      toast.error(`Vous ne pouvez sélectionner que ${product?.tickets_offered} loterie(s) maximum pour ce produit.`);
      return;
    }

    // Si la loterie est déjà sélectionnée, la supprimer
    if (selectedLotteryIds.includes(lottery.id)) {
      setSelectedLotteries(prev => prev.filter(l => l.id !== lottery.id));
      setSelectedLotteryIds(prev => prev.filter(id => id !== lottery.id));
    } 
    // Sinon, l'ajouter
    else {
      // Pour l'index spécifique
      if (index < (product?.tickets_offered || 0)) {
        // Créer un nouveau tableau de loteries sélectionnées
        const updatedLotteries = [...selectedLotteries];
        // S'assurer que le tableau a la bonne taille
        while (updatedLotteries.length <= index) {
          updatedLotteries.push(null as unknown as Lottery);
        }
        // Mettre à jour la loterie à l'index spécifié
        updatedLotteries[index] = lottery;
        // Filtrer les entrées nulles
        const filteredLotteries = updatedLotteries.filter(l => l !== null);
        
        setSelectedLotteries(filteredLotteries);
        setSelectedLotteryIds(filteredLotteries.map(l => l.id));
      }
    }
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
    window.addEventListener('touchmove', handleMouseMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, startPos, isDraggingText, startPosText]);

  // Suivre le côté actif lors du changement de vue
  useEffect(() => {
    if (currentViewSide === 'front') {
      setActiveDesignSide('front');
      setActiveTextSide('front');
    } else {
      setActiveDesignSide('back');
      setActiveTextSide('back');
    }
  }, [currentViewSide]);

  // Activer le texte automatiquement lorsque l'onglet texte est sélectionné
  useEffect(() => {
    if (selectedTab === 'text') {
      // Le texte est automatiquement activé dans cette version
    }
  }, [selectedTab]);

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

    const cartItem: CartItem = {
      productId: product.id,
      name: product.name,
      price: calculatePrice(),
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
      image_url: product.image_url,
      lotteries: selectedLotteryIds.length > 0 ? selectedLotteryIds : undefined
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
              {customizationMode && getCurrentTextContent().trim() && (
                <div 
                  className="absolute cursor-move select-none"
                  style={{ 
                    transform: `translate(${getCurrentTextTransform().position.x}px, ${getCurrentTextTransform().position.y}px) 
                               rotate(${getCurrentTextTransform().rotation}deg) 
                               scale(${getCurrentTextTransform().scale})`,
                    transformOrigin: 'center',
                    zIndex: 20
                  }}
                  onMouseDown={(e) => handleMouseDown(e, true)}
                  onTouchStart={(e) => handleMouseDown(e, true)}
                >
                  <p 
                    style={{ 
                      color: getCurrentTextColor(), 
                      fontFamily: getCurrentTextFont(),
                      fontWeight: getCurrentTextStyles().bold ? 'bold' : 'normal',
                      fontStyle: getCurrentTextStyles().italic ? 'italic' : 'normal',
                      textDecoration: getCurrentTextStyles().underline ? 'underline' : 'none',
                      fontSize: '24px',
                      maxWidth: '300px',
                      textAlign: 'center',
                      wordBreak: 'break-word',
                      textShadow: '0 0 2px rgba(0,0,0,0.5)'
                    }}
                    className="p-2 rounded"
                  >
                    {getCurrentTextContent()}
                  </p>
                </div>
              )}
            </div>

            {/* Contrôles de personnalisation */}
            {customizationMode && (
              <div className="mt-4 bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex justify-between mb-4">
                  <Button
                    variant="outline" 
                    size="sm"
                    className={`${currentViewSide === 'front' ? 'bg-white/20' : ''}`}
                    onClick={() => setCurrentViewSide('front')}
                  >
                    Face avant
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    className={`${currentViewSide === 'back' ? 'bg-white/20' : ''}`}
                    onClick={() => setCurrentViewSide('back')}
                  >
                    Face arrière
                  </Button>
                </div>

                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="text">Texte</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="design" className="mt-4">
                    {getCurrentDesign() ? (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            <h3 className="font-medium mb-2">Design actuel</h3>
                            <p className="text-sm text-white/70">{getCurrentDesign()?.name}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDesignDialogOpen(true)}
                            >
                              Changer
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (currentViewSide === 'front') {
                                  setSelectedDesignFront(null);
                                } else {
                                  setSelectedDesignBack(null);
                                }
                              }}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Taille d'impression</h4>
                          <Select 
                            value={currentViewSide === 'front' ? printSizeFront : printSizeBack}
                            onValueChange={(value) => {
                              if (currentViewSide === 'front') {
                                setPrintSizeFront(value);
                              } else {
                                setPrintSizeBack(value);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une taille" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="A3">A3 - Grand (+{mockup?.price_a3 || 15}€)</SelectItem>
                                <SelectItem value="A4">A4 - Moyen (+{mockup?.price_a4 || 10}€)</SelectItem>
                                <SelectItem value="A5">A5 - Petit (+{mockup?.price_a5 || 8}€)</SelectItem>
                                <SelectItem value="A6">A6 - Mini (+{mockup?.price_a6 || 5}€)</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Échelle</h4>
                          <Slider 
                            value={[getCurrentDesignTransform().scale]}
                            min={0.2}
                            max={2}
                            step={0.1}
                            onValueChange={(value) => handleDesignTransformChange('scale', value[0])}
                          />
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Rotation</h4>
                          <Slider 
                            value={[getCurrentDesignTransform().rotation]}
                            min={-180}
                            max={180}
                            step={5}
                            onValueChange={(value) => handleDesignTransformChange('rotation', value[0])}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="mb-4 p-2 bg-white/5 rounded-full">
                          <ImageIcon className="h-8 w-8 text-white/50" />
                        </div>
                        <h3 className="font-medium mb-2">Aucun design sélectionné</h3>
                        <p className="text-sm text-white/70">Ajoutez un design à votre produit</p>
                        <div className="flex mt-4 gap-2">
                          <Button
                            onClick={() => setDesignDialogOpen(true)}
                            variant="outline"
                            size="sm"
                          >
                            Sélectionner un design
                          </Button>
                          <div className="relative">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Button
                              variant="secondary"
                              size="sm"
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Télécharger
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="text" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="text-content">Texte</Label>
                        <div className="flex gap-2 mt-1">
                          <Input 
                            id="text-content"
                            value={getCurrentTextContent()}
                            onChange={(e) => {
                              if (currentViewSide === 'front') {
                                setTextContentFront(e.target.value);
                              } else {
                                setTextContentBack(e.target.value);
                              }
                            }}
                            placeholder="Saisissez votre texte..."
                          />
                        </div>
                      </div>
                      
                      {(currentViewSide === 'front' ? textContentFront : textContentBack) ? (
                        <>
                          <div>
                            <Label htmlFor="font-select">Police</Label>
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
                              <SelectTrigger id="font-select">
                                <SelectValue placeholder="Choisir une police" />
                              </SelectTrigger>
                              <SelectContent>
                                {googleFonts.map(font => (
                                  <SelectItem key={font.value} value={font.value}>
                                    {font.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Style du texte</Label>
                            <div className="flex gap-2 mt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className={`${getCurrentTextStyles().bold ? 'bg-white/20' : ''}`}
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextStylesFront(prev => ({ ...prev, bold: !prev.bold }));
                                  } else {
                                    setTextStylesBack(prev => ({ ...prev, bold: !prev.bold }));
                                  }
                                }}
                              >
                                <Bold className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`${getCurrentTextStyles().italic ? 'bg-white/20' : ''}`}
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextStylesFront(prev => ({ ...prev, italic: !prev.italic }));
                                  } else {
                                    setTextStylesBack(prev => ({ ...prev, italic: !prev.italic }));
                                  }
                                }}
                              >
                                <Italic className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`${getCurrentTextStyles().underline ? 'bg-white/20' : ''}`}
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextStylesFront(prev => ({ ...prev, underline: !prev.underline }));
                                  } else {
                                    setTextStylesBack(prev => ({ ...prev, underline: !prev.underline }));
                                  }
                                }}
                              >
                                <Underline className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center">
                              <Label>Couleur</Label>
                              <div 
                                className="w-8 h-8 rounded-full border cursor-pointer"
                                style={{ backgroundColor: getCurrentTextColor() }}
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextShowColorPickerFront(prev => !prev);
                                    setTextShowColorPickerBack(false);
                                  } else {
                                    setTextShowColorPickerBack(prev => !prev);
                                    setTextShowColorPickerFront(false);
                                  }
                                }}
                              />
                            </div>
                            
                            {(currentViewSide === 'front' ? textShowColorPickerFront : textShowColorPickerBack) && (
                              <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
                                <HexColorPicker
                                  color={getCurrentTextColor()}
                                  onChange={(color) => {
                                    if (currentViewSide === 'front') {
                                      setTextColorFront(color);
                                    } else {
                                      setTextColorBack(color);
                                    }
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Échelle</h4>
                            <Slider 
                              value={[getCurrentTextTransform().scale]}
                              min={0.5}
                              max={2}
                              step={0.1}
                              onValueChange={(value) => handleTextTransformChange('scale', value[0])}
                            />
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Rotation</h4>
                            <Slider 
                              value={[getCurrentTextTransform().rotation]}
                              min={-180}
                              max={180}
                              step={5}
                              onValueChange={(value) => handleTextTransformChange('rotation', value[0])}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                          <div className="mb-2 p-2 bg-white/5 rounded-full">
                            <Type className="h-6 w-6 text-white/50" />
                          </div>
                          <p className="text-sm text-white/70">
                            Ajoutez du texte à votre design en utilisant le champ ci-dessus
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Choix des couleurs */}
            {customizationMode && mockup?.colors && mockup.colors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Couleur du produit</h3>
                <div className="flex flex-wrap gap-2">
                  {mockup.colors.map(color => (
                    <div 
                      key={color.name} 
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedMockupColor?.name === color.name ? 'border-winshirt-purple' : 'border-transparent'}`}
                      style={{ backgroundColor: color.color_code }}
                      onClick={() => setSelectedMockupColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Informations du produit */}
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category}</Badge>
                {product.tickets_offered && product.tickets_offered > 0 && (
                  <Badge variant="secondary">
                    <Target className="h-3 w-3 mr-1" />
                    {product.tickets_offered} {product.tickets_offered > 1 ? 'tickets' : 'ticket'}
                  </Badge>
                )}
              </div>

              <p className="text-lg font-semibold mb-2">{calculatePrice()}€</p>
              
              <div className="text-sm text-white/70">
                <p>{product.description}</p>
              </div>
            </div>

            {/* Options de personnalisation */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Personnalisation</h2>
                <Switch 
                  checked={customizationMode}
                  onCheckedChange={setCustomizationMode}
                />
              </div>
              
              <div className="text-sm text-white/70 mb-4">
                {customizationMode ? 
                  "Personnalisez votre produit en ajoutant des designs et du texte." : 
                  "Activez la personnalisation pour ajouter vos designs et textes."}
              </div>
            </div>

            {/* Options de couleurs */}
            {product.available_colors && product.available_colors.length > 0 && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Couleur</h2>
                <div className="flex flex-wrap gap-2">
                  {product.available_colors.map(color => (
                    <div 
                      key={color}
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${selectedColor === color ? 'border-winshirt-purple' : 'border-transparent'}`}
                      style={{ backgroundColor: getColorHexCode(color) }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Options de tailles */}
            {product.available_sizes && product.available_sizes.length > 0 && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Taille</h2>
                <div className="flex flex-wrap gap-2">
                  {product.available_sizes.map(size => (
                    <Button
                      key={size}
                      variant="outline"
                      className={`min-w-[40px] ${selectedSize === size ? 'bg-white/20' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sélection de loteries */}
            {product.tickets_offered && product.tickets_offered > 0 && activeLotteries.length > 0 && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2">
                  Loteries ({selectedLotteries.length}/{product.tickets_offered})
                </h2>
                
                <div className="bg-white/5 rounded-lg border border-white/10 divide-y divide-white/10">
                  {Array.from({ length: product.tickets_offered }).map((_, index) => {
                    // Trouver si une loterie est déjà sélectionnée à cet index
                    const selectedLotteryForSlot = selectedLotteries[index];
                    
                    return (
                      <div key={index} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <UsersRound className="h-5 w-5 mr-2 text-winshirt-purple" />
                            <span>
                              Ticket #{index + 1}
                            </span>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                {selectedLotteryForSlot ? (
                                  <>
                                    <span className="truncate max-w-[150px]">
                                      {selectedLotteryForSlot.title}
                                    </span>
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                  </>
                                ) : (
                                  <>
                                    Sélectionner
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                  </>
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Loteries disponibles</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {activeLotteries.map(lottery => (
                                <DropdownMenuItem 
                                  key={lottery.id}
                                  className="flex items-center justify-between cursor-pointer"
                                  onClick={() => handleLotteryToggle(lottery, index)}
                                >
                                  <div className="flex flex-col">
                                    <span>{lottery.title}</span>
                                    <span className="text-xs text-white/50">
                                      {lottery.value}€ - {lottery.participants} participants
                                    </span>
                                  </div>
                                  {selectedLotteryForSlot?.id === lottery.id && (
                                    <Check className="h-4 w-4" />
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantité et ajout au panier */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Quantité</h2>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="w-8 text-center">{quantity}</span>
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleQuantityChange('increase')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="w-full"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Ajouter au panier - {calculatePrice()}€
            </Button>
          </div>
        </div>
      </main>

      {/* Dialog pour sélectionner un design */}
      <Dialog open={designDialogOpen} onOpenChange={setDesignDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sélectionnez un design</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {uniqueCategories.map(category => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className={selectedCategoryFilter === category ? 'bg-white/20' : ''}
                onClick={() => setSelectedCategoryFilter(category)}
              >
                {category === 'all' ? 'Tous' : category}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredDesigns.map(design => (
              <Card 
                key={design.id} 
                className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-white/20 transition-all"
                onClick={() => handleDesignSelect(design)}
              >
                <div className="aspect-square bg-black/30 flex items-center justify-center p-2">
                  <img 
                    src={design.image_url} 
                    alt={design.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-2 text-center">
                  <p className="text-sm truncate">{design.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductDetail;
