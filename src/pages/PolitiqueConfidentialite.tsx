
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PolitiqueConfidentialite = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Politique de <span className="text-gradient">Confidentialité</span>
              </h1>
              <p className="text-lg text-white/70">
                Dernière mise à jour : Janvier 2025
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">1. Responsable du traitement</h2>
                <div className="text-white/80 space-y-2">
                  <p>Le traitement des données est effectué par :</p>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p><strong>WinShirt <br>est la propriété de Shakass Communication</strong></p>
                    <p>SIRET : 410 561 112 00062</p>
                    <p>195 chemin des Plateaux Fleuris, 06600 Antibes</p>
                    <p>Email : contact@winshirt.fr</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">2. Données collectées</h2>
                <div className="text-white/80">
                  <p className="mb-4">Nous collectons uniquement les données nécessaires au bon fonctionnement de nos services :</p>
                  <ul className="list-disc list-inside space-y-2 bg-white/5 p-4 rounded-lg">
                    <li><strong>Identité :</strong> nom, prénom, civilité</li>
                    <li><strong>Coordonnées :</strong> adresse e-mail, adresse postale, téléphone</li>
                    <li><strong>Données d'achat :</strong> produits achetés, preuve de paiement</li>
                    <li><strong>Données liées à la participation aux loteries</strong> (tickets, gagnants)</li>
                    <li><strong>Données de navigation</strong> (via cookies)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">3. Finalités</h2>
                <div className="text-white/80">
                  <p className="mb-4">Les données sont traitées pour :</p>
                  <ul className="list-disc list-inside space-y-2 bg-white/5 p-4 rounded-lg">
                    <li>Gestion des commandes</li>
                    <li>Participation aux tirages au sort</li>
                    <li>Gestion de la relation client</li>
                    <li>Sécurisation du site</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">4. Durée de conservation</h2>
                <div className="text-white/80 space-y-3">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p><strong>Données liées aux commandes et participations :</strong> conservées jusqu'à 5 ans.</p>
                    <p><strong>Cookies :</strong> 13 mois maximum.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 text-winshirt-purple">5. Droits des utilisateurs</h2>
                <div className="text-white/80 space-y-4">
                  <p>Vous disposez d'un droit d'accès, de rectification, d'opposition, d'effacement et de portabilité.</p>
                  <div className="bg-white/5 p-4 rounded-lg space-y-2">
                    <p><strong>Contact :</strong> contact@winshirt.fr</p>
                    <p><strong>Recours :</strong> CNIL – www.cnil.fr</p>
                  </div>
                </div>
              </section>

              <div className="mt-8 p-6 bg-winshirt-purple/10 rounded-lg border border-winshirt-purple/20">
                <h3 className="font-semibold mb-2">Contact</h3>
                <p className="text-white/80">
                  Pour toute question concernant cette politique de confidentialité, 
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

export default PolitiqueConfidentialite;
