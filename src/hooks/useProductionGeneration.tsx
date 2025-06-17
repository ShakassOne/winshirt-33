
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import logger from '@/utils/logger';

interface ProductionGenerationResult {
  mockupUrl?: string;
  hdUrl?: string;
}

interface ProductionGenerationAllResult {
  front: ProductionGenerationResult;
  back: ProductionGenerationResult;
}

export const useProductionGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProductionFiles = useCallback(async (
    customization: any,
    mockupUrls: { front?: string; back?: string },
    productInfo: { name: string; id: string }
  ): Promise<ProductionGenerationAllResult> => {
    setIsGenerating(true);

    try {
      logger.log('🎬 [Production Generation] Début génération server-side');
      logger.log('📋 [Production Generation] Customization:', customization);
      logger.log('🖼️ [Production Generation] Mockup URLs:', mockupUrls);

      const { data, error } = await supabase.functions.invoke('generate-production-files', {
        body: {
          customization,
          mockupUrls,
          productInfo
        }
      });

      if (error) {
        console.error('❌ [Production Generation] Erreur Edge Function:', error);
        throw error;
      }

      logger.log('✅ [Production Generation] Fichiers générés:', data);
      return data as ProductionGenerationAllResult;
    } catch (error) {
      console.error('❌ [Production Generation] Erreur:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateProductionFiles,
    isGenerating
  };
};
