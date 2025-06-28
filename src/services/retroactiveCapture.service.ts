
import logger from '@/utils/logger';
import { productionCaptureService } from './productionCapture.service';
import { supabase } from '@/integrations/supabase/client';

interface RetroactiveCaptureResult {
  orderId: string;
  success: boolean;
  frontUrl?: string;
  backUrl?: string;
  error?: string;
}

class RetroactiveCaptureService {
  private createTemporaryElements(customization: any, orderId: string): void {
    // Nettoyer les éléments existants
    this.cleanupTemporaryElements(orderId);

    // Créer les conteneurs temporaires pour la capture
    const frontContainer = document.createElement('div');
    frontContainer.id = `production-front-only-${orderId}`;
    frontContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 2400px;
      height: 3200px;
      background: transparent;
      overflow: hidden;
    `;

    const backContainer = document.createElement('div');
    backContainer.id = `production-back-only-${orderId}`;
    backContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: 2400px;
      height: 3200px;
      background: transparent;
      overflow: hidden;
    `;

    // Ajouter le contenu selon la customization
    if (customization?.frontDesign || customization?.frontText) {
      this.renderCustomizationInContainer(frontContainer, customization, 'front');
    }

    if (customization?.backDesign || customization?.backText) {
      this.renderCustomizationInContainer(backContainer, customization, 'back');
    }

    document.body.appendChild(frontContainer);
    document.body.appendChild(backContainer);
  }

  private renderCustomizationInContainer(container: HTMLElement, customization: any, side: 'front' | 'back') {
    const design = side === 'front' ? customization.frontDesign : customization.backDesign;
    const text = side === 'front' ? customization.frontText : customization.backText;
    const scale = 6; // Scale pour HD

    // Rendu du design
    if (design) {
      const designElement = document.createElement('div');
      designElement.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) translate(${design.transform.position.x * scale}px, ${design.transform.position.y * scale}px) scale(${design.transform.scale * scale}) rotate(${design.transform.rotation}deg);
        transform-origin: center;
        z-index: 10;
      `;

      if (design.designUrl.startsWith('data:image/svg+xml')) {
        // SVG base64
        const svgContent = atob(design.designUrl.split(',')[1]);
        designElement.innerHTML = svgContent;
      } else {
        // Image normale
        const img = document.createElement('img');
        img.src = design.designUrl;
        img.style.cssText = `
          width: ${200 * scale}px;
          height: ${200 * scale}px;
          object-fit: contain;
        `;
        img.crossOrigin = 'anonymous';
        designElement.appendChild(img);
      }

      container.appendChild(designElement);
    }

    // Rendu du texte
    if (text && text.content) {
      const textElement = document.createElement('div');
      textElement.textContent = text.content;
      
      let textShadow = 'none';
      if (text.shadow?.enabled) {
        textShadow = `${text.shadow.offsetX * scale}px ${text.shadow.offsetY * scale}px ${text.shadow.blur * scale}px ${text.shadow.color}`;
      }

      textElement.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) translate(${text.transform.position.x * scale}px, ${text.transform.position.y * scale}px) scale(${text.transform.scale * scale}) rotate(${text.transform.rotation}deg);
        transform-origin: center;
        font-family: ${text.font};
        color: ${text.color};
        font-size: ${24 * scale}px;
        font-weight: ${text.styles.bold ? 'bold' : 'normal'};
        font-style: ${text.styles.italic ? 'italic' : 'normal'};
        text-decoration: ${text.styles.underline ? 'underline' : 'none'};
        text-shadow: ${textShadow};
        z-index: 20;
        line-height: 1.2;
        white-space: nowrap;
      `;

      container.appendChild(textElement);
    }
  }

  private cleanupTemporaryElements(orderId: string): void {
    const frontElement = document.getElementById(`production-front-only-${orderId}`);
    const backElement = document.getElementById(`production-back-only-${orderId}`);
    
    if (frontElement) frontElement.remove();
    if (backElement) backElement.remove();
  }

  async regenerateHDFiles(orderId: string): Promise<RetroactiveCaptureResult> {
    try {
      logger.log(`🔄 [RetroactiveCapture] Début régénération HD pour commande ${orderId}`);

      // Récupérer les données de la commande
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            products:product_id(*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (orderError || !orderData) {
        throw new Error(`Commande non trouvée: ${orderError?.message}`);
      }

      // Trouver le premier item avec customization
      const itemWithCustomization = orderData.items?.find((item: any) => item.customization);
      
      if (!itemWithCustomization) {
        throw new Error('Aucune customisation trouvée pour cette commande');
      }

      const customization = itemWithCustomization.customization;
      logger.log(`📋 [RetroactiveCapture] Customization trouvée:`, customization);

      // Créer les éléments temporaires
      this.createTemporaryElements(customization, orderId);

      // Attendre que les éléments soient prêts
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capturer avec le service optimisé en modifiant temporairement les IDs
      const originalCaptureMethod = productionCaptureService.captureForProduction;
      
      // Override temporaire pour utiliser nos IDs spécifiques
      const customCaptureMethod = async (customizationData: any) => {
        const results: { frontUrl?: string; backUrl?: string } = {};

        const hasFrontContent = customizationData?.frontDesign || customizationData?.frontText;
        const hasBackContent = customizationData?.backDesign || customizationData?.backText;

        if (hasFrontContent) {
          // @ts-ignore - Accès aux méthodes privées temporairement
          results.frontUrl = await productionCaptureService.captureHDElement(`production-front-only-${orderId}`);
        }

        if (hasBackContent) {
          // @ts-ignore - Accès aux méthodes privées temporairement
          results.backUrl = await productionCaptureService.captureHDElement(`production-back-only-${orderId}`);
        }

        return results;
      };

      const captureResult = await customCaptureMethod(customization);

      // Nettoyer les éléments temporaires
      this.cleanupTemporaryElements(orderId);

      // Mettre à jour les URLs en base si on a des résultats
      if (captureResult.frontUrl || captureResult.backUrl) {
        const updateData: any = {};
        if (captureResult.frontUrl) updateData.visual_front_url = captureResult.frontUrl;
        if (captureResult.backUrl) updateData.visual_back_url = captureResult.backUrl;

        const { error: updateError } = await supabase
          .from('order_items')
          .update(updateData)
          .eq('id', itemWithCustomization.id);

        if (updateError) {
          logger.log(`⚠️ [RetroactiveCapture] Erreur mise à jour BDD: ${updateError.message}`);
        } else {
          logger.log(`✅ [RetroactiveCapture] URLs mises à jour en BDD`);
        }
      }

      logger.log(`✅ [RetroactiveCapture] Régénération terminée pour ${orderId}`);

      return {
        orderId,
        success: true,
        frontUrl: captureResult.frontUrl,
        backUrl: captureResult.backUrl
      };

    } catch (error) {
      console.error(`❌ [RetroactiveCapture] Erreur pour commande ${orderId}:`, error);
      
      // Nettoyer en cas d'erreur
      this.cleanupTemporaryElements(orderId);

      return {
        orderId,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  async batchRegenerateHDFiles(orderIds: string[]): Promise<RetroactiveCaptureResult[]> {
    const results: RetroactiveCaptureResult[] = [];
    
    logger.log(`🚀 [RetroactiveCapture] Début traitement batch de ${orderIds.length} commandes`);

    // Traitement séquentiel pour éviter la surcharge
    for (const orderId of orderIds) {
      const result = await this.regenerateHDFiles(orderId);
      results.push(result);
      
      // Pause entre chaque traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    logger.log(`🎉 [RetroactiveCapture] Traitement batch terminé`);
    return results;
  }
}

export const retroactiveCaptureService = new RetroactiveCaptureService();
