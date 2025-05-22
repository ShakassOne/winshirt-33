
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Instagram, Share2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SocialNetwork } from '@/types/supabase.types';

interface SocialShareProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  title,
  description,
  url,
  image,
  className = ''
}) => {
  const { data: socialNetworks, isLoading } = useQuery({
    queryKey: ['socialNetworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_networks')
        .select('*')
        .eq('is_active', true)
        .order('priority');
      
      if (error) throw error;
      return data || [];
    }
  });

  const getShareUrl = (network: SocialNetwork) => {
    if (!network.url) {
      // Default share URLs
      switch (network.icon) {
        case 'facebook':
          return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        case 'twitter':
          return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        case 'linkedin':
          return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        case 'mail':
          return `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`;
        default:
          return `https://www.addtoany.com/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
      }
    } else {
      // Custom URL with parameters
      return `${network.url}${network.url.includes('?') ? '&' : '?'}url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'facebook':
        return <Facebook size={18} />;
      case 'twitter':
        return <Twitter size={18} />;
      case 'linkedin':
        return <Linkedin size={18} />;
      case 'instagram':
        return <Instagram size={18} />;
      case 'mail':
        return <Mail size={18} />;
      default:
        return <Share2 size={18} />;
    }
  };

  const handleShare = (network: SocialNetwork) => {
    const shareUrl = getShareUrl(network);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Fallback when no social networks are available
  const defaultNetworks = [
    { id: 'facebook', name: 'Facebook', icon: 'facebook', is_active: true, priority: 1 },
    { id: 'twitter', name: 'Twitter', icon: 'twitter', is_active: true, priority: 2 },
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', is_active: true, priority: 3 }
  ];

  const networks = socialNetworks?.length ? socialNetworks : defaultNetworks;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm font-medium mr-2">Partager:</span>
      
      {networks.map((network) => (
        <Button
          key={network.id}
          variant="outline"
          size="sm"
          className="rounded-full w-8 h-8 p-0 flex items-center justify-center"
          onClick={() => handleShare(network as SocialNetwork)}
          title={`Partager sur ${network.name}`}
        >
          {getIcon(network.icon)}
        </Button>
      ))}
    </div>
  );
};

export default SocialShare;
