
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SocialNetwork } from "@/types/supabase.types";
import { fetchActiveSocialNetworks } from "@/services/api.service";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

interface SocialShareProps {
  url: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: "default" | "compact" | "outline";
}

// Map of social network icons
const socialIcons = {
  facebook: <Facebook className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
  instagram: <Instagram className="h-5 w-5" />,
};

export const SocialShare = ({ 
  url, 
  title = "", 
  description = "",
  className = "",
  variant = "default"
}: SocialShareProps) => {
  const [socialNetworks, setSocialNetworks] = useState<SocialNetwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate the full URL if the url provided is a relative path
  const getFullUrl = (path: string) => {
    if (path.startsWith('http')) {
      return path;
    }
    return `${window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Format the URL with the appropriate parameters
  const formatSocialUrl = (baseUrl: string | null, networkName: string) => {
    if (!baseUrl) return "#";
    
    const fullUrl = getFullUrl(url);
    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    if (networkName.toLowerCase() === 'twitter') {
      return `${baseUrl}${encodedUrl}&text=${encodedTitle}`;
    } else if (networkName.toLowerCase() === 'facebook') {
      return `${baseUrl}${encodedUrl}`;
    } else if (networkName.toLowerCase() === 'linkedin') {
      return `${baseUrl}${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
    }
    
    return `${baseUrl}${encodedUrl}`;
  };

  useEffect(() => {
    const loadSocialNetworks = async () => {
      try {
        setIsLoading(true);
        const networks = await fetchActiveSocialNetworks();
        setSocialNetworks(networks);
      } catch (error) {
        console.error("Error loading social networks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSocialNetworks();
  }, []);

  if (isLoading || socialNetworks.length === 0) {
    return null;
  }

  // Render different variants
  if (variant === "compact") {
    return (
      <div className={`flex space-x-2 items-center ${className}`}>
        {socialNetworks.map((network) => (
          <a
            key={network.id}
            href={formatSocialUrl(network.url, network.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Share on ${network.name}`}
          >
            {socialIcons[network.icon as keyof typeof socialIcons]}
          </a>
        ))}
      </div>
    );
  }

  if (variant === "outline") {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {socialNetworks.map((network) => (
          <Button
            key={network.id}
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-2"
          >
            <a
              href={formatSocialUrl(network.url, network.name)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${network.name}`}
            >
              {socialIcons[network.icon as keyof typeof socialIcons]}
              <span>{network.name}</span>
            </a>
          </Button>
        ))}
      </div>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <h4 className="text-sm font-semibold mb-2">Partager</h4>
        <div className="flex flex-wrap gap-2">
          {socialNetworks.map((network) => (
            <Button
              key={network.id}
              variant="outline"
              size="sm"
              asChild
              className="flex items-center gap-2"
            >
              <a
                href={formatSocialUrl(network.url, network.name)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Share on ${network.name}`}
              >
                {socialIcons[network.icon as keyof typeof socialIcons]}
                <span>{network.name}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
