import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLotteryById } from '@/services/api.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Gift, Users, Trophy, Euro, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SocialShareSection } from '@/components/SocialShareSection';

const LotteryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lottery, isLoading, error } = useQuery({
    queryKey: ['lottery', id],
    queryFn: () => fetchLotteryById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p>Chargement de la loterie...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !lottery) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loterie introuvable</h1>
            <Button onClick={() => navigate('/lotteries')}>
              Retour aux loteries
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercentage = (lottery.participants / lottery.goal) * 100;
  const timeLeft = formatDistanceToNow(new Date(lottery.draw_date), { locale: fr });
  const isDrawPassed = new Date(lottery.draw_date) < new Date();
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16 flex-grow">
        <Button
          variant="ghost"
          onClick={() => navigate('/lotteries')}
          className="mb-6 hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux loteries
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lottery Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={lottery.image_url}
                alt={lottery.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Lottery Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  {lottery.is_featured ? 'En vedette' : 'Loterie'}
                </Badge>
                {isDrawPassed ? (
                  <Badge variant="destructive">Tirage effectué</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                    En cours
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{lottery.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-rose-500 flex items-center gap-2">
                  <Euro className="h-8 w-8" />
                  {lottery.value.toFixed(0)} €
                </span>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  ({lottery.participants} participant{lottery.participants > 1 ? 's' : ''})
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{lottery.description}</p>
            </div>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex justify-between text-sm">
                    <span>{lottery.participants} participants</span>
                    <span>{lottery.goal} objectif</span>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    {Math.round(progressPercentage)}% de l'objectif atteint
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Draw Date */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Date du tirage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold">
                    {new Date(lottery.draw_date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isDrawPassed ? (
                      <span className="text-red-500">Tirage effectué</span>
                    ) : (
                      <>dans {timeLeft}</>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How to Participate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Comment participer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Pour participer à cette loterie, achetez un produit qui offre des tickets de loterie.
                  </p>
                  <Button
                    onClick={() => navigate('/products')}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Voir les produits éligibles
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Share Section */}
            <SocialShareSection
              url={currentUrl}
              title={`Loterie ${lottery.title} - ${lottery.value}€ à gagner !`}
              description={lottery.description}
              className="border-t pt-6"
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LotteryDetail;
