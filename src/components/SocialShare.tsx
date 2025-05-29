
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Share2 } from 'lucide-react';

interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  url: string;
  is_active: boolean;
  priority: number;
}

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'default' | 'outline';
}

export const SocialShare: React.FC<SocialShareProps> = ({ 
  url, 
  title, 
  description = "",
  variant = 'default'
}) => {
  const { data: socialNetworks } = useQuery({
    queryKey: ['socialNetworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_networks')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: true });
      
      if (error) throw error;
      return data as SocialNetwork[];
    },
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  const getShareUrl = (network: SocialNetwork) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    switch (network.name.toLowerCase()) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      case 'instagram':
        // Instagram ne supporte pas le partage direct d'URLs, on redirige vers leur profil
        return network.url;
      default:
        return network.url;
    }
  };

  const handleShare = (network: SocialNetwork) => {
    const shareUrl = getShareUrl(network);
    
    if (network.name.toLowerCase() === 'instagram') {
      // Pour Instagram, ouvrir dans un nouvel onglet
      window.open(shareUrl, '_blank');
    } else {
      // Pour les autres réseaux, ouvrir la popup de partage
      const popup = window.open(
        shareUrl,
        'share-popup',
        'width=600,height=400,scrollbars=yes,resizable=yes'
      );
      
      if (popup) {
        popup.focus();
      }
    }
  };

  if (!socialNetworks || socialNetworks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {socialNetworks.map((network) => (
        <Button
          key={network.id}
          variant={variant}
          size="sm"
          onClick={() => handleShare(network)}
          className="flex items-center gap-2"
        >
          {getIconComponent(network.icon)}
          <span className="hidden sm:inline">{network.name}</span>
        </Button>
      ))}
    </div>
  );
};
