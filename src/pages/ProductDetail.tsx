
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
  Filter
} from 'lucide-react';
import { fetchProductById, fetchAllLotteries, fetchDesigns, fetchMockupById } from '@/services/api.service';
import { Design, Lottery, CartItem } from '@/types/supabase.types';
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
    queryFn: fetchDesigns,
  });

  const uniqueCategories = React.useMemo(() => {
    const categories = designs.map(design => design.category);
    return ['all', ...new Set(categories)];
  }, [designs]);
  
  const filteredDesigns = React.useMemo(() => {
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
  }, [product, lotteries]);

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
    
    // Prix du design front
    const frontDesignPrice = selectedDesignFront ? 
      (printSizeFront === 'A3' ? 15 : 
       printSizeFront === 'A4' ? 10 : 
       printSizeFront === 'A5' ? 8 : 5) : 0;
    
    // Prix du design back
    const backDesignPrice = selectedDesignBack ? 
      (printSizeBack === 'A3' ? 15 : 
       printSizeBack === 'A4' ? 10 : 
       printSizeBack === 'A5' ? 8 : 5) : 0;
    
    // Prix du texte front
    const frontTextPrice = textContentFront ? (mockup?.text_price_front || 3) : 0;
    
    // Prix du texte back
    const backTextPrice = textContentBack ? (mockup?.text_price_back || 3) : 0;
    
    price += frontDesignPrice + backDesignPrice + frontTextPrice + backTextPrice;
    
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

    // Ajouter l'élément au panier (localStorage pour l'instant)
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify([...existingCart, cartItem]));
    
    toast.success('Produit ajouté au panier !');
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

  const getProductImage = () => {
    if (mockup) {
      return currentViewSide === 'front' ? mockup.svg_front_url : (mockup.svg_back_url || product.image_url);
    }
    return product.image_url;
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
              {getCurrentDesign() && (
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
              {getCurrentTextContent() && (
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
            {mockup && mockup.svg_back_url && (
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
                  <h3 className="text-sm font-medium mb-3">Couleur</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_colors.map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                          selectedColor === color ? 'border-winshirt-purple' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: getColorHexCode(color) }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tailles disponibles */}
              {product.available_sizes && product.available_sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Taille</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.available_sizes.map((size) => (
                      <div
                        key={size}
                        className={`px-3 py-1 rounded cursor-pointer ${
                          selectedSize === size
                            ? 'bg-winshirt-purple text-white'
                            : 'bg-black/20 hover:bg-black/30'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Options de personnalisation - avant les loteries */}
              {product.is_customizable && (
                <div className="bg-black/20 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Personnalisation</h3>
                  
                  <Tabs defaultValue="design" onValueChange={setSelectedTab} className="w-full">
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
                            disabled={!product.is_customizable}
                          >
                            {currentViewSide === 'front' ? 
                              (selectedDesignFront ? 'Changer' : 'Sélectionner') : 
                              (selectedDesignBack ? 'Changer' : 'Sélectionner')
                            }
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!product.is_customizable}
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
                      
                      {getCurrentDesign() && (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="mb-4">
                              <Label className="mb-2 block">Taille d'impression</Label>
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
                                  <SelectValue placeholder="Sélectionner une taille" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="A3">A3 (Grand) - 15€</SelectItem>
                                    <SelectItem value="A4">A4 (Moyen) - 10€</SelectItem>
                                    <SelectItem value="A5">A5 (Petit) - 8€</SelectItem>
                                    <SelectItem value="A6">A6 (Très petit) - 5€</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="bg-black/10 rounded p-4 flex items-center justify-center">
                              <img 
                                src={getCurrentDesign()!.image_url} 
                                alt={getCurrentDesign()!.name}
                                className="max-w-full max-h-[100px] object-contain"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-1">
                                <Label>Échelle</Label>
                                <span className="text-sm text-white/60">
                                  {(getCurrentDesignTransform().scale * 100).toFixed(0)}%
                                </span>
                              </div>
                              <Slider
                                min={0.01}
                                max={2}
                                step={0.01}
                                value={[getCurrentDesignTransform().scale]}
                                onValueChange={([value]) => handleDesignTransformChange('scale', value)}
                              />
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <Label>Rotation</Label>
                                <span className="text-sm text-white/60">
                                  {getCurrentDesignTransform().rotation}°
                                </span>
                              </div>
                              <Slider
                                min={0}
                                max={359}
                                step={1}
                                value={[getCurrentDesignTransform().rotation]}
                                onValueChange={([value]) => handleDesignTransformChange('rotation', value)}
                              />
                            </div>
                            
                            <div className="flex justify-center">
                              <Button 
                                variant="outline" 
                                size="sm"
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
                          </div>
                        </>
                      )}
                      
                      {!getCurrentDesign() && (
                        <div className="text-center py-8 text-white/60">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-40" />
                          <p>Sélectionnez un design pour le personnaliser</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="text" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="text-content" className="mb-2 block">Votre texte</Label>
                          <Input
                            id="text-content"
                            placeholder="Entrez votre texte ici"
                            value={currentViewSide === 'front' ? textContentFront : textContentBack}
                            onChange={(e) => {
                              if (currentViewSide === 'front') {
                                setTextContentFront(e.target.value);
                              } else {
                                setTextContentBack(e.target.value);
                              }
                            }}
                            className="border-winshirt-purple focus:border-winshirt-blue"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 mb-4">
                          <div>
                            <Label className="mb-2 block">Style</Label>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className={currentViewSide === 'front' ? 
                                  (textStylesFront.bold ? "bg-winshirt-purple/20" : "") :
                                  (textStylesBack.bold ? "bg-winshirt-purple/20" : "")
                                }
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextStylesFront({...textStylesFront, bold: !textStylesFront.bold});
                                  } else {
                                    setTextStylesBack({...textStylesBack, bold: !textStylesBack.bold});
                                  }
                                }}
                              >
                                <Bold className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className={currentViewSide === 'front' ? 
                                  (textStylesFront.italic ? "bg-winshirt-purple/20" : "") :
                                  (textStylesBack.italic ? "bg-winshirt-purple/20" : "")
                                }
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextStylesFront({...textStylesFront, italic: !textStylesFront.italic});
                                  } else {
                                    setTextStylesBack({...textStylesBack, italic: !textStylesBack.italic});
                                  }
                                }}
                              >
                                <Italic className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className={currentViewSide === 'front' ? 
                                  (textStylesFront.underline ? "bg-winshirt-purple/20" : "") :
                                  (textStylesBack.underline ? "bg-winshirt-purple/20" : "")
                                }
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextStylesFront({...textStylesFront, underline: !textStylesFront.underline});
                                  } else {
                                    setTextStylesBack({...textStylesBack, underline: !textStylesBack.underline});
                                  }
                                }}
                              >
                                <Underline className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="mb-2 block">Police</Label>
                          <Select value={getCurrentTextFont()} onValueChange={(value) => {
                            if (currentViewSide === 'front') {
                              setTextFontFront(value);
                            } else {
                              setTextFontBack(value);
                            }
                          }}>
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
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="block">Couleur</Label>
                            <div
                              className="w-6 h-6 rounded cursor-pointer border"
                              style={{ backgroundColor: currentViewSide === 'front' ? textColorFront : textColorBack }}
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
                            <div className="relative z-10">
                              <div 
                                className="fixed inset-0" 
                                onClick={() => {
                                  if (currentViewSide === 'front') {
                                    setTextShowColorPickerFront(false);
                                  } else {
                                    setTextShowColorPickerBack(false);
                                  }
                                }}
                              />
                              <div className="absolute right-0 p-2 bg-black/80 rounded-lg shadow-lg">
                                <HexColorPicker 
                                  color={currentViewSide === 'front' ? textColorFront : textColorBack}
                                  onChange={(color) => {
                                    if (currentViewSide === 'front') {
                                      setTextColorFront(color);
                                    } else {
                                      setTextColorBack(color);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <Label>Échelle</Label>
                              <span className="text-sm text-white/60">
                                {(getCurrentTextTransform().scale * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Slider
                              min={0.01}
                              max={3}
                              step={0.01}
                              value={[getCurrentTextTransform().scale]}
                              onValueChange={([value]) => handleTextTransformChange('scale', value)}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <Label>Rotation</Label>
                              <span className="text-sm text-white/60">
                                {getCurrentTextTransform().rotation}°
                              </span>
                            </div>
                            <Slider
                              min={0}
                              max={359}
                              step={1}
                              value={[getCurrentTextTransform().rotation]}
                              onValueChange={([value]) => handleTextTransformChange('rotation', value)}
                            />
                          </div>
                          
                          <div className="flex justify-center">
                            <Button 
                              variant="outline" 
                              size="sm"
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
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {/* Loteries disponibles - avec liste déroulante par ticket */}
              {product.tickets_offered > 0 && activeLotteries.length > 0 && (
                <div className="bg-black/20 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Participer à des loteries ({product.tickets_offered} ticket{product.tickets_offered > 1 ? 's' : ''} inclus)
                  </h3>
                  <p className="text-sm text-white/70 mb-4">
                    Choisissez la/les loterie(s) à laquelle vous souhaitez participer avec ce produit
                  </p>
                  
                  <div className="space-y-3">
                    {Array.from({ length: Math.min(product.tickets_offered, 10) }).map((_, index) => (
                      <div key={index} className="mb-4">
                        <Label className="mb-2 block text-sm">Ticket {index + 1}</Label>
                        <Select
                          value={selectedLotteries[index]?.id || ''}
                          onValueChange={(value) => {
                            const selectedLottery = activeLotteries.find(l => l.id === value);
                            if (selectedLottery) {
                              handleLotteryToggle(selectedLottery, index);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une loterie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {activeLotteries.map(lottery => (
                                <SelectItem 
                                  key={lottery.id}
                                  value={lottery.id}
                                  disabled={selectedLotteryIds.includes(lottery.id) && !selectedLotteries[index]?.id !== lottery.id}
                                >
                                  {lottery.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  {/* Afficher les loteries sélectionnées */}
                  {selectedLotteries.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium">Loteries sélectionnées:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedLotteries.map(lottery => (
                          <div key={lottery.id} className="p-3 rounded-lg border border-white/10 bg-black/10">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden">
                                <img 
                                  src={lottery.image_url} 
                                  alt={lottery.title} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-grow">
                                <p className="font-medium text-sm">{lottery.title}</p>
                                <div className="flex items-center mt-1 space-x-4 text-xs text-white/80">
                                  <div className="flex items-center">
                                    <Target className="h-3 w-3 mr-1" />
                                    <span>Objectif: {lottery.goal}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <UsersRound className="h-3 w-3 mr-1" />
                                    <span>Participants: {lottery.participants}</span>
                                  </div>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 -mt-1 -mr-1" 
                                onClick={() => handleLotteryToggle(lottery, selectedLotteries.indexOf(lottery))}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Quantité et bouton d'ajout au panier */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 w-8 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleQuantityChange('increase')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue hover:opacity-90"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ajouter au panier - {calculatePrice().toFixed(2)} €
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Dialog pour sélectionner un design avec filtre par catégorie */}
      <Dialog open={designDialogOpen} onOpenChange={setDesignDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sélectionner un design</DialogTitle>
          </DialogHeader>
          
          {/* Filtres par catégorie */}
          <div className="flex items-center justify-between pb-4 border-b mb-4">
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filtrer par catégorie:</span>
            </div>
            <Select
              value={selectedCategoryFilter}
              onValueChange={setSelectedCategoryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'Toutes catégories' : 
                     category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Liste des designs filtrés */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {filteredDesigns.map((design) => (
              <Card 
                key={design.id} 
                className="overflow-hidden cursor-pointer hover:border-winshirt-purple/50 transition-all hover:-translate-y-1"
                onClick={() => handleDesignSelect(design)}
              >
                <div className="aspect-square bg-black/20 flex items-center justify-center p-2">
                  <img 
                    src={design.image_url} 
                    alt={design.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-2 bg-black/10">
                  <p className="truncate text-sm font-medium">{design.name}</p>
                  <p className="text-xs text-white/60 capitalize">{design.category}</p>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredDesigns.length === 0 && (
            <div className="text-center py-8 text-white/60">
              <p>Aucun design trouvé dans cette catégorie</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
