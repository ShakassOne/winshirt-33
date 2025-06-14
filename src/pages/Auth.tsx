
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { useOptimizedAuth } from '@/context/OptimizedAuthContext';
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SecureValidationUtils } from '@/components/validation/SecureValidationUtils';
import { passwordValidator } from '@/utils/enhancedSecurityHeaders';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, isAuthenticated, isLoading: authLoading } = useOptimizedAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] as string[] });

  // Redirect to previous page or home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = new URLSearchParams(location.search).get('from') || '/';
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  // Update password strength on change
  useEffect(() => {
    if (signupPassword) {
      const validation = passwordValidator.validatePasswordStrength(signupPassword);
      setPasswordStrength({ score: validation.score, feedback: validation.feedback });
    } else {
      setPasswordStrength({ score: 0, feedback: [] });
    }
  }, [signupPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Échec de la connexion",
        description: error.message || "Une erreur s'est produite lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation using SecureValidationUtils
    const validationResult = SecureValidationUtils.validateUserRegistration({
      email: signupEmail,
      password: signupPassword,
      firstName,
      lastName
    });

    if (!validationResult.isValid) {
      SecureValidationUtils.logValidationAttempt('user_registration', false, validationResult.errors);
      toast({
        title: "Erreur de validation",
        description: validationResult.errors.join(', '),
        variant: "destructive",
      });
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }
    
    if (!acceptTerms) {
      toast({
        title: "Erreur",
        description: "Vous devez accepter les conditions générales",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error, user } = await signUp(
        validationResult.sanitized.email,
        validationResult.sanitized.password,
        {
          first_name: validationResult.sanitized.firstName,
          last_name: validationResult.sanitized.lastName,
        }
      );
      
      if (error) {
        throw error;
      }
      
      SecureValidationUtils.logValidationAttempt('user_registration', true);
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vérifiez votre email pour confirmer votre compte.",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Échec de l'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score < 2) return 'Faible';
    if (score < 4) return 'Moyen';
    return 'Fort';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <Shield className="mx-auto h-12 w-12 text-winshirt-purple mb-4" />
            <h1 className="text-2xl font-bold">Connexion Sécurisée</h1>
            <p className="text-white/70">Votre sécurité est notre priorité</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion</CardTitle>
                  <CardDescription>
                    Connectez-vous à votre compte pour accéder à vos commandes et vos informations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="email@exemple.com" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          disabled={isSubmitting}
                          autoComplete="email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="current-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isSubmitting}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connexion en cours...</>
                        ) : (
                          "Se connecter"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Création de compte</CardTitle>
                  <CardDescription>
                    Créez un compte pour accéder à toutes les fonctionnalités.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input 
                            id="firstName" 
                            placeholder="Jean" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="given-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Dupont" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="family-name"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email</Label>
                        <Input 
                          id="signupEmail" 
                          type="email" 
                          placeholder="email@exemple.com" 
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          disabled={isSubmitting}
                          autoComplete="email"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Mot de passe</Label>
                        <div className="relative">
                          <Input 
                            id="signupPassword" 
                            type={showPassword ? "text" : "password"}
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isSubmitting}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        {signupPassword && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Force du mot de passe:</span>
                              <span className={
                                passwordStrength.score < 2 ? 'text-red-500' :
                                passwordStrength.score < 4 ? 'text-yellow-500' : 'text-green-500'
                              }>
                                {getPasswordStrengthText(passwordStrength.score)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all ${getPasswordStrengthColor(passwordStrength.score)}`}
                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                              />
                            </div>
                            {passwordStrength.feedback.length > 0 && (
                              <ul className="text-xs text-red-500 space-y-1">
                                {passwordStrength.feedback.map((feedback, index) => (
                                  <li key={index}>• {feedback}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <div className="relative">
                          <Input 
                            id="confirmPassword" 
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isSubmitting}
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isSubmitting}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        {confirmPassword && signupPassword !== confirmPassword && (
                          <p className="text-xs text-red-500">Les mots de passe ne correspondent pas</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={acceptTerms} 
                          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                          disabled={isSubmitting}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          J'accepte les conditions générales d'utilisation et la politique de confidentialité
                        </label>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={isSubmitting || passwordStrength.score < 4}>
                        {isSubmitting ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Inscription en cours...</>
                        ) : (
                          "Créer un compte"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
