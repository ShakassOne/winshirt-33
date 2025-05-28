
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, DollarSign, FileText, TrendingUp } from 'lucide-react';

interface AnalyticsMetricsProps {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  conversionRate: number;
}

export const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({
  totalRevenue,
  totalOrders,
  averageOrderValue,
  uniqueCustomers,
  conversionRate
}) => {
  const metrics = [
    {
      title: 'Chiffre d\'affaires',
      value: `${totalRevenue.toFixed(2)} €`,
      icon: DollarSign,
      description: 'Total des ventes',
      color: 'text-green-500'
    },
    {
      title: 'Commandes',
      value: totalOrders.toString(),
      icon: FileText,
      description: 'Commandes payées',
      color: 'text-blue-500'
    },
    {
      title: 'Panier moyen',
      value: `${averageOrderValue.toFixed(2)} €`,
      icon: TrendingUp,
      description: 'Valeur moyenne',
      color: 'text-purple-500'
    },
    {
      title: 'Clients uniques',
      value: uniqueCustomers.toString(),
      icon: Activity,
      description: 'Acheteurs différents',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <Card key={index} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">
                {metric.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-white/50 mt-1">
                {metric.description}
              </p>
              {metric.title === 'Panier moyen' && (
                <Badge variant="outline" className="mt-2 text-xs">
                  Taux conversion: {conversionRate.toFixed(1)}%
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
