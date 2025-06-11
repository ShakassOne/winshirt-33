
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useWinShirtTheme } from "./theme-provider-wrapper";

export function UnifiedThemeToggle() {
  const { theme, setTheme } = useWinShirtTheme();

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="rounded-full w-12 h-12 text-white/80 hover:text-white hover:bg-white/10"
      title={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
    >
      {theme === "light" ? (
        <Moon className="h-6 w-6" />
      ) : (
        <Sun className="h-6 w-6" />
      )}
      <span className="sr-only">Changer de thème</span>
    </Button>
  );
}
