import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllProducts as fetchProducts, createProduct, updateProduct, deleteProduct
} from '@/services/api.service';
import { Product } from '@/types/supabase.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UploadButton } from '@/components/ui/upload-button';

const ProductsAdmin = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const createProductMutation = useMutation({
    mutationFn: (productData: any) => createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeDialog();
      toast("Succès", { 
        description: "Operation réussie" 
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la création du produit"
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: (productData: { id: string; data: any }) =>
      updateProduct(productData.id, productData.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeDialog();
      toast("Succès", { 
        description: "Operation réussie" 
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la mise à jour du produit"
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast("Succès", { 
        description: "Operation réussie" 
      });
    },
    onError: () => {
      toast("Erreur", {
        description: "Une erreur s'est produite lors de la suppression du produit"
      });
    }
  });

  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name);
      setDescription(selectedProduct.description);
      setImageUrl(selectedProduct.image_url);
      setPrice(selectedProduct.price);
      setCategory(selectedProduct.category);
      setIsActive(selectedProduct.is_active !== false);
    }
  }, [selectedProduct]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setSelectedProduct(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setPrice(0);
    setCategory('');
    setIsActive(true);
  };

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    openDialog();
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    openDialog();
  };

  const handleDelete = async (id: string) => {
    await deleteProductMutation.mutateAsync(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name,
      description,
      image_url: imageUrl,
      price,
      category,
      is_active: isActive,
    };

    if (isEditing && selectedProduct) {
      await updateProductMutation.mutateAsync({ id: selectedProduct.id, data: productData });
    } else {
      await createProductMutation.mutateAsync(productData);
    }
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
  };

  if (isLoading) return <div>Chargement des produits...</div>;
  if (error) return <div>Une erreur est survenue lors du chargement des produits.</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Produit
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="relative bg-white/5 rounded-lg shadow-md p-4">
            <img src={product.image_url} alt={product.name} className="w-full h-32 object-contain mb-4" />
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Catégorie: {product.category}</p>
            <div className="flex items-center justify-between">
              <Switch
                id={`product-active-${product.id}`}
                checked={product.is_active !== false}
                onCheckedChange={(checked) => {
                  updateProductMutation.mutate({
                    id: product.id,
                    data: { is_active: checked },
                  });
                }}
              />
              <Label htmlFor={`product-active-${product.id}`} className="text-sm">
                {product.is_active !== false ? 'Actif' : 'Inactif'}
              </Label>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="bg-black/50 backdrop-blur-xl border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifier Produit' : 'Nouveau Produit'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">URL de l'image</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  className="flex-1"
                />
                <UploadButton
                  onUpload={handleImageUpload}
                  variant="outline"
                  targetFolder="products"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="price">Prix</Label>
              <Input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="is_active">Produit actif</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsAdmin;
