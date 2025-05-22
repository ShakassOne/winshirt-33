
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash, Plus, Save, X, MoveUp, MoveDown, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { fetchAllSocialNetworks, createSocialNetwork, updateSocialNetwork, deleteSocialNetwork } from "@/services/api.service";
import { SocialNetwork } from "@/types/supabase.types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { facebook, twitter, instagram, linkedin } from "lucide-react";

// Social network form schema
const formSchema = z.object({
  name: z.string().nonempty("Le nom est requis"),
  url: z.string().nullable(),
  icon: z.string().nonempty("L'icône est requise"),
  is_active: z.boolean().default(true),
  priority: z.number().int().default(0),
});

// Available icons for social networks
const availableIcons = [
  { id: "facebook", label: "Facebook", icon: <facebook className="h-4 w-4" /> },
  { id: "twitter", label: "Twitter", icon: <twitter className="h-4 w-4" /> },
  { id: "linkedin", label: "LinkedIn", icon: <linkedin className="h-4 w-4" /> },
  { id: "instagram", label: "Instagram", icon: <instagram className="h-4 w-4" /> },
];

const SocialNetworksAdmin = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialNetwork | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      icon: "facebook",
      is_active: true,
      priority: 0,
    },
  });

  // Fetch social networks
  const { data: socialNetworks = [], isLoading } = useQuery({
    queryKey: ["socialNetworks"],
    queryFn: fetchAllSocialNetworks,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<SocialNetwork, "id" | "created_at" | "updated_at">) => {
      return createSocialNetwork(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialNetworks"] });
      toast({
        title: "Réseau social ajouté",
        description: "Le réseau social a été créé avec succès.",
      });
      setIsFormOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du réseau social.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SocialNetwork> }) => {
      return updateSocialNetwork(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialNetworks"] });
      toast({
        title: "Réseau social modifié",
        description: "Le réseau social a été mis à jour avec succès.",
      });
      setIsFormOpen(false);
      setEditingSocial(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du réseau social.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteSocialNetwork(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialNetworks"] });
      toast({
        title: "Réseau social supprimé",
        description: "Le réseau social a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du réseau social.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Update priority mutation
  const updatePriorityMutation = useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: number }) => {
      return updateSocialNetwork(id, { priority });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialNetworks"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la priorité.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Update active status mutation
  const updateActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => {
      return updateSocialNetwork(id, { is_active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialNetworks"] });
      toast({
        title: "Statut modifié",
        description: "Le statut du réseau social a été modifié avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Reset form when editing social network changes
  useEffect(() => {
    if (editingSocial) {
      form.reset({
        name: editingSocial.name,
        url: editingSocial.url,
        icon: editingSocial.icon,
        is_active: editingSocial.is_active,
        priority: editingSocial.priority,
      });
    } else {
      form.reset({
        name: "",
        url: "",
        icon: "facebook",
        is_active: true,
        priority: 0,
      });
    }
  }, [editingSocial, form]);

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingSocial) {
      updateMutation.mutate({
        id: editingSocial.id,
        data: values,
      });
    } else {
      createMutation.mutate(values as any);
    }
  };

  // Move social network up (decrease priority)
  const moveSocialUp = (social: SocialNetwork, index: number) => {
    if (index <= 0) return;
    const prevSocial = socialNetworks[index - 1];
    updatePriorityMutation.mutate({ id: social.id, priority: prevSocial.priority });
    updatePriorityMutation.mutate({ id: prevSocial.id, priority: social.priority });
  };

  // Move social network down (increase priority)
  const moveSocialDown = (social: SocialNetwork, index: number) => {
    if (index >= socialNetworks.length - 1) return;
    const nextSocial = socialNetworks[index + 1];
    updatePriorityMutation.mutate({ id: social.id, priority: nextSocial.priority });
    updatePriorityMutation.mutate({ id: nextSocial.id, priority: social.priority });
  };

  // Toggle social network active status
  const toggleActive = (social: SocialNetwork) => {
    updateActiveMutation.mutate({
      id: social.id,
      is_active: !social.is_active,
    });
  };

  // Render icon based on name
  const renderIcon = (iconName: string) => {
    const icon = availableIcons.find((i) => i.id === iconName);
    return icon ? icon.icon : null;
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Réseaux Sociaux</CardTitle>
          <Button variant="default" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un réseau
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Chargement des réseaux sociaux...</div>
          ) : socialNetworks.length === 0 ? (
            <div className="py-8 text-center">Aucun réseau social configuré</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Icône</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialNetworks.map((social, index) => (
                  <TableRow key={social.id}>
                    <TableCell className="w-24">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === 0}
                          onClick={() => moveSocialUp(social, index)}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <span>{social.priority}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === socialNetworks.length - 1}
                          onClick={() => moveSocialDown(social, index)}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{social.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {renderIcon(social.icon)}
                        <span className="ml-2">{social.icon}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {social.url || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch
                          checked={social.is_active}
                          onCheckedChange={() => toggleActive(social)}
                          className="mr-2"
                        />
                        <Badge variant={social.is_active ? "outline" : "secondary"}>
                          {social.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingSocial(social);
                            setIsFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce réseau social ?
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(social.id)}
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Sheet */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {editingSocial ? "Modifier un réseau social" : "Ajouter un réseau social"}
            </SheetTitle>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Facebook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de partage</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: https://www.facebook.com/sharer/sharer.php?u=" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormDescription>
                      URL de partage incluant le paramètre pour l'URL de la page à partager.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icône</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une icône" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIcons.map((icon) => (
                            <SelectItem key={icon.id} value={icon.id}>
                              <div className="flex items-center">
                                {icon.icon}
                                <span className="ml-2">{icon.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 rounded-md border">
                    <div className="space-y-0.5">
                      <FormLabel>Actif</FormLabel>
                      <FormDescription>
                        Activer ou désactiver ce réseau social
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      L'ordre d'affichage des réseaux sociaux (du plus petit au plus grand)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="pt-4">
                <SheetClose asChild>
                  <Button variant="outline" type="button">
                    <X className="mr-2 h-4 w-4" /> Annuler
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? (
                    "Chargement..."
                  ) : editingSocial ? (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Mettre à jour
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Créer
                    </>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SocialNetworksAdmin;
