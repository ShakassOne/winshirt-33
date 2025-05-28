
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  const faqItems = [
    {
      question: "Comment fonctionne WinShirt ?",
      answer: "WinShirt combine mode et loterie. En achetant l'un de nos t-shirts personnalisés, vous participez automatiquement à un tirage au sort pour remporter des prix exceptionnels. Plus vous achetez, plus vous avez de chances de gagner !"
    },
    {
      question: "Quand ont lieu les tirages au sort ?",
      answer: "Les tirages sont organisés régulièrement selon le calendrier affiché sur chaque loterie. Ils sont effectués par un commissaire de justice pour garantir la transparence et l'équité."
    },
    {
      question: "Comment puis-je personnaliser mon t-shirt ?",
      answer: "Notre outil de personnalisation vous permet d'ajouter vos propres designs, textes et images. Vous pouvez ajuster la taille, la position et choisir parmi différentes couleurs de t-shirt."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les commandes sont généralement expédiées sous 3-5 jours ouvrés après validation. La livraison prend ensuite 2-4 jours selon votre localisation. La livraison est gratuite dès 75€ d'achat."
    },
    {
      question: "Puis-je retourner mon t-shirt personnalisé ?",
      answer: "Les articles personnalisés ne peuvent pas être retournés sauf en cas de défaut de fabrication. Nous vous recommandons de bien vérifier votre design avant de valider votre commande."
    },
    {
      question: "Comment savoir si j'ai gagné ?",
      answer: "Les gagnants sont contactés par email et téléphone dans les 48h suivant le tirage. Vous avez 7 jours pour vous manifester et récupérer votre lot."
    },
    {
      question: "Puis-je participer sans acheter ?",
      answer: "Lors d'événements spéciaux ou d'animations live, nous proposons parfois des participations gratuites. Suivez-nous sur les réseaux sociaux pour ne rien manquer !"
    },
    {
      question: "Les lots sont-ils échangeables ?",
      answer: "Non, les lots ne sont ni échangeables ni monnayables. Ils sont remis en l'état tel que décrit dans le règlement de chaque loterie."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Questions <span className="text-gradient">Fréquentes</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Trouvez rapidement les réponses aux questions les plus courantes concernant WinShirt
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                    <AccordionTrigger className="text-left hover:text-winshirt-purple">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 pt-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="mt-12 text-center">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Une autre question ?</h3>
                <p className="text-white/70 mb-6">
                  Notre équipe est là pour vous aider. N'hésitez pas à nous contacter.
                </p>
                <a 
                  href="mailto:contact@winshirt.fr"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-winshirt-purple to-winshirt-blue rounded-full text-white hover:opacity-90 transition-opacity"
                >
                  Contactez-nous
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
