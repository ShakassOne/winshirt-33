import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { AnalyticsMetrics } from '@/components/analytics/AnalyticsMetrics';
import { SalesChart } from '@/components/analytics/SalesChart';
import { TopProductsChart } from '@/components/analytics/TopProductsChart';
import { LotteryAnalytics } from '@/components/analytics/LotteryAnalytics';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

const AnalyticsAdmin = () => {
  const { data: analytics, isLoading, error } = useAnalyticsData();

  const handleExportData = () => {
    if (!analytics) return;
    
    // Créer un CSV simple avec les données principales
    const csvData = [
      ['Métrique', 'Valeur'],
      ['Chiffre d\'affaires total', `${analytics.totalRevenue.toFixed(2)} €`],
      ['Nombre de commandes', analytics.totalOrders.toString()],
      ['Panier moyen', `${analytics.averageOrderValue.toFixed(2)} €`],
      ['Clients uniques', analytics.uniqueCustomers.toString()],
      ['Taux de conversion', `${analytics.conversionRate.toFixed(1)}%`],
      ['', ''],
      ['Top produits', ''],
      ...analytics.topProducts.map(product => [
        product.name, 
        `${product.revenue.toFixed(2)} € (${product.quantity} vendus)`
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 pb-20 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Chargement des analytics..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow mt-16 pb-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-400 mb-4">
                Erreur lors du chargement des analytics
              </h1>
              <p className="text-white/70">{error.message}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 pb-20">
        {/* Header Section */}
        <section className="relative py-16 bg-gradient-to-b from-winshirt-blue/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Analytics & <span className="text-gradient">Statistiques</span>
                </h1>
                <p className="text-white/70 mt-2">
                  Tableau de bord des performances de votre boutique
                </p>
              </div>
              <Button 
                onClick={handleExportData}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Exporter CSV
              </Button>
            </div>
          </div>
        </section>
        
        {/* Analytics Content */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            
            {/* Métriques principales */}
            <AnalyticsMetrics
              totalRevenue={analytics.totalRevenue}
              totalOrders={analytics.totalOrders}
              averageOrderValue={analytics.averageOrderValue}
              uniqueCustomers={analytics.uniqueCustomers}
              conversionRate={analytics.conversionRate}
            />
            
            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SalesChart data={analytics.salesByDay} />
              <TopProductsChart data={analytics.topProducts} />
            </div>
            
            {/* Analytics des loteries */}
            <LotteryAnalytics data={analytics.lotteryStats} />
            
            {/* Google Analytics Integration */}
            <div className="mt-8">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Google Analytics - Données en temps réel
                </h3>
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-white/70 text-sm mb-2">
                    Google Analytics ID: <code className="bg-black/30 px-2 py-1 rounded">G-PZJ85QB1E2</code>
                  </p>
                  <p className="text-white/60 text-sm">
                    Le tracking est actif sur votre site. Consultez votre dashboard Google Analytics 
                    pour voir les données de trafic en temps réel, les pages vues, et les conversions.
                  </p>
                  <Button 
                    className="mt-3" 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://analytics.google.com/analytics/web/#/p397122630/reports/intelligenthome', '_blank')}
                  >
                    Ouvrir Google Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalyticsAdmin;
