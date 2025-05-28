
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import OptimizedProductShowcase from '@/components/home/OptimizedProductShowcase';
import HowItWorks from '@/components/home/HowItWorks';

const Index = () => {
  // Apply overflow-hidden to body for the star background effect
  useEffect(() => {
    document.body.classList.add('overflow-x-hidden');
    return () => {
      document.body.classList.remove('overflow-x-hidden');
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <div className="section-optimized">
          <OptimizedProductShowcase />
        </div>
        <div className="section-optimized">
          <HowItWorks />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
