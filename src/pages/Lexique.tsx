
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { BookOpen, Code, Database, Settings, Wrench, Bug, Folder, Cpu } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Lexique = () => {
  const [activeTab, setActiveTab] = useState('termes');

  const termesUtilisateur = [
    {
      term: 'WinShirt',
      definition: "Plateforme de personnalisation de t-shirts combinée à un système de loteries.",
    },
    {
      term: 'Loterie',
      definition: "Tirage au sort associé à certains achats permettant de remporter des lots.",
    },
    {
      term: 'Produit',
      definition: "Article vendu sur le site, souvent personnalisable selon vos envies.",
    },
    {
      term: 'Design',
      definition: "Visuel pouvant être appliqué sur un t-shirt personnalisé.",
    },
    {
      term: 'Mockup',
      definition: "Aperçu numérique d'un produit permettant de prévisualiser la personnalisation.",
    },
    {
      term: 'DTF',
      definition: "Technique d'impression Direct To Film utilisée pour réaliser les motifs.",
    },
    {
      term: 'Panier',
      definition: "Espace où sont regroupés vos articles avant le paiement.",
    },
    {
      term: 'Commande',
      definition: "Ensemble des articles achetés et des informations de livraison.",
    },
    {
      term: 'Compte',
      definition: "Section personnelle permettant de suivre vos commandes et loteries.",
    },
  ];

  const architectureTechnique = [
    {
      term: 'src/components/',
      definition: "Dossier contenant tous les composants React réutilisables. Organisé par catégories (layout, product, ui, admin, etc.)",
    },
    {
      term: 'src/pages/',
      definition: "Pages principales de l'application. Chaque fichier correspond à une route (Products.tsx = /products)",
    },
    {
      term: 'src/hooks/',
      definition: "Hooks personnalisés pour la logique métier réutilisable (useAuth, useCart, useQuery, etc.)",
    },
    {
      term: 'src/services/',
      definition: "Services pour communiquer avec les APIs externes et Supabase",
    },
    {
      term: 'src/context/',
      definition: "Contextes React pour partager l'état global (AuthContext, CartContext)",
    },
    {
      term: 'src/types/',
      definition: "Définitions TypeScript pour le typage strict de l'application",
    },
    {
      term: 'src/lib/',
      definition: "Utilitaires et configuration (utils.ts, queryClient.ts, config.ts)",
    },
    {
      term: 'supabase/',
      definition: "Configuration et migrations de la base de données Supabase",
    },
  ];

  const fichiersCles = [
    {
      term: 'App.tsx',
      definition: "Point d'entrée principal avec les routes React Router et les providers globaux",
    },
    {
      term: 'main.tsx',
      definition: "Initialisation de React et rendu de l'application dans le DOM",
    },
    {
      term: 'index.css',
      definition: "Styles globaux Tailwind CSS et variables CSS personnalisées pour le thème",
    },
    {
      term: 'tailwind.config.ts',
      definition: "Configuration Tailwind avec couleurs personnalisées et tokens de design",
    },
    {
      term: 'vite.config.ts',
      definition: "Configuration Vite pour le build et le développement",
    },
    {
      term: 'GlowNavigation.tsx',
      definition: "Navigation principale avec effet de glow et gestion mobile/desktop",
    },
    {
      term: 'ProductDetail.tsx',
      definition: "Page de détail produit avec personnalisation et ajout au panier",
    },
    {
      term: 'AuthContext.tsx',
      definition: "Gestion globale de l'authentification avec Supabase Auth",
    },
    {
      term: 'CartContext.tsx',
      definition: "Gestion globale du panier avec persistance locale",
    },
  ];

  const baseDonnees = [
    {
      term: 'products',
      definition: "Table des produits avec nom, prix, description, mockup_id, tickets_offered",
    },
    {
      term: 'orders',
      definition: "Commandes avec user_id, total_amount, payment_status, adresse de livraison",
    },
    {
      term: 'order_items',
      definition: "Articles d'une commande avec product_id, quantity, customization, visual_urls",
    },
    {
      term: 'lotteries',
      definition: "Loteries avec title, value, goal, participants, draw_date, is_active",
    },
    {
      term: 'lottery_entries',
      definition: "Participations aux loteries avec lottery_id, user_id, order_item_id",
    },
    {
      term: 'mockups',
      definition: "Modèles 3D avec svg_front_url, svg_back_url, print_areas, colors",
    },
    {
      term: 'designs',
      definition: "Designs prédéfinis avec name, category, image_url, is_active",
    },
    {
      term: 'profiles',
      definition: "Profils utilisateurs avec first_name, last_name, address, phone",
    },
    {
      term: 'user_roles',
      definition: "Rôles utilisateurs (user, admin, dtf_supplier) avec user_id et role",
    },
    {
      term: 'cart_items',
      definition: "Articles du panier avec product_id, customization, cart_token_id",
    },
  ];

  const services = [
    {
      term: 'api.service.ts',
      definition: "Service principal pour les appels API Supabase (CRUD produits, commandes, etc.)",
    },
    {
      term: 'cart.service.ts',
      definition: "Gestion du panier : ajout, suppression, calcul total, persistance",
    },
    {
      term: 'order.service.ts',
      definition: "Création et gestion des commandes, validation des données",
    },
    {
      term: 'lottery.service.ts',
      definition: "Logique des loteries : participation, tirage, vérification des gagnants",
    },
    {
      term: 'aiImages.service.ts',
      definition: "Génération d'images IA via OpenAI, gestion des prompts et stockage",
    },
    {
      term: 'hdCapture.service.ts',
      definition: "Capture haute définition des mockups pour la production DTF",
    },
    {
      term: 'unifiedCapture.service.ts',
      definition: "Service unifié de capture des visuels (mockup + production)",
    },
    {
      term: 'shipping.service.ts',
      definition: "Calcul des frais de port et options de livraison",
    },
  ];

  const hooksPersonnalises = [
    {
      term: 'useAuth',
      definition: "Hook d'authentification : login, logout, état utilisateur actuel",
    },
    {
      term: 'useCart',
      definition: "Gestion du panier : ajout/suppression articles, total, nombre d'items",
    },
    {
      term: 'useAdminCheck',
      definition: "Vérification des droits administrateur de l'utilisateur connecté",
    },
    {
      term: 'useProductsQuery',
      definition: "Récupération optimisée des produits avec cache et pagination",
    },
    {
      term: 'useLotteriesQuery',
      definition: "Récupération des loteries actives avec mise à jour temps réel",
    },
    {
      term: 'useUnifiedCapture',
      definition: "Capture unifiée des visuels pour mockup et production",
    },
    {
      term: 'useIsMobile',
      definition: "Détection responsive pour adapter l'interface mobile/desktop",
    },
    {
      term: 'useSimpleQuery',
      definition: "Hook générique pour les requêtes Supabase avec gestion d'erreur",
    },
  ];

  const composantsUI = [
    {
      term: 'Button',
      definition: "Bouton avec variants (default, destructive, outline, ghost) et tailles",
    },
    {
      term: 'Dialog',
      definition: "Modal/popup avec overlay, trigger et content. Base pour les modales",
    },
    {
      term: 'Sheet',
      definition: "Panneau latéral coulissant, utilisé pour les menus mobiles",
    },
    {
      term: 'Tabs',
      definition: "Onglets avec TabsList, TabsTrigger et TabsContent",
    },
    {
      term: 'Form',
      definition: "Formulaires avec validation react-hook-form et zod",
    },
    {
      term: 'Toast',
      definition: "Notifications temporaires avec Sonner (toast.success, toast.error)",
    },
    {
      term: 'ProductCard',
      definition: "Carte produit avec image, nom, prix et bouton d'action",
    },
    {
      term: 'LotteryCard',
      definition: "Carte loterie avec progression, valeur du lot et participants",
    },
  ];

  const configuration = [
    {
      term: 'VITE_SUPABASE_URL',
      definition: "URL de votre projet Supabase (dans .env)",
    },
    {
      term: 'VITE_SUPABASE_ANON_KEY',
      definition: "Clé publique Supabase pour l'authentification (dans .env)",
    },
    {
      term: 'STRIPE_SECRET_KEY',
      definition: "Clé secrète Stripe pour les paiements (secret Supabase)",
    },
    {
      term: 'OPENAI_API_KEY',
      definition: "Clé API OpenAI pour la génération d'images IA (secret Supabase)",
    },
    {
      term: 'package.json',
      definition: "Dépendances du projet : React, Vite, Tailwind, Supabase, Stripe, etc.",
    },
    {
      term: 'tsconfig.json',
      definition: "Configuration TypeScript avec paths absolus (@/components, @/hooks)",
    },
    {
      term: 'RLS Policies',
      definition: "Politiques de sécurité Supabase pour contrôler l'accès aux données",
    },
  ];

  const debugging = [
    {
      term: 'console.log',
      definition: "Logs de debug dans la console navigateur (F12 > Console)",
    },
    {
      term: 'React DevTools',
      definition: "Extension navigateur pour inspecter les composants React",
    },
    {
      term: 'Supabase Dashboard',
      definition: "Interface web pour voir les données, logs et métriques",
    },
    {
      term: 'Network Tab',
      definition: "Onglet Réseau (F12) pour voir les requêtes API et leurs réponses",
    },
    {
      term: 'Error Boundaries',
      definition: "Composants React pour capturer et afficher les erreurs",
    },
    {
      term: 'Vite HMR',
      definition: "Hot Module Replacement pour le rechargement automatique en dev",
    },
    {
      term: 'TypeScript Errors',
      definition: "Erreurs de typage affichées dans l'éditeur et la console",
    },
    {
      term: 'Build Logs',
      definition: "Logs de construction pour identifier les erreurs de build",
    },
  ];

  const renderSection = (items: any[], icon: any) => {
    const Icon = icon;
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Icon className="w-5 h-5 text-winshirt-purple" />
              {item.term}
            </h3>
            <p className="text-white/80">{item.definition}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Lexique <span className="text-gradient">WinShirt</span>
              </h1>
              <p className="text-lg text-white/70">
                Guide complet pour comprendre et maîtriser l'application WinShirt
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
                <TabsTrigger value="termes" className="text-xs">Termes</TabsTrigger>
                <TabsTrigger value="architecture" className="text-xs">Architecture</TabsTrigger>
                <TabsTrigger value="fichiers" className="text-xs">Fichiers</TabsTrigger>
                <TabsTrigger value="database" className="text-xs">Base</TabsTrigger>
                <TabsTrigger value="services" className="text-xs">Services</TabsTrigger>
                <TabsTrigger value="hooks" className="text-xs">Hooks</TabsTrigger>
                <TabsTrigger value="ui" className="text-xs">UI</TabsTrigger>
                <TabsTrigger value="config" className="text-xs">Config</TabsTrigger>
              </TabsList>

              <TabsContent value="termes">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-winshirt-purple" />
                    Termes Utilisateur
                  </h2>
                  <p className="text-white/70 mb-6">Vocabulaire de base pour les utilisateurs de l'application</p>
                </div>
                {renderSection(termesUtilisateur, BookOpen)}
              </TabsContent>

              <TabsContent value="architecture">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Folder className="w-6 h-6 text-winshirt-purple" />
                    Architecture Technique
                  </h2>
                  <p className="text-white/70 mb-6">Structure des dossiers et organisation du code source</p>
                </div>
                {renderSection(architectureTechnique, Folder)}
              </TabsContent>

              <TabsContent value="fichiers">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Code className="w-6 h-6 text-winshirt-purple" />
                    Fichiers Clés
                  </h2>
                  <p className="text-white/70 mb-6">Fichiers les plus importants et leur rôle dans l'application</p>
                </div>
                {renderSection(fichiersCles, Code)}
              </TabsContent>

              <TabsContent value="database">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Database className="w-6 h-6 text-winshirt-purple" />
                    Base de Données
                  </h2>
                  <p className="text-white/70 mb-6">Tables Supabase et leur structure de données</p>
                </div>
                {renderSection(baseDonnees, Database)}
              </TabsContent>

              <TabsContent value="services">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-winshirt-purple" />
                    Services & APIs
                  </h2>
                  <p className="text-white/70 mb-6">Services backend et intégrations externes</p>
                </div>
                {renderSection(services, Cpu)}
              </TabsContent>

              <TabsContent value="hooks">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Wrench className="w-6 h-6 text-winshirt-purple" />
                    Hooks Personnalisés
                  </h2>
                  <p className="text-white/70 mb-6">Logique métier réutilisable et gestion d'état</p>
                </div>
                {renderSection(hooksPersonnalises, Wrench)}
              </TabsContent>

              <TabsContent value="ui">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-winshirt-purple" />
                    Composants UI
                  </h2>
                  <p className="text-white/70 mb-6">Composants d'interface utilisateur réutilisables</p>
                </div>
                {renderSection(composantsUI, Settings)}
              </TabsContent>

              <TabsContent value="config">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Bug className="w-6 h-6 text-winshirt-purple" />
                    Configuration & Debug
                  </h2>
                  <p className="text-white/70 mb-6">Variables d'environnement et outils de débogage</p>
                </div>
                {renderSection([...configuration, ...debugging], Bug)}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Lexique;
