import logger from '@/utils/logger';

export const logCaptureState = (stage: string, data?: any) => {
  logger.log(`🔍 [Capture Debug] ${stage}`, data || '');
};

export const validateElementForCapture = (elementId: string): boolean => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`❌ [Capture Debug] Élément ${elementId} introuvable`);
    return false;
  }

  const hasVisibleContent = element.offsetWidth > 0 && element.offsetHeight > 0;
  const hasChildren = element.children.length > 0;
  const hasTextContent = element.textContent?.trim().length > 0;
  const hasImages = element.querySelectorAll('img, svg').length > 0;

  const isValid = hasVisibleContent && (hasChildren || hasTextContent || hasImages);
  
  logger.log(`🔍 [Capture Debug] Validation ${elementId}:`, {
    hasVisibleContent,
    hasChildren,
    hasTextContent,
    hasImages,
    isValid
  });

  return isValid;
};

export const getElementInfo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return null;

  return {
    id: elementId,
    width: element.offsetWidth,
    height: element.offsetHeight,
    childrenCount: element.children.length,
    textContent: element.textContent?.substring(0, 50),
    innerHTML: element.innerHTML.substring(0, 100)
  };
};
