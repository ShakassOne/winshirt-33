
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gradient mb-1">WinShirt</h3>
              <p className="text-white/70 text-sm">
                Portez votre style, tentez votre chance ! Un concept innovant qui allie mode et loterie.
              </p>
            </div>
            
            <div className="flex gap-4 mt-6">
              <SocialLink href="https://facebook.com" label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialLink>
              
              <SocialLink href="https://instagram.com" label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </SocialLink>
              
              <SocialLink href="https://twitter.com" label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </SocialLink>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Liens Utiles</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/">Accueil</FooterLink>
              </li>
              <li>
                <FooterLink href="/products">Shop</FooterLink>
              </li>
              <li>
                <FooterLink href="/lotteries">Loteries actives</FooterLink>
              </li>
              <li>
                <FooterLink href="/winners">Gagnants précédents</FooterLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/reglement-du-jeu">Règlement du jeu</FooterLink>
              </li>
              <li>
                <FooterLink href="/faq">FAQ</FooterLink>
              </li>
              <li>
                <FooterLink href="/conditions-generales">Conditions générales</FooterLink>
              </li>
              <li>
                <FooterLink href="/politique-confidentialite">Politique de confidentialité</FooterLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Contact</h3>
            <address className="not-italic">
              <p className="mb-2">
                <span className="block text-white/70">Email:</span>
                <a href="mailto:contact@winshirt.fr" className="text-white hover:text-winshirt-purple">contact@winshirt.fr</a>
              </p>
              <p className="mb-2">
                <span className="block text-white/70">Téléphone:</span>
                <a href="tel:+33662371676" className="text-white hover:text-winshirt-purple">+33 6 62 37 16 76</a>
              </p>
            </address>
            
            <div className="mt-6">
              <button className="px-5 py-2 rounded-full bg-gradient-purple text-white hover:opacity-90 transition-opacity">
                Contactez-nous
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-white/50 text-sm">
          <p>© 2025 WinShirt. Tous droits réservés.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex gap-6">
              <li>
                <Link to="/mentions-legales" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="hover:text-white transition-colors">
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link 
      to={href} 
      className="text-white/70 hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
};

export default Footer;
