
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface LotteryAnalyticsProps {
  data: {
    title: string;
    participants: number;
    goal: number;
    percentage: number;
    value: number;
  }[];
}

export const LotteryAnalytics: React.FC<LotteryAnalyticsProps> = ({ data }) => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Analytics des Loteries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((lottery, index) => (
            <div key={index} className="p-4 bg-black/20 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">{lottery.title}</h4>
                  <p className="text-sm text-white/60">
                    Valeur: {lottery.value.toFixed(2)} €
                  </p>
                </div>
                <Badge 
                  variant={lottery.percentage >= 80 ? "default" : "outline"}
                  className={lottery.percentage >= 80 ? "bg-green-500/20 text-green-300" : ""}
                >
                  {lottery.percentage.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{lottery.participants} participants</span>
                  <span>Objectif: {lottery.goal}</span>
                </div>
                <Progress 
                  value={lottery.percentage} 
                  className="h-2"
                />
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Restant:</span>
                  <span className="ml-2 font-medium">
                    {lottery.goal - lottery.participants}
                  </span>
                </div>
                <div>
                  <span className="text-white/60">Taux d'engagement:</span>
                  <span className="ml-2 font-medium">
                    {lottery.participants > 0 ? 'Actif' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {data.length === 0 && (
            <div className="text-center py-8 text-white/60">
              Aucune loterie active pour le moment
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
