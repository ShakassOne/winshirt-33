
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search, Edit2, Trash2 } from 'lucide-react';

const LexiqueAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingTerm, setIsAddingTerm] = useState(false);
  const [newTerm, setNewTerm] = useState({ word: '', definition: '', category: '' });

  // Mock data pour le lexique
  const lexiqueTerms = [
    {
      id: 1,
      word: "DTF",
      definition: "Direct To Film - Technique d'impression numérique permettant de transférer des designs sur textile",
      category: "Impression"
    },
    {
      id: 2,
      word: "Mockup",
      definition: "Modèle 3D permettant de visualiser un produit avant sa production",
      category: "Design"
    },
    {
      id: 3,
      word: "Sublimation",
      definition: "Procédé d'impression utilisant la chaleur pour faire pénétrer l'encre dans les fibres",
      category: "Impression"
    }
  ];

  const filteredTerms = lexiqueTerms.filter(term =>
    term.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTerm = () => {
    // Logic pour ajouter un nouveau terme
    console.log('Ajout du terme:', newTerm);
    setNewTerm({ word: '', definition: '', category: '' });
    setIsAddingTerm(false);
  };

  return (
    <div className="container mx-auto py-8 pt-32">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Gestion du Lexique</h1>
        </div>
        <p className="text-muted-foreground">
          Gérez les termes et définitions du glossaire de votre plateforme
        </p>
      </div>

      {/* Barre de recherche et actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un terme, définition ou catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsAddingTerm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un terme
        </Button>
      </div>

      {/* Formulaire d'ajout */}
      {isAddingTerm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ajouter un nouveau terme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Terme</label>
                <Input
                  placeholder="Ex: DTF"
                  value={newTerm.word}
                  onChange={(e) => setNewTerm({ ...newTerm, word: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Catégorie</label>
                <Input
                  placeholder="Ex: Impression"
                  value={newTerm.category}
                  onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Définition</label>
              <Textarea
                placeholder="Définition complète du terme..."
                value={newTerm.definition}
                onChange={(e) => setNewTerm({ ...newTerm, definition: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddTerm}>Ajouter</Button>
              <Button variant="outline" onClick={() => setIsAddingTerm(false)}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des termes */}
      <div className="grid gap-4">
        {filteredTerms.map((term) => (
          <Card key={term.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">{term.word}</h3>
                  <Badge variant="secondary">{term.category}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{term.definition}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun terme trouvé</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Aucun terme ne correspond à votre recherche.' : 'Commencez par ajouter des termes au lexique.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LexiqueAdmin;
