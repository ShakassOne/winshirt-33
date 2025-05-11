import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HexColorPicker } from 'react-colorful';
import { ChevronLeft, ChevronRight, Heart, Moon, Paintbrush, Save, Sun, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

const ThemeSettings = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState('#9b87f5');
  const [accentColor, setAccentColor] = useState('#33C3F0');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [starDensity, setStarDensity] = useState([50]);
  const [borderRadius, setBorderRadius] = useState([12]);
  const [glassMorphismIntensity, setGlassMorphismIntensity] = useState([5]);
  const [selectedTab, setSelectedTab] = useState('colors');

  const handleSaveTheme = () => {
    toast({
      title: "Thème sauvegardé",
      description: "Les modifications ont été appliquées avec succès.",
    });
  };

  // Helper function to convert slider value to number
  const getNumericValue = (value: number[]): number => {
    return value[0] || 0;
  };

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
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Paintbrush className="h-4 w-4" />
                <span className="hidden sm:inline">Couleurs</span>
              </TabsTrigger>
              <TabsTrigger value="background" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Arrière-plan</span>
              </TabsTrigger>
              <TabsTrigger value="ui" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Interface</span>
              </TabsTrigger>
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
                  <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                  <div className="flex items-center gap-2 mt-4">
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                    <div 
                      className="h-9 w-9 rounded-md border" 
                      style={{ backgroundColor: primaryColor }} 
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
                  <HexColorPicker color={accentColor} onChange={setAccentColor} />
                  <div className="flex items-center gap-2 mt-4">
                    <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                    <div 
                      className="h-9 w-9 rounded-md border" 
                      style={{ backgroundColor: accentColor }} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Mode d'affichage</CardTitle>
                  <CardDescription>Choisissez entre un thème clair et sombre</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className={`relative p-4 rounded-lg border ${theme === 'dark' ? 'border-primary' : 'border-border'} bg-card w-40 h-40`}>
                      <div className="absolute right-2 top-2">
                        {theme === 'dark' && <Moon className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="w-full h-2 bg-primary/20 rounded-full mb-2">
                        <div className="h-full w-3/4 bg-primary rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded-full" />
                        <div className="h-2 w-3/4 bg-muted rounded-full" />
                      </div>
                      <p className="text-xs mt-4 text-muted-foreground">Mode sombre</p>
                    </div>

                    <div className={`relative p-4 rounded-lg border ${theme === 'light' ? 'border-primary' : 'border-border'} bg-card w-40 h-40`}>
                      <div className="absolute right-2 top-2">
                        {theme === 'light' && <Sun className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="w-full h-2 bg-primary/20 rounded-full mb-2">
                        <div className="h-full w-3/4 bg-primary rounded-full" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded-full" />
                        <div className="h-2 w-3/4 bg-muted rounded-full" />
                      </div>
                      <p className="text-xs mt-4 text-muted-foreground">Mode clair</p>
                    </div>
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
                        value={backgroundImage}
                        onChange={(e) => setBackgroundImage(e.target.value)}
                        placeholder="https://example.com/background.jpg"
                      />
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Parcourir
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Densité des étoiles</Label>
                    <div className="mt-6">
                      <Slider
                        value={starDensity}
                        max={100}
                        step={1}
                        onValueChange={setStarDensity}
                      />
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">Faible</span>
                        <span className="text-xs text-muted-foreground">{starDensity}%</span>
                        <span className="text-xs text-muted-foreground">Élevée</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['bg-1.jpg', 'bg-2.jpg', 'bg-3.jpg', 'bg-4.jpg'].map((bg, i) => (
                    <div 
                      key={i} 
                      className="h-24 rounded-lg bg-cover bg-center cursor-pointer border-2 border-transparent hover:border-primary transition-all"
                      style={{ 
                        backgroundImage: `url(https://source.unsplash.com/random/300x200?space,${i})`,
                      }}
                      onClick={() => setBackgroundImage(`https://source.unsplash.com/random/1920x1080?space,${i}`)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Prévisualisation</CardTitle>
                <CardDescription>
                  Aperçu de l'arrière-plan avec vos paramètres actuels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="h-48 rounded-lg relative overflow-hidden border"
                  style={{ 
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!backgroundImage && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {!backgroundImage && (
                      <p className="text-muted-foreground">Aucune image sélectionnée</p>
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
                        value={borderRadius}
                        max={20}
                        step={1}
                        onValueChange={setBorderRadius}
                      />
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">Anguleux</span>
                        <span className="text-xs text-muted-foreground">{getNumericValue(borderRadius)}px</span>
                        <span className="text-xs text-muted-foreground">Arrondi</span>
                      </div>
                    </div>

                    <div className="h-24 flex items-center justify-center">
                      <div 
                        className="w-24 h-24 bg-card border" 
                        style={{ borderRadius: `${getNumericValue(borderRadius)}px` }}
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
                        value={glassMorphismIntensity}
                        max={10}
                        step={1}
                        onValueChange={setGlassMorphismIntensity}
                      />
                      <div className="flex justify-between mt-1.5">
                        <span className="text-xs text-muted-foreground">Discret</span>
                        <span className="text-xs text-muted-foreground">{getNumericValue(glassMorphismIntensity)}</span>
                        <span className="text-xs text-muted-foreground">Intense</span>
                      </div>
                    </div>

                    <div className="h-24 flex items-center justify-center">
                      <div 
                        className="w-24 h-24 border" 
                        style={{ 
                          backdropFilter: `blur(${getNumericValue(glassMorphismIntensity) * 2}px)`,
                          backgroundColor: `rgba(255, 255, 255, ${getNumericValue(glassMorphismIntensity) * 0.01})`,
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border p-4 rounded-lg text-center space-y-4">
                      <Button className="w-full">
                        Bouton
                      </Button>
                      <p className="text-xs text-muted-foreground">Standard</p>
                    </div>
                    
                    <div className="border p-4 rounded-lg text-center space-y-4">
                      <Button variant="outline" className="w-full">
                        Bouton
                      </Button>
                      <p className="text-xs text-muted-foreground">Contour</p>
                    </div>
                    
                    <div className="border p-4 rounded-lg text-center space-y-4">
                      <Button className="w-full bg-gradient-to-r from-winshirt-purple to-winshirt-blue">
                        Bouton
                      </Button>
                      <p className="text-xs text-muted-foreground">Dégradé</p>
                    </div>
                    
                    <div className="border p-4 rounded-lg text-center space-y-4">
                      <Button variant="ghost" className="w-full">
                        Bouton
                      </Button>
                      <p className="text-xs text-muted-foreground">Transparent</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label htmlFor="button-style">Style par défaut</Label>
                    <Select defaultValue="gradient">
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
          <Button onClick={handleSaveTheme} className="bg-gradient-to-r from-winshirt-purple to-winshirt-blue">
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
