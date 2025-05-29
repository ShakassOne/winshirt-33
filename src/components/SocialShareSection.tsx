
import { SocialShare } from "@/components/SocialShare";

interface SocialShareSectionProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export const SocialShareSection = ({ 
  url, 
  title, 
  description,
  className = ""
}: SocialShareSectionProps) => {
  return (
    <div className={`mt-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-3">Partager</h3>
      <SocialShare 
        url={url}
        title={title}
        description={description}
        variant="outline"
      />
    </div>
  );
};
