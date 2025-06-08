
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HexColorPicker } from 'react-colorful';
import { ChevronLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { UploadButton } from '@/components/ui/upload-button';
import { fetchThemeSettings, saveThemeSettings, applyThemeSettings, ThemeSettings } from '@/services/themeSettings.service';

const ThemeSettingsPage = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState('colors');
  
  // Theme settings state
  const [settings, setSettings] = useState<ThemeSettings>({
    primary_color: '#9b87f5',
    accent_color: '#33C3F0',
    background_image: '',
    star_density: 50,
    border_radius: 12,
    glassmorphism_intensity: 5,
    button_style: 'gradient'
  });

  // Load existing settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const existingSettings = await fetchThemeSettings();
        if (existingSettings) {
          setSettings(existingSettings);
          console.log('Loaded existing theme settings:', existingSettings);
        }
      } catch (error) {
        console.error('Failed to load theme settings:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les paramètres de thème",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleBackgroundUpload = (url: string) => {
    console.log('Background image uploaded:', url);
    setSettings(prev => ({ ...prev, background_image: url }));
    toast({
      title: "Image téléchargée",
      description: "L'image d'arrière-plan a été téléchargée avec succès",
    });
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    try {
      console.log('Saving theme settings:', settings);
      const savedSettings = await saveThemeSettings(settings);
      applyThemeSettings(savedSettings);
      
      toast({
        title: "Thème sauvegardé",
        description: "Les modifications ont été appliquées avec succès.",
      });
    } catch (error) {
      console.error('Failed to save theme settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres de thème",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof ThemeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Paramètres du thème</h1>
            <p className="text-muted-foreground">Personnalisez l'apparence de votre site</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/admin">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Retour
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="colors">Couleurs</TabsTrigger>
              <TabsTrigger value="background">Arrière-plan</TabsTrigger>
              <TabsTrigger value="ui">Interface</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="colors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Couleur primaire</CardTitle>
                  <CardDescription>
                    Définit la couleur principale de votre site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HexColorPicker 
                    color={settings.primary_color} 
                    onChange={(color) => updateSetting('primary_color', color)}
                  />
                  <div className="flex items-center gap-2 mt-4">
                    <Input 
                      value={settings.primary_color} 
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                    />
                    <div 
                      className="h-9 w-9 rounded-md border" 
                      style={{ backgroundColor: settings.primary_color }} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Couleur d'accent</CardTitle>
                  <CardDescription>
                    Utilisée pour les éléments d'interface secondaires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HexColorPicker 
                    color={settings.accent_color} 
                    onChange={(color) => updateSetting('accent_color', color)}
                  />
                  <div className="flex items-center gap-2 mt-4">
                    <Input 
                      value={settings.accent_color} 
                      onChange={(e) => updateSetting('accent_color', e.target.value)}
                    />
                    <div 
                      className="h-9 w-9 rounded-md border" 
                      style={{ backgroundColor: settings.accent_color }} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="background">
            <Card>
              <CardHeader>
                <CardTitle>Image d'arrière-plan</CardTitle>
                <CardDescription>
                  Choisissez une image pour l'arrière-plan de votre site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bg-url">URL de l'image</Label>
                    <div className="flex mt-1.5 gap-2">
                      <Input 
                        id="bg-url"
                        value={settings.background_image || ''}
                        onChange={(e) => updateSetting('background_image', e.target.value)}
                        placeholder="https://example.com/background.jpg"
                      />
                      <UploadButton
                        onUpload={handleBackgroundUpload}
                        variant="outline"
                        acceptTypes="image/*"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Densité des étoiles</Label>
                    <div className="mt-6">
                      <Slider
                        value={[settings.star_density]}
                        max={100}
                        step={1}
                        onValueChange={(value) => updateSetting('star_density', value[0])}
                      />
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">Faible</span>
                        <span className="text-xs text-muted-foreground">{settings.star_density}%</span>
                        <span className="text-xs text-muted-foreground">Élevée</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Label>Prévisualisation</Label>
                  <div 
                    className="h-48 rounded-lg relative overflow-hidden border mt-2"
                    style={{ 
                      backgroundImage: settings.background_image ? `url(${settings.background_image})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!settings.background_image && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <p className="text-muted-foreground">Aucune image sélectionnée</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ui">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bordures arrondies</CardTitle>
                  <CardDescription>
                    Ajustez le rayon des coins pour tous les éléments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Slider 
                        value={[settings.border_radius]}
                        max={20}
                        step={1}
                        onValueChange={(value) => updateSetting('border_radius', value[0])}
                      />
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">Anguleux</span>
                        <span className="text-xs text-muted-foreground">{settings.border_radius}px</span>
                        <span className="text-xs text-muted-foreground">Arrondi</span>
                      </div>
                    </div>

                    <div className="h-24 flex items-center justify-center">
                      <div 
                        className="w-24 h-24 bg-card border" 
                        style={{ borderRadius: `${settings.border_radius}px` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Effet de verre</CardTitle>
                  <CardDescription>
                    Contrôlez l'intensité de l'effet de verre (glassmorphism)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Slider 
                        value={[settings.glassmorphism_intensity]}
                        max={10}
                        step={1}
                        onValueChange={(value) => updateSetting('glassmorphism_intensity', value[0])}
                      />
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">Discret</span>
                        <span className="text-xs text-muted-foreground">{settings.glassmorphism_intensity}</span>
                        <span className="text-xs text-muted-foreground">Intense</span>
                      </div>
                    </div>

                    <div className="h-24 flex items-center justify-center">
                      <div 
                        className="w-24 h-24 border" 
                        style={{ 
                          backdropFilter: `blur(${settings.glassmorphism_intensity * 2}px)`,
                          backgroundColor: `rgba(255, 255, 255, ${settings.glassmorphism_intensity * 0.01})`,
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Style des boutons</CardTitle>
                  <CardDescription>
                    Choisissez le style des boutons de votre site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-6">
                    <Label htmlFor="button-style">Style par défaut</Label>
                    <Select 
                      value={settings.button_style} 
                      onValueChange={(value) => updateSetting('button_style', value)}
                    >
                      <SelectTrigger id="button-style" className="mt-1.5">
                        <SelectValue placeholder="Sélectionnez un style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="outline">Contour</SelectItem>
                        <SelectItem value="gradient">Dégradé</SelectItem>
                        <SelectItem value="ghost">Transparent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSaveTheme} 
            disabled={isSaving}
            className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettingsPage;
