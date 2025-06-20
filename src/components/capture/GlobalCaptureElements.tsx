
import React from 'react';
import { createPortal } from 'react-dom';

export const GlobalCaptureElements: React.FC = () => {
  // Créer le conteneur de capture s'il n'existe pas
  React.useEffect(() => {
    let captureRoot = document.getElementById('capture-root');
    if (!captureRoot) {
      captureRoot = document.createElement('div');
      captureRoot.id = 'capture-root';
      captureRoot.style.position = 'fixed';
      captureRoot.style.left = '-9999px';
      captureRoot.style.top = '-9999px';
      captureRoot.style.pointerEvents = 'none';
      captureRoot.style.zIndex = '-1';
      document.body.appendChild(captureRoot);
      console.log('📸 [Global Capture] Conteneur de capture créé');
    }
  }, []);

  const portalRoot = document.getElementById('capture-root');
  if (!portalRoot) {
    return null;
  }

  const content = (
    <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none z-[-1]">
      {/* Éléments de capture pour mockup avec produit (preview basse def) */}
      <div id="preview-front-complete" className="w-[400px] h-[500px] bg-white">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Element de capture front
        </div>
      </div>

      <div id="preview-back-complete" className="w-[400px] h-[500px] bg-white">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Element de capture back
        </div>
      </div>

      {/* Éléments de capture pour production HD sans produit */}
      <div id="production-front-only" className="w-[3500px] h-[3500px] bg-transparent">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Element de production front HD
        </div>
      </div>

      <div id="production-back-only" className="w-[3500px] h-[3500px] bg-transparent">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Element de production back HD
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalRoot);
};
