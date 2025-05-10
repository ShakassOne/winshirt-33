
import { useState } from 'react';

export const useTextState = () => {
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
  const [activeTextSide, setActiveTextSide] = useState<'front' | 'back'>('front');
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [startPosText, setStartPosText] = useState({ x: 0, y: 0 });

  return {
    textContentFront,
    setTextContentFront,
    textContentBack,
    setTextContentBack,
    textFontFront,
    setTextFontFront,
    textFontBack,
    setTextFontBack,
    textColorFront,
    setTextColorFront,
    textColorBack,
    setTextColorBack,
    textShowColorPickerFront,
    setTextShowColorPickerFront,
    textShowColorPickerBack,
    setTextShowColorPickerBack,
    textTransformFront,
    setTextTransformFront,
    textTransformBack,
    setTextTransformBack,
    textStylesFront,
    setTextStylesFront,
    textStylesBack,
    setTextStylesBack,
    activeTextSide,
    setActiveTextSide,
    isDraggingText,
    setIsDraggingText,
    startPosText,
    setStartPosText
  };
};
