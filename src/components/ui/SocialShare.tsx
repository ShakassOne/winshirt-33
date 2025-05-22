
import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Link as LinkIcon, 
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  compact?: boolean;
}

interface SocialNetwork {
  id: string;
  name: string;
  icon: string;
  url: string;
  is_active: boolean;
  priority: number;
}

const SocialShare: React.FC<SocialShareProps> = ({ 
  title, 
  description = '', 
  url, 
  image = '', 
  compact = false 
}) => {
  // Define default social networks
  const socialNetworks: SocialNetwork[] = [
    { id: 'facebook', name: 'Facebook', icon: 'facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, is_active: true, priority: 1 },
    { id: 'twitter', name: 'Twitter', icon: 'twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, is_active: true, priority: 2 },
    { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, is_active: true, priority: 3 },
    { id: 'email', name: 'Email', icon: 'mail', url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`, is_active: true, priority: 4 }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Lien copié dans le presse-papier !");
    }).catch(() => {
      toast.error("Impossible de copier le lien");
    });
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'mail':
        return <Mail className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {socialNetworks.map((network) => (
            <DropdownMenuItem key={network.id} asChild>
              <a 
                href={network.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {getIcon(network.icon)}
                <span>Partager sur {network.name}</span>
              </a>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyToClipboard} className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span>Copier le lien</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-medium">Partager</h3>
      <div className="flex space-x-2">
        {socialNetworks.slice(0, 4).map((network) => (
          <Button
            key={network.id}
            variant="outline"
            size="icon"
            asChild
          >
            <a 
              href={network.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`Partager sur ${network.name}`}
            >
              {getIcon(network.icon)}
            </a>
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          aria-label="Copier le lien"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;
