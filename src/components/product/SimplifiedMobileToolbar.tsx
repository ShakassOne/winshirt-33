
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Type, Upload, Sparkles, Palette, Settings, Paintbrush } from 'lucide-react';

interface SimplifiedMobileToolbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenFullModal: () => void;
  hasDesign?: boolean;
  isSvgDesign?: boolean;
  selectedMockupColor?: any;
}

export const SimplifiedMobileToolbar: React.FC<SimplifiedMobileToolbarProps> = ({
  activeTab,
  onTabChange,
  onOpenFullModal,
  hasDesign = false,
  isSvgDesign = false,
  selectedMockupColor
}) => {
  const tabs = [
    { id: 'designs', icon: ImageIcon, label: 'Images', enabled: true },
    { id: 'text', icon: Type, label: 'Texte', enabled: true },
    { id: 'upload', icon: Upload, label: 'Upload', enabled: true },
    { id: 'ai', icon: Sparkles, label: 'IA', enabled: true },
    { id: 'svg', icon: Paintbrush, label: 'SVG', enabled: true },
    { id: 'colors', icon: Palette, label: 'Couleurs', enabled: hasDesign || isSvgDesign || !!selectedMockupColor }
  ];

  const enabledTabs = tabs.filter(tab => tab.enabled);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/20 px-2 py-3 z-50">
      {/* Main toolbar */}
      <div className="flex justify-around items-center mb-3">
        {enabledTabs.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeTab === id ? "default" : "ghost"}
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-0 ${
              activeTab === id 
                ? 'bg-winshirt-purple text-white' 
                : 'text-white/70 hover:text-white'
            }`}
            onClick={() => onTabChange(id)}
          >
            <Icon className="h-4 w-4" />
            <span className="text-xs truncate">{label}</span>
          </Button>
        ))}
      </div>

      {/* Settings button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={onOpenFullModal}
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">Plus d'options</span>
        </Button>
      </div>
    </div>
  );
};
