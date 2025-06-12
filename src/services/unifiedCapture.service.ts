
interface UnifiedCustomizationData {
  // Structure ancienne (rétrocompatibilité)
  customText?: string;
  textColor?: string;
  textFont?: string;
  designName?: string;
  designUrl?: string;
  selectedSize?: string;
  selectedColor?: string;
  
  // Nouvelle structure
  frontDesign?: any;
  backDesign?: any;
  frontText?: any;
  backText?: any;
  
  // URLs de capture
  mockupRectoUrl?: string;
  mockupVersoUrl?: string;
  hdRectoUrl?: string;
  hdVersoUrl?: string;
  
  // Support pour les nouvelles URLs HD
  visual_front_url?: string;
  visual_back_url?: string;
}

export const enrichCustomizationWithCaptures = (
  baseCustomization: any,
  captures: {
    front?: { mockupUrl?: string; hdUrl?: string };
    back?: { mockupUrl?: string; hdUrl?: string };
  }
): UnifiedCustomizationData => {
  // Vérifier que captures existe et a la bonne structure
  const frontCapture = captures?.front || {};
  const backCapture = captures?.back || {};
  
  const enriched: UnifiedCustomizationData = {
    ...baseCustomization,
    mockupRectoUrl: frontCapture.mockupUrl,
    mockupVersoUrl: backCapture.mockupUrl,
    hdRectoUrl: frontCapture.hdUrl,
    hdVersoUrl: backCapture.hdUrl,
    visual_front_url: frontCapture.hdUrl,
    visual_back_url: backCapture.hdUrl,
  };

  console.log('🔄 [UnifiedCapture Service] Données enrichies:', enriched);
  return enriched;
};

export const validateUnifiedCustomization = (customization: any): boolean => {
  // Vérifier la nouvelle structure
  const hasNewStructure = customization?.frontDesign || customization?.backDesign || 
                         customization?.frontText || customization?.backText;
  
  // Vérifier l'ancienne structure (rétrocompatibilité)
  const hasOldStructure = customization?.customText || customization?.designName;
  
  const isValid = hasNewStructure || hasOldStructure;
  
  if (!isValid) {
    console.warn('⚠️ [UnifiedCapture Service] Aucune personnalisation valide trouvée');
  }
  
  return isValid;
};

export const extractCaptureUrls = (customization: any) => {
  return {
    mockupRectoUrl: customization?.mockupRectoUrl,
    mockupVersoUrl: customization?.mockupVersoUrl,
    hdRectoUrl: customization?.hdRectoUrl || customization?.visual_front_url,
    hdVersoUrl: customization?.hdVersoUrl || customization?.visual_back_url,
  };
};
