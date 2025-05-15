
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define ThemeSetting interface since it's not exported from supabase.types
interface ThemeSetting {
  id: string;
  name: string;
  value: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Define the functions that were imported but missing
const fetchThemeSettings = async (): Promise<ThemeSetting[]> => {
  const { data, error } = await supabase
    .from('theme_settings')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

const updateThemeSettings = async (
  id: string,
  updates: Partial<ThemeSetting>
): Promise<ThemeSetting> => {
  const { data, error } = await supabase
    .from('theme_settings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const ThemeSettings = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<ThemeSetting | null>(null);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [isActive, setIsActive] = useState(true);
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['themeSettings'],
    queryFn: fetchThemeSettings,
  });

  const updateSettingMutation = useMutation({
    mutationFn: (settingData: { id: string; data: any }) =>
      updateThemeSettings(settingData.id, settingData.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themeSettings'] });
      closeDialog();
      toast("Succès", { 
        description: "Les paramètres du thème ont été mis à jour" 
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la mise à jour des paramètres du thème"
      });
    }
  });

  useEffect(() => {
    if (selectedSetting) {
      setName(selectedSetting.name);
      setValue(selectedSetting.value);
      setIsActive(selectedSetting.is_active !== false);
    }
  }, [selectedSetting]);

  const openDialog = (setting: ThemeSetting) => {
    setSelectedSetting(setting);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedSetting(null);
    setName('');
    setValue('');
    setIsActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSetting) {
      await updateSettingMutation.mutateAsync({
        id: selectedSetting.id,
        data: {
          value,
          is_active: isActive,
        },
      });
    }
  };

  if (isLoading) return <div>Chargement des paramètres du thème...</div>;
  if (error) return <div>Une erreur est survenue lors du chargement des paramètres du thème.</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Paramètres du Thème</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {settings && settings.map((setting) => (
          <div key={setting.id} className="relative bg-white/5 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-2">{setting.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Valeur: {setting.value}</p>
            <div className="flex items-center justify-between">
              <Switch
                id={`setting-active-${setting.id}`}
                checked={setting.is_active !== false}
                onCheckedChange={(checked) => {
                  updateSettingMutation.mutate({
                    id: setting.id,
                    data: { is_active: checked },
                  });
                }}
              />
              <Label htmlFor={`setting-active-${setting.id}`} className="text-sm">
                {setting.is_active !== false ? 'Actif' : 'Inactif'}
              </Label>
            </div>
            <div className="absolute top-2 right-2">
              <Button variant="outline" size="icon" onClick={() => openDialog(setting)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le Paramètre du Thème</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="value">Valeur</Label>
              <Input
                type="text"
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="is_active">Paramètre actif</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                Mettre à jour
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThemeSettings;
