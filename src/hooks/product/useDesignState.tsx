
import { useState } from 'react';
import { Design } from '@/types/supabase.types';

export const useDesignState = () => {
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
  const [activeDesignSide, setActiveDesignSide] = useState<'front' | 'back'>('front');
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  return {
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
    activeDesignSide,
    setActiveDesignSide,
    isDragging,
    setIsDragging,
    startPos,
    setStartPos
  };
};
