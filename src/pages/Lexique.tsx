import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BookOpen } from 'lucide-react';

const Lexique = () => {
  const terms = [
    {
      term: 'WinShirt',
      definition:
        "Plateforme de personnalisation de t-shirts combinée à un système de loteries.",
    },
    {
      term: 'Loterie',
      definition:
        "Tirage au sort associé à certains achats permettant de remporter des lots.",
    },
    {
      term: 'Produit',
      definition:
        "Article vendu sur le site, souvent personnalisable selon vos envies.",
    },
    {
      term: 'Design',
      definition:
        "Visuel pouvant être appliqué sur un t-shirt personnalisé.",
    },
    {
      term: 'Mockup',
      definition:
        "Aperçu numérique d’un produit permettant de prévisualiser la personnalisation.",
    },
    {
      term: 'DTF',
      definition:
        "Technique d’impression Direct To Film utilisée pour réaliser les motifs.",
    },
    {
      term: 'Panier',
      definition:
        "Espace où sont regroupés vos articles avant le paiement.",
    },
    {
      term: 'Commande',
      definition:
        "Ensemble des articles achetés et des informations de livraison.",
    },
    {
      term: 'Compte',
      definition:
        "Section personnelle permettant de suivre vos commandes et loteries.",
    },
    {
      term: 'Admin',
      definition:
        "Interface de gestion du site réservée aux utilisateurs autorisés.",
    },
    {
      term: 'Supabase',
      definition:
        "Service backend utilisé pour la base de données et l’authentification.",
    },
    {
      term: 'Stripe',
      definition:
        "Fournisseur de paiement sécurisé employé pour traiter les transactions.",
    },
    {
      term: 'Thème',
      definition:
        "Paramètres permettant de personnaliser l’apparence du site.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Lexique <span className="text-gradient">WinShirt</span>
              </h1>
              <p className="text-lg text-white/70">
                Découvrez la définition des principaux termes de l’application.
              </p>
            </div>
            <div className="space-y-4">
              {terms.map((item, index) => (
                <div key={index} className="glass-card p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-winshirt-purple" />
                    {item.term}
                  </h3>
                  <p className="text-white/80">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Lexique;
