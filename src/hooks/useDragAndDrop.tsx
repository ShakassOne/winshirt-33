
import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  dragType: 'design' | 'text' | null;
  startPosition: { x: number; y: number };
  elementStartPosition: { x: number; y: number };
}

export const useDragAndDrop = (
  onDesignTransformChange: (property: string, value: any) => void,
  onTextTransformChange: (property: string, value: any) => void,
  designTransform: { position: { x: number; y: number }; scale: number; rotation: number },
  textTransform: { position: { x: number; y: number }; scale: number; rotation: number }
) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    startPosition: { x: 0, y: 0 },
    elementStartPosition: { x: 0, y: 0 }
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent, type: 'design' | 'text') => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const currentTransform = type === 'design' ? designTransform : textTransform;

    setDragState({
      isDragging: true,
      dragType: type,
      startPosition: { x: clientX, y: clientY },
      elementStartPosition: { x: currentTransform.position.x, y: currentTransform.position.y }
    });
  }, [designTransform, textTransform]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.isDragging || !dragState.dragType) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragState.startPosition.x;
    const deltaY = clientY - dragState.startPosition.y;

    const newPosition = {
      x: dragState.elementStartPosition.x + deltaX,
      y: dragState.elementStartPosition.y + deltaY
    };

    if (dragState.dragType === 'design') {
      onDesignTransformChange('position', newPosition);
    } else if (dragState.dragType === 'text') {
      onTextTransformChange('position', newPosition);
    }
  }, [dragState, onDesignTransformChange, onTextTransformChange]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragType: null,
      startPosition: { x: 0, y: 0 },
      elementStartPosition: { x: 0, y: 0 }
    });
  }, []);

  // Mouse events
  const handleDesignMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    handleMouseDown(e, 'design');
  }, [handleMouseDown]);

  const handleTextMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    handleMouseDown(e, 'text');
  }, [handleMouseDown]);

  return {
    handleDesignMouseDown,
    handleTextMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDragging: dragState.isDragging,
    containerRef
  };
};
