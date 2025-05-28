
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface TopProductsChartProps {
  data: { name: string; revenue: number; quantity: number }[];
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => {
  const chartConfig = {
    revenue: {
      label: "Chiffre d'affaires (€)",
      color: "hsl(var(--chart-3))",
    },
  };

  const chartData = data.map(item => ({
    ...item,
    shortName: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name
  }));

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Top des produits (par CA)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="shortName"
              tick={{ fontSize: 12 }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value: any, name: string) => [
                `${value}€`, 
                "Chiffre d'affaires"
              ]}
              labelFormatter={(label) => {
                const item = data.find(d => d.name.startsWith(label.split('...')[0]));
                return item?.name || label;
              }}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        
        {/* Tableau des détails */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Détails des ventes</h4>
          <div className="space-y-2">
            {data.map((product, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-black/20 rounded">
                <span className="text-sm">{product.name}</span>
                <div className="text-right">
                  <div className="text-sm font-medium">{product.revenue.toFixed(2)} €</div>
                  <div className="text-xs text-white/60">{product.quantity} vendu(s)</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
