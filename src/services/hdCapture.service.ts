
interface CustomizationData {
  customText?: string;
  textColor?: string;
  textFont?: string;
  designName?: string;
  designUrl?: string;
  selectedSize?: string;
  selectedColor?: string;
  hdRectoUrl?: string;
  hdVersoUrl?: string;
  hdCaptureTimestamp?: string;
  // Support pour les nouvelles structures
  frontDesign?: any;
  backDesign?: any;
  frontText?: any;
  backText?: any;
}

export const enrichCustomizationWithHD = async (
  baseCustomization: any,
  hdData: { hdRectoUrl?: string; hdVersoUrl?: string }
): Promise<CustomizationData> => {
  const enrichedData: CustomizationData = {
    ...baseCustomization,
    hdRectoUrl: hdData.hdRectoUrl,
    hdVersoUrl: hdData.hdVersoUrl,
    hdCaptureTimestamp: new Date().toISOString()
  };

  console.log('🔄 [HDCapture Service] Données enrichies:', enrichedData);
  
  return enrichedData;
};

export const validateHDUrls = (hdData: { hdRectoUrl?: string; hdVersoUrl?: string }): boolean => {
  const hasValidUrl = hdData.hdRectoUrl || hdData.hdVersoUrl;
  
  if (!hasValidUrl) {
    console.warn('⚠️ [HDCapture Service] Aucune URL HD valide trouvée');
    return false;
  }
  
  console.log('✅ [HDCapture Service] URLs HD validées:', hdData);
  return true;
};

export const extractHDUrlsFromCustomization = (customization: any): { hdRectoUrl?: string; hdVersoUrl?: string } => {
  if (!customization) return {};
  
  // Extraire directement si présent
  if (customization.hdRectoUrl || customization.hdVersoUrl) {
    return {
      hdRectoUrl: customization.hdRectoUrl,
      hdVersoUrl: customization.hdVersoUrl
    };
  }
  
  // Extraire depuis les designs si structure nouvelle
  const result: { hdRectoUrl?: string; hdVersoUrl?: string } = {};
  
  if (customization.frontDesign?.hdUrl) {
    result.hdRectoUrl = customization.frontDesign.hdUrl;
  }
  
  if (customization.backDesign?.hdUrl) {
    result.hdVersoUrl = customization.backDesign.hdUrl;
  }
  
  return result;
};
