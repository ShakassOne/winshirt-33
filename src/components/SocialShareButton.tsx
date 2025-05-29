
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  url,
  title,
  description = "",
  className = ""
}) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        });
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullUrl);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papiers",
        });
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      <Share2 className="h-4 w-4" />
      Partager
    </Button>
  );
};
