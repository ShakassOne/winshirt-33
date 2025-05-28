
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ReglementDuJeu = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Règlement du <span className="text-gradient">Jeu</span>
              </h1>
              <p className="text-lg text-white/70">
                WinShirt Loterie - Dernière mise à jour : Janvier 2025
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">1. Organisateur</h2>
                <div className="text-white/80">
                  <p className="mb-4">Le jeu est organisé par :</p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p><strong>SHAKASS COMMUNICATION / WinShirt</strong></p>
                    <p>SIRET : 410 561 112 00062 – Entrepreneur individuel</p>
                    <p>195 chemin des Plateaux Fleuris, 06600 Antibes</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">2. Objet</h2>
                <div className="text-white/80">
                  <p>Le jeu est une opération promotionnelle à tirage au sort liée à l'achat de certains produits ou via participation gratuite lors d'événements.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">3. Durée</h2>
                <div className="text-white/80">
                  <div className="bg-winshirt-purple/10 p-4 rounded-lg border border-winshirt-purple/20">
                    <p><strong>Du 19 mai 2025 à 18h00 au 30 juin 2025 à 23h59.</strong></p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">4. Conditions de participation</h2>
                <div className="text-white/80 space-y-3">
                  <ul className="list-disc list-inside space-y-2 bg-white/5 p-4 rounded-lg">
                    <li>Ouvert aux personnes majeures ou mineures avec autorisation parentale.</li>
                    <li>Résidant en France, Belgique ou Suisse.</li>
                    <li>Un comportement loyal est requis.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">5. Modes de participation</h2>
                <div className="text-white/80 space-y-3">
                  <ul className="list-disc list-inside space-y-2 bg-white/5 p-4 rounded-lg">
                    <li><strong>Automatique</strong> lors d'un achat sur winshirt.fr</li>
                    <li><strong>Participation gratuite</strong> lors d'événements live ou physiques</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">6. Dotation</h2>
                <div className="text-white/80 space-y-3">
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                    <p>Le lot principal est un article ou service exceptionnel défini dans la fiche produit (ex : produit unique, expérience VIP, etc.).</p>
                    <p><strong>Non échangeable, non monnayable.</strong></p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">7. Tirage au sort</h2>
                <div className="text-white/80 space-y-3">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p>Réalisé par un commissaire de justice dans les 3 semaines suivant la fin du jeu.</p>
                    <p><strong>1 gagnant + 10 suppléants.</strong></p>
                    <p>Le gagnant est contacté et doit se manifester sous 7 jours.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">8. Données personnelles</h2>
                <div className="text-white/80 space-y-3">
                  <p>Les participants acceptent que leurs données soient utilisées pour la gestion du jeu. Le retrait des données entraîne l'annulation de la participation.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">9. Image</h2>
                <div className="text-white/80 space-y-3">
                  <p>Les gagnants acceptent que leur image soit utilisée par WinShirt à des fins de promotion.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">10. Droit applicable</h2>
                <div className="text-white/80 space-y-3">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p>Le jeu est soumis au droit français.</p>
                    <p><strong>Compétence exclusive : Tribunal de Grasse.</strong></p>
                  </div>
                </div>
              </section>

              <div className="mt-8 p-6 bg-winshirt-purple/10 rounded-lg border border-winshirt-purple/20">
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-white/80">
                  Pour toute question concernant ce règlement, 
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

export default ReglementDuJeu;
