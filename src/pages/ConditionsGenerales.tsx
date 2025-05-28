
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ConditionsGenerales = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Conditions Générales de <span className="text-gradient">Vente</span>
              </h1>
              <p className="text-lg text-white/70">
                Dernière mise à jour : Janvier 2025
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">1. Identité du vendeur</h2>
                <div className="text-white/80">
                  <p className="mb-4">Les ventes sont réalisées par :</p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p><strong>WinShirt est la propriété de Shakass Communication</strong></p>
                    <p>SIRET : 410 561 112 00062</p>
                    <p>195 chemin des Plateaux Fleuris, 06600 Antibes</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">2. Produits et prix</h2>
                <div className="text-white/80 space-y-3">
                  <p>Les prix sont en euros TTC. Les articles vendus incluent, le cas échéant, une participation à un jeu-concours. Le détail est précisé sur chaque fiche produit.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">3. Commande</h2>
                <div className="text-white/80 space-y-3">
                  <p>L'acheteur reconnaît avoir pris connaissance des CGV avant validation de la commande. La vente est conclue une fois le paiement validé.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">4. Livraison</h2>
                <div className="text-white/80 space-y-3">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p><strong>Livraison gratuite dès 75 € d'achat.</strong></p>
                    <p>En cas de retour pour non-réclamation, les frais de réexpédition sont à la charge du client.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">5. Droit de rétractation</h2>
                <div className="text-white/80 space-y-3">
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                    <p><strong>Important :</strong> Le droit de rétractation ne s'applique pas aux articles personnalisés ni aux commandes associées à une participation promotionnelle.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">6. Garantie</h2>
                <div className="text-white/80 space-y-3">
                  <p>Les produits bénéficient de la garantie légale de conformité et de vices cachés.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">7. Litiges</h2>
                <div className="text-white/80 space-y-3">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p>En cas de litige, seul le droit français s'applique.</p>
                    <p><strong>Le tribunal compétent est celui de Grasse ou Antibes.</strong></p>
                  </div>
                </div>
              </section>

              <div className="mt-8 p-6 bg-winshirt-purple/10 rounded-lg border border-winshirt-purple/20">
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-white/80">
                  Pour toute question concernant ces conditions générales de vente, 
                  contactez-nous à : <a href="mailto:contact@winshirt.fr" className="text-winshirt-purple hover:underline">contact@winshirt.fr</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConditionsGenerales;
