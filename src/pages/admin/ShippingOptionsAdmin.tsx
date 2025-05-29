
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash, Plus, Save, X, MoveUp, MoveDown, Check, Truck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ShippingOption } from "@/types/shipping.types";
import { fetchAllShippingOptions, createShippingOption, updateShippingOption, deleteShippingOption } from "@/services/shipping.service";

// Shipping option form schema
const formSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().nullable(),
  price: z.number().min(0, "Le prix doit être positif"),
  estimated_days_min: z.number().min(1, "Le délai minimum doit être d'au moins 1 jour"),
  estimated_days_max: z.number().min(1, "Le délai maximum doit être d'au moins 1 jour"),
  is_active: z.boolean().default(true),
  priority: z.number().int().default(0),
});

const ShippingOptionsAdmin = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShipping, setEditingShipping] = useState<ShippingOption | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      estimated_days_min: 1,
      estimated_days_max: 3,
      is_active: true,
      priority: 0,
    },
  });

  // Fetch shipping options
  const { data: shippingOptions = [], isLoading } = useQuery({
    queryKey: ["shippingOptions"],
    queryFn: fetchAllShippingOptions,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Omit<ShippingOption, "id" | "created_at" | "updated_at">) => {
      return createShippingOption(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingOptions"] });
      toast({
        title: "Option de livraison ajoutée",
        description: "L'option de livraison a été créée avec succès.",
      });
      setIsFormOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'option de livraison.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShippingOption> }) => {
      return updateShippingOption(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingOptions"] });
      toast({
        title: "Option de livraison modifiée",
        description: "L'option de livraison a été mise à jour avec succès.",
      });
      setIsFormOpen(false);
      setEditingShipping(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'option de livraison.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteShippingOption(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shippingOptions"] });
      toast({
        title: "Option de livraison supprimée",
        description: "L'option de livraison a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'option de livraison.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  // Reset form when editing shipping option changes
  useEffect(() => {
    if (editingShipping) {
      form.reset({
        name: editingShipping.name,
        description: editingShipping.description || "",
        price: editingShipping.price,
        estimated_days_min: editingShipping.estimated_days_min,
        estimated_days_max: editingShipping.estimated_days_max,
        is_active: editingShipping.is_active,
        priority: editingShipping.priority,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        price: 0,
        estimated_days_min: 1,
        estimated_days_max: 3,
        is_active: true,
        priority: 0,
      });
    }
  }, [editingShipping, form]);

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingShipping) {
      updateMutation.mutate({
        id: editingShipping.id,
        data: values,
      });
    } else {
      createMutation.mutate(values as any);
    }
  };

  // Toggle shipping option active status
  const toggleActive = (shipping: ShippingOption) => {
    updateMutation.mutate({
      id: shipping.id,
      data: { is_active: !shipping.is_active },
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-6 w-6" />
            Gestion des Options de Livraison
          </CardTitle>
          <Button variant="default" onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter une option
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Chargement des options de livraison...</div>
          ) : shippingOptions.length === 0 ? (
            <div className="py-8 text-center">Aucune option de livraison configurée</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Délai (jours)</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingOptions.map((shipping) => (
                  <TableRow key={shipping.id}>
                    <TableCell className="font-medium">{shipping.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {shipping.description || "-"}
                    </TableCell>
                    <TableCell>{shipping.price.toFixed(2)} €</TableCell>
                    <TableCell>
                      {shipping.estimated_days_min === shipping.estimated_days_max 
                        ? `${shipping.estimated_days_min} jour${shipping.estimated_days_min > 1 ? 's' : ''}`
                        : `${shipping.estimated_days_min}-${shipping.estimated_days_max} jours`
                      }
                    </TableCell>
                    <TableCell>{shipping.priority}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch
                          checked={shipping.is_active}
                          onCheckedChange={() => toggleActive(shipping)}
                          className="mr-2"
                        />
                        <Badge variant={shipping.is_active ? "outline" : "secondary"}>
                          {shipping.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingShipping(shipping);
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
                                Êtes-vous sûr de vouloir supprimer cette option de livraison ?
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(shipping.id)}
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
              {editingShipping ? "Modifier une option de livraison" : "Ajouter une option de livraison"}
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
                      <Input placeholder="Ex: Livraison standard" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description de l'option de livraison"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="estimated_days_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Délai min (jours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_days_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Délai max (jours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="3" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 3)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      L'ordre d'affichage des options (du plus petit au plus grand)
                    </FormDescription>
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
                        Activer ou désactiver cette option de livraison
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

              <SheetFooter className="pt-4">
                <SheetClose asChild>
                  <Button variant="outline" type="button">
                    <X className="mr-2 h-4 w-4" /> Annuler
                  </Button>
                </SheetClose>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? (
                    "Chargement..."
                  ) : editingShipping ? (
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

export default ShippingOptionsAdmin;
