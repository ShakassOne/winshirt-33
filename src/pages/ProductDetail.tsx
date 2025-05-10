
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

  // Fix handleLotteryToggle function to handle selecting, deselecting and changing lotteries
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
              {/* Badge nouveauté si le produit est marqué comme nouveau */}
              {product.is_new && (
                <Badge className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600">Nouveau</Badge>
              )}
              
              {/* Image principale */}
              <div className="relative bg-white rounded-lg overflow-hidden shadow-md aspect-square">
                <div 
                  ref={productCanvasRef} 
                  className="w-full h-full relative"
                >
                  {/* Image de base du produit */}
                  <img 
                    src={getProductImage() || '/placeholder.svg'} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Design sur l'image (si en mode personnalisation et qu'un design est sélectionné) */}
                  {customizationMode && getCurrentDesign() && (
                    <div 
                      className={`absolute transform select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) translate(${getCurrentDesignTransform().position.x}px, ${getCurrentDesignTransform().position.y}px) scale(${getCurrentDesignTransform().scale}) rotate(${getCurrentDesignTransform().rotation}deg)`,
                        pointerEvents: isDragging || isDraggingText ? 'none' : 'auto',
                        maxWidth: '70%',
                        maxHeight: '70%',
                      }}
                      onMouseDown={(e) => handleMouseDown(e)}
                      onTouchStart={(e) => handleMouseDown(e)}
                    >
                      <img 
                        src={getCurrentDesign()?.image_url || ''} 
                        alt="Design"
                        className="w-full h-full object-contain"
                        style={{ pointerEvents: 'none' }}
                      />
                    </div>
                  )}
                  
                  {/* Texte sur l'image (si en mode personnalisation et qu'un texte est saisi) */}
                  {customizationMode && getCurrentTextContent() && (
                    <div 
                      className={`absolute transform select-none ${isDraggingText ? 'cursor-grabbing' : 'cursor-grab'}`}
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) translate(${getCurrentTextTransform().position.x}px, ${getCurrentTextTransform().position.y}px) scale(${getCurrentTextTransform().scale}) rotate(${getCurrentTextTransform().rotation}deg)`,
                        pointerEvents: isDragging || isDraggingText ? 'none' : 'auto',
                        maxWidth: '80%',
                        fontFamily: getCurrentTextFont(),
                        color: getCurrentTextColor() || 'white',
                        textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                        fontSize: '24px',
                        fontWeight: getCurrentTextStyles().bold ? 'bold' : 'normal',
                        fontStyle: getCurrentTextStyles().italic ? 'italic' : 'normal',
                        textDecoration: getCurrentTextStyles().underline ? 'underline' : 'none',
                        textAlign: 'center',
                        padding: '0.5rem',
                      }}
                      onMouseDown={(e) => handleMouseDown(e, true)}
                      onTouchStart={(e) => handleMouseDown(e, true)}
                    >
                      {getCurrentTextContent()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Boutons de contrôle pour la personnalisation */}
              {customizationMode && mockup && (
                <div className="mt-4 flex flex-col gap-4">
                  {/* Sélection face avant/arrière */}
                  {mockup.svg_back_url && (
                    <div className="flex justify-center">
                      <ToggleGroup type="single" value={currentViewSide} onValueChange={(value) => value && setCurrentViewSide(value as 'front' | 'back')}>
                        <ToggleGroupItem value="front">Face avant</ToggleGroupItem>
                        <ToggleGroupItem value="back">Face arrière</ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  )}
                  
                  {/* Tabs pour sélectionner le type de personnalisation */}
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="grid grid-cols-3 mb-2">
                      <TabsTrigger value="design" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Design</span>
                      </TabsTrigger>
                      <TabsTrigger value="text" className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        <span>Texte</span>
                      </TabsTrigger>
                      <TabsTrigger value="options" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>Options</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Contenu de l'onglet Design */}
                    <TabsContent value="design" className="space-y-4">
                      {getCurrentDesign() ? (
                        <div className="space-y-4">
                          {/* Aperçu du design sélectionné */}
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h3 className="text-sm font-medium mb-2">Design sélectionné</h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden">
                                  <img 
                                    src={getCurrentDesign().image_url} 
                                    alt={getCurrentDesign().name}
                                    className="w-full h-full object-contain" 
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{getCurrentDesign().name}</p>
                                  <p className="text-sm text-gray-500">{getCurrentDesign().category}</p>
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => currentViewSide === 'front' ? setSelectedDesignFront(null) : setSelectedDesignBack(null)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </div>
                          
                          {/* Options de transformation */}
                          <Accordion type="single" collapsible defaultValue="transform">
                            <AccordionItem value="transform">
                              <AccordionTrigger className="text-base">Options du design</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 px-1">
                                  {/* Taille d'impression */}
                                  <div className="space-y-2">
                                    <Label>Taille d'impression</Label>
                                    <Select 
                                      value={currentViewSide === 'front' ? printSizeFront : printSizeBack}
                                      onValueChange={val => currentViewSide === 'front' ? setPrintSizeFront(val) : setPrintSizeBack(val)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une taille" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="A3">A3 (Grand)</SelectItem>
                                        <SelectItem value="A4">A4 (Moyen)</SelectItem>
                                        <SelectItem value="A5">A5 (Petit)</SelectItem>
                                        <SelectItem value="A6">A6 (Très petit)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500">
                                      Prix: {currentViewSide === 'front' ? 
                                        (printSizeFront === 'A3' ? mockup.price_a3 : 
                                         printSizeFront === 'A4' ? mockup.price_a4 : 
                                         printSizeFront === 'A5' ? mockup.price_a5 : mockup.price_a6) : 
                                        (printSizeBack === 'A3' ? mockup.price_a3 : 
                                         printSizeBack === 'A4' ? mockup.price_a4 : 
                                         printSizeBack === 'A5' ? mockup.price_a5 : mockup.price_a6)} €
                                    </p>
                                  </div>
                                  
                                  {/* Echelle */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label>Taille</Label>
                                      <span className="text-xs text-gray-500">
                                        {(currentViewSide === 'front' ? designTransformFront.scale : designTransformBack.scale).toFixed(1)}x
                                      </span>
                                    </div>
                                    <Slider
                                      value={[currentViewSide === 'front' ? designTransformFront.scale : designTransformBack.scale]}
                                      min={0.1}
                                      max={2}
                                      step={0.1}
                                      onValueChange={([value]) => handleDesignTransformChange('scale', value)}
                                    />
                                  </div>
                                  
                                  {/* Rotation */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label>Rotation</Label>
                                      <span className="text-xs text-gray-500">
                                        {(currentViewSide === 'front' ? designTransformFront.rotation : designTransformBack.rotation)}°
                                      </span>
                                    </div>
                                    <Slider
                                      value={[currentViewSide === 'front' ? designTransformFront.rotation : designTransformBack.rotation]}
                                      min={-180}
                                      max={180}
                                      step={1}
                                      onValueChange={([value]) => handleDesignTransformChange('rotation', value)}
                                    />
                                  </div>
                                  
                                  {/* Réinitialiser */}
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full"
                                    onClick={() => {
                                      if (currentViewSide === 'front') {
                                        setDesignTransformFront({
                                          position: { x: 0, y: 0 },
                                          scale: 1,
                                          rotation: 0
                                        });
                                      } else {
                                        setDesignTransformBack({
                                          position: { x: 0, y: 0 },
                                          scale: 1,
                                          rotation: 0
                                        });
                                      }
                                    }}
                                  >
                                    <RotateCw className="h-4 w-4 mr-2" />
                                    Réinitialiser
                                  </Button>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-4 py-4">
                          <div className="text-center space-y-2">
                            <p className="font-medium">Aucun design sélectionné</p>
                            <p className="text-sm text-gray-500">Choisissez un design dans notre collection ou importez le vôtre</p>
                          </div>
                          
                          <div className="flex flex-col gap-2 w-full sm:flex-row sm:justify-center">
                            <Button
                              variant="default"
                              onClick={() => setDesignDialogOpen(true)}
                            >
                              <ImageIcon className="h-4 w-4 mr-2" />
                              Choisir un design
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Importer
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                              />
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    {/* Contenu de l'onglet Texte */}
                    <TabsContent value="text" className="space-y-4">
                      <div className="space-y-4">
                        {/* Entrée de texte */}
                        <div className="space-y-2">
                          <Label>Votre texte</Label>
                          <Input 
                            value={currentViewSide === 'front' ? textContentFront : textContentBack} 
                            onChange={(e) => {
                              currentViewSide === 'front' 
                                ? setTextContentFront(e.target.value)
                                : setTextContentBack(e.target.value);
                            }}
                            placeholder="Saisissez votre texte ici"
                          />
                          <p className="text-xs text-gray-500">
                            Prix: {currentViewSide === 'front' ? mockup.text_price_front : mockup.text_price_back} €
                          </p>
                        </div>
                        
                        {/* Options de texte (uniquement si du texte a été saisi) */}
                        {getCurrentTextContent() && (
                          <Accordion type="single" collapsible defaultValue="textOptions">
                            <AccordionItem value="textOptions">
                              <AccordionTrigger className="text-base">Options du texte</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 px-1">
                                  {/* Police de caractères */}
                                  <div className="space-y-2">
                                    <Label>Police</Label>
                                    <Select 
                                      value={getCurrentTextFont()}
                                      onValueChange={val => {
                                        if (currentViewSide === 'front') {
                                          setTextFontFront(val);
                                        } else {
                                          setTextFontBack(val);
                                        }
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choisir une police" />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-[300px]">
                                        <SelectGroup>
                                          {googleFonts.map((font) => (
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
                                  
                                  {/* Couleur du texte */}
                                  <div className="space-y-2">
                                    <Label>Couleur</Label>
                                    <div 
                                      className="h-10 w-full rounded-md border border-gray-300 flex items-center justify-between p-2 cursor-pointer"
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
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="h-6 w-6 rounded-full border border-gray-300"
                                          style={{ backgroundColor: getCurrentTextColor() }}
                                        />
                                        <span>{getCurrentTextColor()}</span>
                                      </div>
                                      <ChevronDown className="h-4 w-4" />
                                    </div>
                                    
                                    {/* Sélecteur de couleur */}
                                    {(currentViewSide === 'front' ? textShowColorPickerFront : textShowColorPickerBack) && (
                                      <div className="relative z-10">
                                        <div className="absolute top-0 left-0 right-0 bg-white rounded-md shadow-lg p-3 border">
                                          <HexColorPicker
                                            color={getCurrentTextColor()}
                                            onChange={color => {
                                              if (currentViewSide === 'front') {
                                                setTextColorFront(color);
                                              } else {
                                                setTextColorBack(color);
                                              }
                                            }}
                                            style={{ width: '100%' }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Styles de texte (gras, italique, souligné) */}
                                  <div className="space-y-2">
                                    <Label>Style</Label>
                                    <div className="flex gap-2">
                                      <Button
                                        variant={getCurrentTextStyles().bold ? "default" : "outline"}
                                        size="icon"
                                        type="button"
                                        onClick={() => {
                                          if (currentViewSide === 'front') {
                                            setTextStylesFront(prev => ({...prev, bold: !prev.bold}));
                                          } else {
                                            setTextStylesBack(prev => ({...prev, bold: !prev.bold}));
                                          }
                                        }}
                                      >
                                        <Bold className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant={getCurrentTextStyles().italic ? "default" : "outline"}
                                        size="icon"
                                        type="button"
                                        onClick={() => {
                                          if (currentViewSide === 'front') {
                                            setTextStylesFront(prev => ({...prev, italic: !prev.italic}));
                                          } else {
                                            setTextStylesBack(prev => ({...prev, italic: !prev.italic}));
                                          }
                                        }}
                                      >
                                        <Italic className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant={getCurrentTextStyles().underline ? "default" : "outline"}
                                        size="icon"
                                        type="button"
                                        onClick={() => {
                                          if (currentViewSide === 'front') {
                                            setTextStylesFront(prev => ({...prev, underline: !prev.underline}));
                                          } else {
                                            setTextStylesBack(prev => ({...prev, underline: !prev.underline}));
                                          }
                                        }}
                                      >
                                        <Underline className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {/* Echelle */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label>Taille</Label>
                                      <span className="text-xs text-gray-500">
                                        {(currentViewSide === 'front' ? textTransformFront.scale : textTransformBack.scale).toFixed(1)}x
                                      </span>
                                    </div>
                                    <Slider
                                      value={[currentViewSide === 'front' ? textTransformFront.scale : textTransformBack.scale]}
                                      min={0.5}
                                      max={3}
                                      step={0.1}
                                      onValueChange={([value]) => handleTextTransformChange('scale', value)}
                                    />
                                  </div>
                                  
                                  {/* Rotation */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label>Rotation</Label>
                                      <span className="text-xs text-gray-500">
                                        {(currentViewSide === 'front' ? textTransformFront.rotation : textTransformBack.rotation)}°
                                      </span>
                                    </div>
                                    <Slider
                                      value={[currentViewSide === 'front' ? textTransformFront.rotation : textTransformBack.rotation]}
                                      min={-180}
                                      max={180}
                                      step={1}
                                      onValueChange={([value]) => handleTextTransformChange('rotation', value)}
                                    />
                                  </div>
                                  
                                  {/* Réinitialiser */}
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full"
                                    onClick={() => {
                                      if (currentViewSide === 'front') {
                                        setTextTransformFront({
                                          position: { x: 0, y: 0 },
                                          scale: 1,
                                          rotation: 0
                                        });
                                      } else {
                                        setTextTransformBack({
                                          position: { x: 0, y: 0 },
                                          scale: 1,
                                          rotation: 0
                                        });
                                      }
                                    }}
                                  >
                                    <RotateCw className="h-4 w-4 mr-2" />
                                    Réinitialiser
                                  </Button>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    </TabsContent>
                    
                    {/* Contenu de l'onglet Options */}
                    <TabsContent value="options" className="space-y-4">
                      <div className="space-y-4">
                        {/* Couleurs de mockup disponibles */}
                        {mockup?.colors && mockup.colors.length > 0 && (
                          <div className="space-y-2">
                            <Label>Couleur du mockup</Label>
                            <div className="flex flex-wrap gap-2">
                              {mockup.colors.map((color) => (
                                <div
                                  key={color.id || color.color_code}
                                  className={`h-8 w-8 rounded-full cursor-pointer border-2 ${
                                    selectedMockupColor?.id === color.id ? 'border-primary' : 'border-gray-300'
                                  }`}
                                  style={{ backgroundColor: color.color_code }}
                                  onClick={() => setSelectedMockupColor(color)}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Gestion des designs */}
                        <div className="space-y-2">
                          <h3 className="font-medium">Designs</h3>
                          
                          <div className="space-y-2">
                            {/* Design face avant */}
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Label>Face avant</Label>
                                {selectedDesignFront && (
                                  <Badge variant="outline" className="font-normal">
                                    {printSizeFront}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  setCurrentViewSide('front');
                                  setSelectedTab('design');
                                }}
                              >
                                {selectedDesignFront ? 'Modifier' : 'Ajouter'}
                              </Button>
                            </div>
                            
                            {/* Design face arrière (uniquement si le mockup a un verso) */}
                            {mockup.svg_back_url && (
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Label>Face arrière</Label>
                                  {selectedDesignBack && (
                                    <Badge variant="outline" className="font-normal">
                                      {printSizeBack}
                                    </Badge>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    setCurrentViewSide('back');
                                    setSelectedTab('design');
                                  }}
                                >
                                  {selectedDesignBack ? 'Modifier' : 'Ajouter'}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Gestion du texte */}
                        <div className="space-y-2">
                          <h3 className="font-medium">Texte</h3>
                          
                          <div className="space-y-2">
                            {/* Texte face avant */}
                            <div className="flex justify-between items-center">
                              <Label>Face avant</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                  setCurrentViewSide('front');
                                  setSelectedTab('text');
                                }}
                              >
                                {textContentFront ? 'Modifier' : 'Ajouter'}
                              </Button>
                            </div>
                            
                            {/* Texte face arrière (uniquement si le mockup a un verso) */}
                            {mockup.svg_back_url && (
                              <div className="flex justify-between items-center">
                                <Label>Face arrière</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => {
                                    setCurrentViewSide('back');
                                    setSelectedTab('text');
                                  }}
                                >
                                  {textContentBack ? 'Modifier' : 'Ajouter'}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Prix */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between font-medium">
                            <span>Prix total personnalisation:</span>
                            <span>{calculatePrice() - product.price} €</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
            
            {/* Informations produit */}
            <div className="space-y-6">
              {/* En-tête du produit */}
              <div>
                {product.is_new && (
                  <Badge className="mb-2 bg-amber-500 hover:bg-amber-600">Nouveau</Badge>
                )}
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-xl font-semibold mt-1">{product.price} €</p>
              </div>
              
              {/* Description */}
              <p className="text-gray-700">{product.description}</p>
              
              {/* Détails supplémentaires */}
              {product.details && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Détails</h3>
                  <div className="text-sm text-gray-600">
                    {product.details}
                  </div>
                </div>
              )}
              
              {/* Options de produit */}
              <div className="space-y-6">
                {/* Mode de personnalisation */}
                {product.is_customizable && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Personnalisation</Label>
                      <Switch 
                        checked={customizationMode}
                        onCheckedChange={setCustomizationMode}
                      />
                    </div>
                    {customizationMode && (
                      <p className="text-sm text-gray-500">
                        Personnalisez votre produit avec des designs et du texte
                      </p>
                    )}
                  </div>
                )}
                
                {/* Sélection de couleur */}
                {product.available_colors && product.available_colors.length > 0 && (
                  <div>
                    <Label className="block mb-2">Couleur</Label>
                    <div className="flex flex-wrap gap-2">
                      {product.available_colors.map((color) => (
                        <div
                          key={color}
                          className={`h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                            selectedColor === color ? 'border-primary' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: getColorHexCode(color) }}
                          onClick={() => setSelectedColor(color)}
                        >
                          {selectedColor === color && (
                            <Check className="h-4 w-4 text-white stroke-[3]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Sélection de taille */}
                {product.available_sizes && product.available_sizes.length > 0 && (
                  <div>
                    <Label className="block mb-2">Taille</Label>
                    <div className="flex flex-wrap gap-2">
                      {product.available_sizes.map((size) => (
                        <Button
                          key={size}
                          type="button"
                          variant={selectedSize === size ? "default" : "outline"}
                          className="px-4 py-2"
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Sélection de loterie(s) */}
                {product.tickets_offered && product.tickets_offered > 0 && activeLotteries.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="flex items-center gap-2">
                        <UsersRound className="h-4 w-4" />
                        Participez à une loterie
                        <Badge variant="outline" className="ml-2">
                          {selectedLotteryIds.length}/{product.tickets_offered}
                        </Badge>
                      </Label>
                    </div>
                    
                    <div className="space-y-3">
                      {Array.from({ length: product.tickets_offered }).map((_, index) => (
                        <Collapsible key={index} className="border rounded-md">
                          <CollapsibleTrigger className="flex justify-between items-center w-full px-4 py-3 hover:bg-gray-50">
                            <div className="font-medium flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                                {index + 1}
                              </div>
                              <span>
                                {selectedLotteries[index] ? 
                                  `${selectedLotteries[index].title}` : 
                                  `Sélectionner une loterie`
                                }
                              </span>
                              {selectedLotteries[index] && (
                                <Badge 
                                  style={{ backgroundColor: selectedLotteries[index].color || 'bg-primary' }}
                                  className="ml-2"
                                >
                                  {selectedLotteries[index].value} €
                                </Badge>
                              )}
                            </div>
                            <ChevronDown className="h-4 w-4 transition-transform ui-expanded:rotate-180" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pb-4 pt-1">
                            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                              {activeLotteries.map((lottery) => (
                                <Card 
                                  key={lottery.id}
                                  className={`cursor-pointer overflow-hidden transition ${
                                    selectedLotteryIds.includes(lottery.id) ? 'ring-2 ring-primary' : ''
                                  }`}
                                  onClick={() => handleLotteryToggle(lottery, index)}
                                >
                                  <div className="aspect-[4/3] relative">
                                    <img 
                                      src={lottery.image_url} 
                                      alt={lottery.title} 
                                      className="object-cover w-full h-full" 
                                    />
                                    {lottery.color && (
                                      <div
                                        className="absolute inset-0 opacity-30"
                                        style={{ backgroundColor: lottery.color }}
                                      />
                                    )}
                                  </div>
                                  <div className="p-3">
                                    <h3 className="font-medium text-sm">{lottery.title}</h3>
                                    <div className="flex justify-between items-center mt-1">
                                      <Badge>{lottery.value} €</Badge>
                                      {selectedLotteryIds.includes(lottery.id) && (
                                        <Check className="h-4 w-4 text-primary" />
                                      )}
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quantité et achat */}
              <div className="space-y-4">
                {/* Quantité */}
                <div>
                  <Label className="block mb-2">Quantité</Label>
                  <div className="flex items-center border rounded-md w-max">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                      className="rounded-r-none"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="px-4 py-2 font-medium">{quantity}</div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange('increase')}
                      className="rounded-l-none"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Prix total et bouton d'achat */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-lg">Prix total:</span>
                    <span className="font-bold text-lg">{calculatePrice() * quantity} €</span>
                  </div>
                  
                  <Button 
                    className="w-full"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Ajouter au panier
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Modal sélection de design */}
      <Dialog open={designDialogOpen} onOpenChange={setDesignDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choisissez un design</DialogTitle>
            <DialogDescription>
              Parcourez notre collection de designs ou importez le vôtre
            </DialogDescription>
          </DialogHeader>
          
          {/* Catégories */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {uniqueCategories.map((category) => (
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
          
          {/* Liste des designs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoadingDesigns ? (
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="aspect-square bg-gray-100 rounded-md animate-pulse" />
              ))
            ) : filteredDesigns.length === 0 ? (
              <p className="col-span-full text-center py-10 text-gray-500">
                Aucun design trouvé dans cette catégorie.
              </p>
            ) : (
              filteredDesigns.map((design) => (
                <div
                  key={design.id}
                  className="aspect-square bg-white border rounded-md p-2 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleDesignSelect(design)}
                >
                  <div className="h-full flex flex-col">
                    <div className="flex-grow relative bg-gray-50 rounded overflow-hidden">
                      <img
                        src={design.image_url}
                        alt={design.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium truncate">{design.name}</p>
                      <p className="text-xs text-gray-500 truncate">{design.category}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Importer un design */}
          <div className="mt-4 flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                fileInputRef.current?.click();
                setDesignDialogOpen(false);
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer mon design
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
