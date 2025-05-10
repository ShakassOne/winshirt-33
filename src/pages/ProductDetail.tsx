
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
  DialogTitle,
  DialogDescription
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

  // Empêcher le défilement de la page pendant le glisser-déposer
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Bouton retour */}
          <Link to="/products" className="flex items-center gap-2 font-medium mb-8">
            <ArrowLeft className="h-5 w-5" />
            <span>Retour aux produits</span>
          </Link>
          
          <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-8`}>
            {/* Image du produit */}
            <div className="relative">
              <div className="sticky top-24 z-10">
                <div 
                  ref={productCanvasRef}
                  className="relative aspect-square bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Image principale */}
                  <img 
                    src={getProductImage()} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Designs (front/back) */}
                  {customizationMode && currentViewSide === 'front' && selectedDesignFront && (
                    <div 
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move ${isDragging && activeDesignSide === 'front' ? 'z-20' : 'z-10'}`}
                      onMouseDown={(e) => handleMouseDown(e)}
                      onTouchStart={(e) => handleMouseDown(e)}
                      style={{
                        transform: `translate(-50%, -50%) translate(${designTransformFront.position.x}px, ${designTransformFront.position.y}px) scale(${designTransformFront.scale}) rotate(${designTransformFront.rotation}deg)`,
                        maxWidth: printSizeFront === 'A3' ? '80%' : 
                                  printSizeFront === 'A4' ? '70%' : 
                                  printSizeFront === 'A5' ? '50%' : '30%'
                      }}
                    >
                      <img 
                        src={selectedDesignFront.image_url} 
                        alt={selectedDesignFront.name}
                        className="max-w-full h-auto pointer-events-none"
                      />
                    </div>
                  )}
                  
                  {customizationMode && currentViewSide === 'back' && selectedDesignBack && (
                    <div 
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move ${isDragging && activeDesignSide === 'back' ? 'z-20' : 'z-10'}`}
                      onMouseDown={(e) => handleMouseDown(e)}
                      onTouchStart={(e) => handleMouseDown(e)}
                      style={{
                        transform: `translate(-50%, -50%) translate(${designTransformBack.position.x}px, ${designTransformBack.position.y}px) scale(${designTransformBack.scale}) rotate(${designTransformBack.rotation}deg)`,
                        maxWidth: printSizeBack === 'A3' ? '80%' : 
                                  printSizeBack === 'A4' ? '70%' : 
                                  printSizeBack === 'A5' ? '50%' : '30%'
                      }}
                    >
                      <img 
                        src={selectedDesignBack.image_url} 
                        alt={selectedDesignBack.name}
                        className="max-w-full h-auto pointer-events-none"
                      />
                    </div>
                  )}
                  
                  {/* Texte (front/back) */}
                  {customizationMode && currentViewSide === 'front' && textContentFront && (
                    <div 
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move text-center p-2 ${isDraggingText && activeTextSide === 'front' ? 'z-30' : 'z-20'}`}
                      onMouseDown={(e) => handleMouseDown(e, true)}
                      onTouchStart={(e) => handleMouseDown(e, true)}
                      style={{
                        transform: `translate(-50%, -50%) translate(${textTransformFront.position.x}px, ${textTransformFront.position.y}px) scale(${textTransformFront.scale}) rotate(${textTransformFront.rotation}deg)`,
                        fontFamily: textFontFront,
                        color: textColorFront,
                        fontWeight: textStylesFront.bold ? 'bold' : 'normal',
                        fontStyle: textStylesFront.italic ? 'italic' : 'normal',
                        textDecoration: textStylesFront.underline ? 'underline' : 'none',
                        fontSize: '20px'
                      }}
                    >
                      <span className="pointer-events-none whitespace-pre-wrap">
                        {textContentFront}
                      </span>
                    </div>
                  )}
                  
                  {customizationMode && currentViewSide === 'back' && textContentBack && (
                    <div 
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move text-center p-2 ${isDraggingText && activeTextSide === 'back' ? 'z-30' : 'z-20'}`}
                      onMouseDown={(e) => handleMouseDown(e, true)}
                      onTouchStart={(e) => handleMouseDown(e, true)}
                      style={{
                        transform: `translate(-50%, -50%) translate(${textTransformBack.position.x}px, ${textTransformBack.position.y}px) scale(${textTransformBack.scale}) rotate(${textTransformBack.rotation}deg)`,
                        fontFamily: textFontBack,
                        color: textColorBack,
                        fontWeight: textStylesBack.bold ? 'bold' : 'normal',
                        fontStyle: textStylesBack.italic ? 'italic' : 'normal',
                        textDecoration: textStylesBack.underline ? 'underline' : 'none',
                        fontSize: '20px'
                      }}
                    >
                      <span className="pointer-events-none whitespace-pre-wrap">
                        {textContentBack}
                      </span>
                    </div>
                  )}
                  
                  {/* Bouton pour basculer entre face avant/arrière en mode personnalisation */}
                  {customizationMode && mockup?.has_back_side && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white"
                      onClick={() => setCurrentViewSide(prev => prev === 'front' ? 'back' : 'front')}
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      {currentViewSide === 'front' ? 'Voir l\'arrière' : 'Voir l\'avant'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Informations du produit */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-sm bg-gray-50">
                  {product.category || 'Vêtements'}
                </Badge>
                {product.is_new && (
                  <Badge className="text-sm bg-green-100 text-green-800 border-green-300">
                    Nouveau
                  </Badge>
                )}
              </div>
              
              <p className="text-xl font-bold mb-4">{calculatePrice().toFixed(2)} €</p>
              
              <div className="prose prose-sm text-gray-700 mb-6">
                <p>{product.description}</p>
              </div>
              
              {/* Sélection de couleur */}
              {product.available_colors && product.available_colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Couleur</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.available_colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full transition-all ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                        style={{ backgroundColor: getColorHexCode(color) }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={`Couleur ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sélection de taille */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Taille</h3>
                    <button type="button" className="text-sm text-primary">
                      Guide des tailles
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={`px-3 py-1 border rounded text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Personnalisation */}
              {mockup && (
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <Switch
                      checked={customizationMode}
                      onCheckedChange={setCustomizationMode}
                      id="customization-mode"
                    />
                    <Label htmlFor="customization-mode" className="ml-2">
                      Personnaliser ce produit
                    </Label>
                  </div>
                  
                  {customizationMode && (
                    <Card className="p-4">
                      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                        <TabsList className="grid grid-cols-2 mb-4">
                          <TabsTrigger value="design">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Design
                          </TabsTrigger>
                          <TabsTrigger value="text">
                            <Type className="h-4 w-4 mr-2" />
                            Texte
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="design">
                          <div className="space-y-4">
                            <h4 className="font-medium">Design {currentViewSide === 'front' ? 'avant' : 'arrière'}</h4>
                            
                            <div className="flex flex-col gap-3">
                              <Button 
                                variant="outline" 
                                onClick={() => setDesignDialogOpen(true)}
                                className="w-full"
                              >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Choisir un design
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Importer un design
                              </Button>
                              <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileUpload}
                              />
                            </div>
                            
                            {/* Option de taille d'impression */}
                            {getCurrentDesign() && (
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <Label htmlFor="print-size">Taille d'impression</Label>
                                  <span className="text-sm text-gray-500">
                                    {currentViewSide === 'front' ? printSizeFront : printSizeBack}
                                  </span>
                                </div>
                                <Select
                                  value={currentViewSide === 'front' ? printSizeFront : printSizeBack}
                                  onValueChange={value => {
                                    if (currentViewSide === 'front') {
                                      setPrintSizeFront(value);
                                    } else {
                                      setPrintSizeBack(value);
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="A3">A3 - Grand (+15€)</SelectItem>
                                    <SelectItem value="A4">A4 - Moyen (+10€)</SelectItem>
                                    <SelectItem value="A5">A5 - Petit (+8€)</SelectItem>
                                    <SelectItem value="A6">A6 - Mini (+5€)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            
                            {/* Contrôles de transformation du design */}
                            {getCurrentDesign() && (
                              <>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label htmlFor="design-scale">Échelle</Label>
                                    <span className="text-sm text-gray-500">
                                      {getCurrentDesignTransform().scale.toFixed(1)}x
                                    </span>
                                  </div>
                                  <Slider
                                    id="design-scale"
                                    min={0.2}
                                    max={2}
                                    step={0.1}
                                    value={[getCurrentDesignTransform().scale]}
                                    onValueChange={value => handleDesignTransformChange('scale', value[0])}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label htmlFor="design-rotation">Rotation</Label>
                                    <span className="text-sm text-gray-500">
                                      {getCurrentDesignTransform().rotation}°
                                    </span>
                                  </div>
                                  <Slider
                                    id="design-rotation"
                                    min={-180}
                                    max={180}
                                    step={1}
                                    value={[getCurrentDesignTransform().rotation]}
                                    onValueChange={value => handleDesignTransformChange('rotation', value[0])}
                                  />
                                </div>
                                
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    if (currentViewSide === 'front') {
                                      setSelectedDesignFront(null);
                                    } else {
                                      setSelectedDesignBack(null);
                                    }
                                  }}
                                  className="w-full mt-2"
                                >
                                  Supprimer le design
                                </Button>
                              </>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="text">
                          <div className="space-y-4">
                            <h4 className="font-medium">
                              Texte {currentViewSide === 'front' ? 'avant' : 'arrière'}
                            </h4>
                            
                            <div>
                              <Label htmlFor="text-input">Votre texte</Label>
                              <textarea
                                id="text-input"
                                className="mt-1 w-full p-2 border rounded-md"
                                rows={3}
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
                            
                            {getCurrentTextContent() && (
                              <>
                                <div>
                                  <Label htmlFor="font-selector">Police d'écriture</Label>
                                  <Select
                                    value={getCurrentTextFont()}
                                    onValueChange={font => {
                                      if (currentViewSide === 'front') {
                                        setTextFontFront(font);
                                      } else {
                                        setTextFontBack(font);
                                      }
                                    }}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                      <SelectGroup>
                                        <SelectLabel>Polices</SelectLabel>
                                        {googleFonts.map(font => (
                                          <SelectItem 
                                            key={font.value} 
                                            value={font.value}
                                            style={{ fontFamily: font.value }}
                                          >
                                            {font.label}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label>Style du texte</Label>
                                  <ToggleGroup 
                                    type="multiple"
                                    className="justify-start mt-2"
                                    value={Object.entries(getCurrentTextStyles())
                                      .filter(([_, value]) => value)
                                      .map(([key]) => key)}
                                    onValueChange={value => {
                                      const newStyles = {
                                        bold: value.includes('bold'),
                                        italic: value.includes('italic'),
                                        underline: value.includes('underline')
                                      };
                                      
                                      if (currentViewSide === 'front') {
                                        setTextStylesFront(newStyles);
                                      } else {
                                        setTextStylesBack(newStyles);
                                      }
                                    }}
                                  >
                                    <ToggleGroupItem value="bold" aria-label="Toggle bold">
                                      <Bold className="h-4 w-4" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="italic" aria-label="Toggle italic">
                                      <Italic className="h-4 w-4" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="underline" aria-label="Toggle underline">
                                      <Underline className="h-4 w-4" />
                                    </ToggleGroupItem>
                                  </ToggleGroup>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label>Couleur du texte</Label>
                                    <div 
                                      className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer"
                                      style={{ backgroundColor: getCurrentTextColor() }}
                                      onClick={() => {
                                        if (currentViewSide === 'front') {
                                          setTextShowColorPickerFront(!textShowColorPickerFront);
                                        } else {
                                          setTextShowColorPickerBack(!textShowColorPickerBack);
                                        }
                                      }}
                                    />
                                  </div>
                                  
                                  {((currentViewSide === 'front' && textShowColorPickerFront) || 
                                    (currentViewSide === 'back' && textShowColorPickerBack)) && (
                                    <div className="relative p-3 border rounded-md bg-white z-10">
                                      <HexColorPicker 
                                        color={getCurrentTextColor()}
                                        onChange={color => {
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
                                  <div className="flex justify-between">
                                    <Label htmlFor="text-scale">Échelle</Label>
                                    <span className="text-sm text-gray-500">
                                      {getCurrentTextTransform().scale.toFixed(1)}x
                                    </span>
                                  </div>
                                  <Slider
                                    id="text-scale"
                                    min={0.5}
                                    max={3}
                                    step={0.1}
                                    value={[getCurrentTextTransform().scale]}
                                    onValueChange={value => handleTextTransformChange('scale', value[0])}
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label htmlFor="text-rotation">Rotation</Label>
                                    <span className="text-sm text-gray-500">
                                      {getCurrentTextTransform().rotation}°
                                    </span>
                                  </div>
                                  <Slider
                                    id="text-rotation"
                                    min={-180}
                                    max={180}
                                    step={1}
                                    value={[getCurrentTextTransform().rotation]}
                                    onValueChange={value => handleTextTransformChange('rotation', value[0])}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </Card>
                  )}
                </div>
              )}
              
              {/* Sélecteur de loteries */}
              {product.tickets_offered && product.tickets_offered > 0 && activeLotteries.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">
                    <UsersRound className="inline-block h-5 w-5 mr-2" />
                    {product.tickets_offered === 1 ? 'Choisir une loterie' : `Choisir jusqu'à ${product.tickets_offered} loteries`}
                  </h3>
                  
                  {Array.from({ length: product.tickets_offered }).map((_, index) => (
                    <div key={index} className="mb-4">
                      <Select
                        value={selectedLotteries[index]?.id || ""}
                        onValueChange={(value) => {
                          if (value) {
                            const lottery = activeLotteries.find(l => l.id === value);
                            if (lottery) handleLotteryToggle(lottery, index);
                          } else {
                            // Handle deselection
                            const updatedLotteries = [...selectedLotteries];
                            if (index < updatedLotteries.length) {
                              // Remove lottery ID from selected IDs
                              const removedId = updatedLotteries[index]?.id;
                              setSelectedLotteryIds(prev => prev.filter(id => id !== removedId));
                              
                              // Remove lottery from array
                              updatedLotteries.splice(index, 1);
                              setSelectedLotteries(updatedLotteries);
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner une loterie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Aucune loterie</SelectItem>
                          {activeLotteries.map((lottery) => (
                            <SelectItem key={lottery.id} value={lottery.id}>
                              <div className="flex items-center">
                                <div className="h-4 w-4 rounded-full mr-2"
                                  style={{ backgroundColor: lottery.color }}
                                />
                                <span>{lottery.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedLotteries[index] && (
                        <div className="mt-2 p-3 rounded-md bg-gray-50 flex items-center gap-3">
                          <div 
                            className="h-6 w-6 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: selectedLotteries[index].color }} 
                          />
                          <div>
                            <h4 className="font-medium">{selectedLotteries[index].name}</h4>
                            <p className="text-xs text-gray-500">{selectedLotteries[index].description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Choix de la quantité */}
              <div className="mb-6">
                <Label htmlFor="quantity" className="mb-2 block text-sm font-medium">
                  Quantité
                </Label>
                <div className="flex h-10 max-w-[10rem]">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-full rounded-r-none"
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Diminuer la quantité</span>
                  </Button>
                  <Input
                    type="number"
                    id="quantity"
                    className="h-full rounded-none text-center"
                    value={quantity}
                    min={1}
                    onChange={e => setQuantity(Number(e.target.value))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-full rounded-l-none"
                    onClick={() => handleQuantityChange('increase')}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Augmenter la quantité</span>
                  </Button>
                </div>
              </div>
              
              {/* Bouton d'ajout au panier */}
              <Button 
                className="w-full mb-4 text-base py-6"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </Button>
              
              {/* Informations supplémentaires */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Détails du produit</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm">
                      <p>{product.details || 'Aucun détail supplémentaire disponible pour ce produit.'}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Livraison</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">Livraison estimée entre 3 et 5 jours ouvrables.</p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Retours</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm">
                      Retours acceptés sous 14 jours pour les articles non personnalisés et dans leur état d'origine.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal de sélection de design */}
      <Dialog open={designDialogOpen} onOpenChange={setDesignDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Choisir un design</DialogTitle>
            <DialogDescription>
              Sélectionnez un design pour votre produit ou importez le vôtre.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategoryFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategoryFilter(category)}
                >
                  {category === 'all' ? 'Tous' : category}
                </Button>
              ))}
            </div>
            
            {/* Grille de designs */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filteredDesigns.map(design => (
                <Card 
                  key={design.id} 
                  className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleDesignSelect(design)}
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center p-2">
                    <img 
                      src={design.image_url} 
                      alt={design.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-xs font-medium truncate">{design.name}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            {filteredDesigns.length === 0 && (
              <div className="text-center py-8">
                <p>Aucun design trouvé dans cette catégorie.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
