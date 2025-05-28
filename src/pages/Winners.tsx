
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Trophy, Calendar, Gift } from 'lucide-react';

const Winners = () => {
  const winners = [
    {
      name: "Marie L.",
      prize: "iPhone 15 Pro",
      date: "15 Janvier 2025",
      lottery: "Loterie Premium #001"
    },
    {
      name: "Thomas B.",
      prize: "Voyage à Bali (2 personnes)",
      date: "8 Janvier 2025",
      lottery: "Loterie Voyage #003"
    },
    {
      name: "Sarah M.",
      prize: "MacBook Pro M3",
      date: "22 Décembre 2024",
      lottery: "Loterie Tech #005"
    },
    {
      name: "Antoine D.",
      prize: "Console PS5 + 5 jeux",
      date: "15 Décembre 2024",
      lottery: "Loterie Gaming #002"
    },
    {
      name: "Julie R.",
      prize: "Montre Apple Watch Ultra",
      date: "8 Décembre 2024",
      lottery: "Loterie Accessoires #001"
    },
    {
      name: "Kevin P.",
      prize: "Bon d'achat 500€",
      date: "1er Décembre 2024",
      lottery: "Loterie Shopping #004"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nos <span className="text-gradient">Gagnants</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Découvrez les heureux gagnants de nos loteries WinShirt. Qui sait, vous serez peut-être le prochain !
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {winners.map((winner, index) => (
                <div key={index} className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-winshirt-purple to-winshirt-blue rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{winner.name}</h3>
                      <p className="text-white/60 text-sm">{winner.lottery}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-white/80">
                      <Gift className="w-4 h-4 text-winshirt-purple" />
                      <span className="font-medium">{winner.prize}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="w-4 h-4" />
                      <span>{winner.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">À votre tour de gagner !</h2>
                <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                  Chaque achat de t-shirt personnalisé vous donne une chance de remporter des prix exceptionnels. 
                  Plus vous participez, plus vos chances augmentent !
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/products"
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-winshirt-purple to-winshirt-blue rounded-full text-white hover:opacity-90 transition-opacity"
                  >
                    Découvrir nos t-shirts
                  </a>
                  <a 
                    href="/lotteries"
                    className="inline-flex items-center px-8 py-3 border border-white/20 rounded-full text-white hover:bg-white/5 transition-colors"
                  >
                    Voir les loteries actives
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Winners;
