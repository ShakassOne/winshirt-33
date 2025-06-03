
export interface SVGAnalysisResult {
  hasStyle: boolean;
  hasFixedSize: boolean;
  missingFill: boolean;
  needsFix: boolean;
  issues: string[];
}

export interface SVGCleanupResult {
  cleanedSvg: string;
  cleanedBlob: Blob;
  appliedFixes: string[];
}

export class SVGAnalyzerService {
  static async analyzeSVG(file: File): Promise<SVGAnalysisResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const svgContent = event.target?.result as string;
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
          
          // Vérifier les erreurs de parsing
          const errorNode = svgDoc.querySelector("parsererror");
          if (errorNode) {
            reject(new Error("SVG invalide - impossible de parser le fichier"));
            return;
          }

          const svg = svgDoc.querySelector("svg");
          if (!svg) {
            reject(new Error("Aucune balise SVG trouvée dans le fichier"));
            return;
          }

          // Analyse des problèmes
          const hasStyle = svgDoc.querySelectorAll("style").length > 0;
          const hasFixedSize = svg.hasAttribute("width") || svg.hasAttribute("height");
          const paths = svgDoc.querySelectorAll("path, g");
          const missingFill = Array.from(paths).some(el => !el.hasAttribute("fill"));

          const issues: string[] = [];
          if (hasStyle) issues.push("Contient des balises <style>");
          if (hasFixedSize) issues.push("Dimensions fixes détectées");
          if (missingFill) issues.push("Attributs fill manquants sur certains éléments");

          const needsFix = hasStyle || hasFixedSize || missingFill;

          resolve({
            hasStyle,
            hasFixedSize,
            missingFill,
            needsFix,
            issues
          });
        } catch (error) {
          reject(new Error(`Erreur lors de l'analyse SVG: ${error}`));
        }
      };

      reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier"));
      reader.readAsText(file);
    });
  }

  static async cleanSVG(file: File): Promise<SVGCleanupResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const svgContent = event.target?.result as string;
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
          
          const svg = svgDoc.querySelector("svg");
          if (!svg) {
            reject(new Error("SVG invalide"));
            return;
          }

          const appliedFixes: string[] = [];

          // 1. Supprimer les balises <style>
          const styles = svgDoc.querySelectorAll("style");
          if (styles.length > 0) {
            styles.forEach(style => style.remove());
            appliedFixes.push(`${styles.length} balise(s) <style> supprimée(s)`);
          }

          // 2. Supprimer width et height
          if (svg.hasAttribute("width")) {
            svg.removeAttribute("width");
            appliedFixes.push("Attribut width supprimé");
          }
          if (svg.hasAttribute("height")) {
            svg.removeAttribute("height");
            appliedFixes.push("Attribut height supprimé");
          }

          // 3. Ajouter fill="currentColor" aux path et g sans fill
          const pathsAndGroups = svgDoc.querySelectorAll("path, g");
          let fillsAdded = 0;
          pathsAndGroups.forEach(el => {
            if (!el.hasAttribute("fill")) {
              el.setAttribute("fill", "currentColor");
              fillsAdded++;
            }
          });
          if (fillsAdded > 0) {
            appliedFixes.push(`fill="currentColor" ajouté à ${fillsAdded} élément(s)`);
          }

          // Sérialiser le SVG nettoyé
          const serializer = new XMLSerializer();
          const cleanedSvg = serializer.serializeToString(svgDoc);
          const cleanedBlob = new Blob([cleanedSvg], { type: "image/svg+xml" });

          resolve({
            cleanedSvg,
            cleanedBlob,
            appliedFixes
          });
        } catch (error) {
          reject(new Error(`Erreur lors du nettoyage SVG: ${error}`));
        }
      };

      reader.onerror = () => reject(new Error("Erreur lors de la lecture du fichier"));
      reader.readAsText(file);
    });
  }

  static createCleanedFile(cleanedBlob: Blob, originalName: string): File {
    const cleanedName = originalName.replace(/\.svg$/i, '_cleaned.svg');
    return new File([cleanedBlob], cleanedName, { type: "image/svg+xml" });
  }
}
