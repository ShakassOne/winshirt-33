import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { EmailService, EmailTemplate, EmailSettings, EmailLog } from '@/services/email.service';
import { Mail, Settings, FileText, Send, TestTube, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAdminCheck } from '@/hooks/useAdminCheck';

const EmailAdmin = () => {
  const { isAdmin } = useAdminCheck();
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(null);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [templatesData, settingsData, logsData] = await Promise.all([
        EmailService.getTemplates(),
        EmailService.getEmailSettings(),
        EmailService.getEmailLogs()
      ]);
      
      setTemplates(templatesData);
      setEmailSettings(settingsData);
      setEmailLogs(logsData);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (formData: FormData) => {
    try {
      setLoading(true);
      const settings = {
        smtp_host: formData.get('smtp_host') as string,
        smtp_port: parseInt(formData.get('smtp_port') as string),
        smtp_secure: formData.get('smtp_secure') === 'on',
        smtp_user: formData.get('smtp_user') as string,
        smtp_password: formData.get('smtp_password') as string,
        from_email: formData.get('from_email') as string,
        from_name: formData.get('from_name') as string,
        is_active: true
      };

      await EmailService.upsertEmailSettings(settings);
      await loadData();
      
      toast({
        title: "Succès",
        description: "Paramètres email sauvegardés"
      });
    } catch (error) {
      console.error('Erreur sauvegarde paramètres:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async (formData: FormData) => {
    try {
      setLoading(true);
      const template = {
        id: selectedTemplate?.id,
        type: formData.get('type') as string,
        name: formData.get('name') as string,
        subject: formData.get('subject') as string,
        html_content: formData.get('html_content') as string,
        variables: selectedTemplate?.variables || [],
        is_active: formData.get('is_active') === 'on'
      };

      await EmailService.upsertTemplate(template);
      await loadData();
      
      toast({
        title: "Succès",
        description: "Template sauvegardé"
      });
    } catch (error) {
      console.error('Erreur sauvegarde template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le template",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async (templateType: string) => {
    if (!testEmail) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un email de test",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const result = await EmailService.testEmail(testEmail, templateType);

      if (result.success) {
        toast({
          title: "Succès",
          description: `Email de test envoyé à ${testEmail}`
        });
        await loadData(); // Recharger les logs
      } else {
        throw new Error(result.message || 'Échec envoi test');
      }
    } catch (error) {
      console.error('Erreur test email:', error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Impossible d'envoyer l'email de test",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendLotteryReminders = async () => {
    try {
      setLoading(true);
      const success = await EmailService.sendLotteryReminders();
      
      if (success) {
        toast({
          title: "Succès",
          description: "Rappels de loteries envoyés"
        });
        await loadData();
      } else {
        throw new Error('Échec envoi rappels');
      }
    } catch (error) {
      console.error('Erreur envoi rappels:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer les rappels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-8">
        <Mail className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Gestion des Emails</h1>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres SMTP
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="test">
            <TestTube className="h-4 w-4 mr-2" />
            Tests & Envois
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Clock className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuration SMTP</CardTitle>
              <CardDescription>
                Paramètres de votre serveur email IONOS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveSettings(new FormData(e.target as HTMLFormElement));
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp_host">Serveur SMTP</Label>
                    <Input 
                      id="smtp_host" 
                      name="smtp_host" 
                      defaultValue={emailSettings?.smtp_host || 'smtp.ionos.fr'} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_port">Port</Label>
                    <Input 
                      id="smtp_port" 
                      name="smtp_port" 
                      type="number" 
                      defaultValue={emailSettings?.smtp_port || 587} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp_user">Utilisateur</Label>
                    <Input 
                      id="smtp_user" 
                      name="smtp_user" 
                      defaultValue={emailSettings?.smtp_user || ''} 
                      placeholder="contact@winshirt.fr"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_password">Mot de passe</Label>
                    <Input 
                      id="smtp_password" 
                      name="smtp_password" 
                      type="password" 
                      defaultValue={emailSettings?.smtp_password || ''} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from_email">Email expéditeur</Label>
                    <Input 
                      id="from_email" 
                      name="from_email" 
                      type="email" 
                      defaultValue={emailSettings?.from_email || 'contact@winshirt.fr'} 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="from_name">Nom expéditeur</Label>
                    <Input 
                      id="from_name" 
                      name="from_name" 
                      defaultValue={emailSettings?.from_name || 'WinShirt'} 
                      required 
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="smtp_secure" 
                    name="smtp_secure" 
                    defaultChecked={emailSettings?.smtp_secure !== false} 
                  />
                  <Label htmlFor="smtp_secure">Connexion sécurisée (TLS)</Label>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Templates d'emails</CardTitle>
                <CardDescription>
                  Personnalisez vos templates HTML pour chaque type d'email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select onValueChange={(value) => {
                    const template = templates.find(t => t.type === value);
                    setSelectedTemplate(template || null);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.type}>
                          {template.name}
                          <Badge className="ml-2" variant={template.is_active ? "default" : "secondary"}>
                            {template.is_active ? "Actif" : "Inactif"}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedTemplate && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveTemplate(new FormData(e.target as HTMLFormElement));
                    }} className="space-y-4">
                      <input type="hidden" name="type" value={selectedTemplate.type} />
                      
                      <div>
                        <Label htmlFor="name">Nom du template</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          defaultValue={selectedTemplate.name} 
                          required 
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject">Sujet de l'email</Label>
                        <Input 
                          id="subject" 
                          name="subject" 
                          defaultValue={selectedTemplate.subject} 
                          required 
                        />
                      </div>

                      <div>
                        <Label htmlFor="html_content">Contenu HTML</Label>
                        <Textarea 
                          id="html_content" 
                          name="html_content" 
                          defaultValue={selectedTemplate.html_content} 
                          rows={15}
                          className="font-mono text-sm"
                          required 
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="is_active" 
                          name="is_active" 
                          defaultChecked={selectedTemplate.is_active} 
                        />
                        <Label htmlFor="is_active">Template actif</Label>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => handleTestEmail(selectedTemplate.type)}
                          disabled={loading || !testEmail}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Tester
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="test">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tests et envois manuels</CardTitle>
                <CardDescription>
                  Testez vos templates et envoyez des notifications manuellement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="test-email">Email de test</Label>
                  <Input 
                    id="test-email"
                    type="email" 
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="votre-email@exemple.com"
                  />
                </div>

                <Separator />

                <div className="grid gap-4">
                  <h3 className="font-semibold">Tests des templates</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="outline"
                      onClick={() => handleTestEmail('order_confirmation')}
                      disabled={loading || !testEmail}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Confirmation commande
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleTestEmail('shipping_notification')}
                      disabled={loading || !testEmail}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Notification expédition
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleTestEmail('lottery_reminder')}
                      disabled={loading || !testEmail}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Rappel loterie
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <h3 className="font-semibold">Envois manuels</h3>
                  <Button 
                    onClick={handleSendLotteryReminders}
                    disabled={loading}
                    className="w-fit"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? 'Envoi en cours...' : 'Envoyer rappels loteries'}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Envoie un rappel à tous les clients pour les loteries se terminant dans les 3 prochains jours
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Historique des envois</CardTitle>
              <CardDescription>
                Derniers emails envoyés par le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {log.status === 'sent' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : log.status === 'failed' ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-medium">{log.subject}</span>
                        <Badge variant={log.status === 'sent' ? 'default' : log.status === 'failed' ? 'destructive' : 'secondary'}>
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        À: {log.recipient_email} {log.recipient_name && `(${log.recipient_name})`}
                      </p>
                      {log.error_message && (
                        <p className="text-sm text-red-500 mt-1">
                          Erreur: {log.error_message}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {log.sent_at ? new Date(log.sent_at).toLocaleString('fr-FR') : 
                       new Date(log.created_at).toLocaleString('fr-FR')}
                    </div>
                  </div>
                ))}
                
                {emailLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun email envoyé pour le moment
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailAdmin;
