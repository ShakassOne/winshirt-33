
import React from 'react';
import { SocialShare } from '@/components/SocialShare';
import GlassCard from '@/components/ui/GlassCard';

interface SocialShareSectionProps {
  url: string;
  title: string;
  description?: string;
}

const SocialShareSection: React.FC<SocialShareSectionProps> = ({ 
  url, 
  title, 
  description = "" 
}) => {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold mb-4">Partager</h3>
      <SocialShare 
        url={url}
        title={title}
        description={description}
        variant="outline"
      />
    </GlassCard>
  );
};

export default SocialShareSection;
