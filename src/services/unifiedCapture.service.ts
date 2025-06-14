import logger from '@/utils/logger';

/**
 * Example of the URLs saved for a customized order.
 *
 * ```json
 * {
 *   "mockupRectoUrl": "https://media.winshirt.fr/mockups/recto_123.png",
 *   "mockupVersoUrl": "https://media.winshirt.fr/mockups/verso_123.png",
 *   "hdRectoUrl": "https://media.winshirt.fr/hd/recto_123.png",
 *   "hdVersoUrl": "https://media.winshirt.fr/hd/verso_123.png"
 * }
 * ```
 *
 * Each order stores these URLs for both sides when customization is present.
 */

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
  
  // Support pour les nouvelles URLs HD (structure unifiée)
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
  logger.log('🔄 [UnifiedCapture Service] Enrichissement des données...');
  logger.log('📋 [UnifiedCapture Service] Base:', baseCustomization);
  logger.log('📸 [UnifiedCapture Service] Captures:', captures);
  
  // Vérifier que captures existe et a la bonne structure
  const frontCapture = captures?.front || {};
  const backCapture = captures?.back || {};
  
  const enriched: UnifiedCustomizationData = {
    ...baseCustomization,
    // URLs de mockup (preview basse définition)
    mockupRectoUrl: frontCapture.mockupUrl || null,
    mockupVersoUrl: backCapture.mockupUrl || null,
    // URLs HD (production)
    hdRectoUrl: frontCapture.hdUrl || null,
    hdVersoUrl: backCapture.hdUrl || null,
    // Nouvelles colonnes en base (structure unifiée)
    visual_front_url: frontCapture.hdUrl || null,
    visual_back_url: backCapture.hdUrl || null,
  };

  logger.log('✅ [UnifiedCapture Service] Données enrichies:', enriched);
  
  // Vérifier que les URLs ont été correctement assignées
  if (enriched.hdRectoUrl) {
    logger.log('✅ [UnifiedCapture Service] URL HD Recto générée:', enriched.hdRectoUrl);
  }
  if (enriched.hdVersoUrl) {
    logger.log('✅ [UnifiedCapture Service] URL HD Verso générée:', enriched.hdVersoUrl);
  }
  
  return enriched;
};

export const validateUnifiedCustomization = (customization: any): boolean => {
  if (!customization) {
    console.warn('⚠️ [UnifiedCapture Service] Customization vide');
    return false;
  }
  
  // Vérifier la nouvelle structure
  const hasNewStructure = customization?.frontDesign || customization?.backDesign || 
                         customization?.frontText || customization?.backText;
  
  // Vérifier l'ancienne structure (rétrocompatibilité)
  const hasOldStructure = customization?.customText || customization?.designName;
  
  const isValid = hasNewStructure || hasOldStructure;
  
  if (hasNewStructure) {
    logger.log('✅ [UnifiedCapture Service] Structure moderne détectée');
  } else if (hasOldStructure) {
    logger.log('✅ [UnifiedCapture Service] Structure legacy détectée');
  } else {
    console.warn('⚠️ [UnifiedCapture Service] Aucune personnalisation valide trouvée');
  }
  
  return isValid;
};

export const extractCaptureUrls = (customization: any) => {
  const urls = {
    mockupRectoUrl: customization?.mockupRectoUrl || null,
    mockupVersoUrl: customization?.mockupVersoUrl || null,
    hdRectoUrl: customization?.hdRectoUrl || customization?.visual_front_url || null,
    hdVersoUrl: customization?.hdVersoUrl || customization?.visual_back_url || null,
  };
  
  logger.log('📤 [UnifiedCapture Service] URLs extraites:', urls);
  return urls;
};
