import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
// ... (imports inchangés, je garde tout le haut identique à ton fichier d’origine)

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
  // ... inchangé (je garde toute la liste de polices comme dans ton fichier)
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  // ... etc.
  { value: 'Fira Code', label: 'Fira Code' }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const productCanvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ... tous les useState inchangés

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

  // ... tous les useState pour les designs, textes, etc. inchangés

  // États pour les loteries (nouvelle logique clean)
  const [selectedLotteryIds, setSelectedLotteryIds] = useState<string[]>([]);

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

  // ... tous les useMemo, useEffect, et fonctions annexes inchangés

  // -------- PATCH Loterie ici --------

  // Sélectionner proprement une loterie pour un slot (index)
  const handleLotterySelect = (lotteryId: string, index: number) => {
    // Empêcher la sélection de la même loterie sur deux slots différents
    if (selectedLotteryIds.includes(lotteryId) && selectedLotteryIds[index] !== lotteryId) {
      toast.error("Vous avez déjà sélectionné cette loterie !");
      return;
    }
    // Mettre à jour le slot choisi
    const newIds = [...selectedLotteryIds];
    newIds[index] = lotteryId;
    setSelectedLotteryIds(newIds);
  };

  // ... toutes les autres fonctions inchangées (handleAddToCart, etc.)

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
      lotteries: selectedLotteryIds.filter(Boolean).length > 0 ? selectedLotteryIds.filter(Boolean) : undefined
    };
    // ... gestion de la customisation, comme dans ta version d’origine

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify([...existingCart, cartItem]));
    toast.success('Produit ajouté au panier !');
  };

  // ... tout le reste (affichage, JSX, etc.) inchangé, sauf pour la partie loterie :

  // ---- PATCH rendu JSX DropdownMenu pour loterie ----
  // Remplace le rendu de chaque slot DropdownMenu par :
  /*
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          {selectedLotteryIds[index] && lotteries.find(l => l.id === selectedLotteryIds[index]) ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-2 text-winshirt-purple" />
                <span>
                  {lotteries.find(l => l.id === selectedLotteryIds[index])?.title}
                </span>
              </div>
              <Badge variant="secondary" className="ml-2">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0
                }).format(lotteries.find(l => l.id === selectedLotteryIds[index])?.value || 0)}
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
            const isSelected = selectedLotteryIds[index] === lottery.id;
            return (
              <DropdownMenuItem
                key={lottery.id}
                className={`flex justify-between cursor-pointer ${isSelected ? 'bg-winshirt-purple/20' : ''}`}
                onClick={() => handleLotterySelect(lottery.id, index)}
              >
                <span>{lottery.title}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  */

  // ----------- FIN PATCH LOTERIE -----------

  // Le reste (personnalisation, images, etc.) inchangé
};

export default ProductDetail;
