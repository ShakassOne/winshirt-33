
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchThemeSettings, saveThemeSettings, applyThemeSettings, ThemeSettings } from '@/services/themeSettings.service';
import { useToast } from '@/components/ui/use-toast';

export const useThemeSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error
  } = useQuery({
    queryKey: ['themeSettings'],
    queryFn: fetchThemeSettings,
  });

  const saveMutation = useMutation({
    mutationFn: saveThemeSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['themeSettings'], data);
      applyThemeSettings(data);
      toast({
        title: "Thème sauvegardé",
        description: "Les modifications ont été appliquées avec succès.",
      });
    },
    onError: (error) => {
      console.error('Failed to save theme settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de thème",
        variant: "destructive",
      });
    },
  });

  const applySettingsOnLoad = (settingsToApply: ThemeSettings) => {
    applyThemeSettings(settingsToApply);
  };

  return {
    settings,
    isLoading,
    error,
    saveSettings: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    applySettingsOnLoad,
  };
};
