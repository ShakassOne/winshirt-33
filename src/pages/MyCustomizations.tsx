import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Trash2 } from 'lucide-react';

const MyCustomizations = () => {
  // Mock data - en attendant l'implémentation complète
  const customizations = [
    {
      id: '1',
      productName: 'T-Shirt Premium',
      createdAt: '2024-01-10',
      previewUrl: '/placeholder.svg',
      hdUrl: '/placeholder.svg',
      status: 'completed'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Mes <span className="text-gradient">Personnalisations</span>
            </h1>
            <p className="text-white/70">
              Retrouvez toutes vos créations personnalisées
            </p>
          </div>

          {customizations.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <div className="text-white/50 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucune personnalisation</h3>
              <p className="text-white/70 mb-4">
                Vous n'avez pas encore créé de personnalisations.
              </p>
              <Button onClick={() => window.location.href = '/products'}>
                Découvrir nos produits
              </Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customizations.map((custom) => (
                <GlassCard key={custom.id} className="p-4">
                  <div className="aspect-square bg-white/5 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={custom.previewUrl} 
                      alt={custom.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-white">{custom.productName}</h3>
                      <p className="text-sm text-white/70">
                        Créé le {new Date(custom.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    
                    <Badge variant="outline" className="bg-green-500/20 text-green-400">
                      Terminé
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        HD
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyCustomizations;