import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Trash2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface UserCustomization {
  id: string;
  product_name: string;
  customization: any;
  preview_url: string | null;
  hd_url: string | null;
  created_at: string;
}

export const MyCustomizationsTab = () => {
  const { user } = useOptimizedAuth();
  const [customizations, setCustomizations] = useState<UserCustomization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState<{ open: boolean; customization: UserCustomization | null }>({
    open: false,
    customization: null
  });

  useEffect(() => {
    if (user) {
      fetchCustomizations();
    }
  }, [user]);

  const fetchCustomizations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_customizations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomizations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des personnalisations:', error);
      toast.error('Erreur lors du chargement des personnalisations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (customization: UserCustomization) => {
    setPreviewModal({ open: true, customization });
  };

  const handleDownloadHD = async (customization: UserCustomization) => {
    if (!customization.hd_url) {
      toast.error('Fichier HD non disponible');
      return;
    }

    try {
      const response = await fetch(customization.hd_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${customization.product_name}-hd-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Téléchargement démarré');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleDelete = async (customizationId: string) => {
    try {
      const { error } = await supabase
        .from('user_customizations')
        .delete()
        .eq('id', customizationId);

      if (error) throw error;
      
      setCustomizations(prev => prev.filter(c => c.id !== customizationId));
      toast.success('Personnalisation supprimée');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  if (customizations.length === 0) {
    return (
      <Card className="glass-card text-center py-12">
        <CardContent>
          <Palette className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">Aucune personnalisation</h2>
          <p className="text-gray-400 mb-6">Vous n'avez pas encore créé de personnalisations.</p>
          <Button onClick={() => window.location.href = '/products'}>
            Découvrir nos produits
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customizations.map((custom) => (
          <Card key={custom.id} className="glass-card">
            <CardHeader className="p-4">
              <div className="aspect-square bg-white/5 rounded-lg mb-4 overflow-hidden">
                {custom.preview_url ? (
                  <img 
                    src={custom.preview_url} 
                    alt={custom.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Palette className="h-12 w-12" />
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-white">{custom.product_name}</h3>
                  <p className="text-sm text-white/70">
                    Créé le {new Date(custom.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <Badge variant="outline" className="bg-green-500/20 text-green-400">
                  Terminé
                </Badge>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleView(custom)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownloadHD(custom)}
                    disabled={!custom.hd_url}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    HD
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(custom.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de prévisualisation */}
      <Dialog open={previewModal.open} onOpenChange={(open) => setPreviewModal({ open, customization: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Aperçu - {previewModal.customization?.product_name}
            </DialogTitle>
          </DialogHeader>
          
          {previewModal.customization?.preview_url && (
            <div className="flex justify-center">
              <img 
                src={previewModal.customization.preview_url}
                alt="Prévisualisation"
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};