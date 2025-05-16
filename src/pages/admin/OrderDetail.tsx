import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById, updateOrderStatus } from '@/services/order.service';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon, PackageIcon, TruckIcon, CheckIcon, XIcon, InfoIcon, PrinterIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Type for the customization data
interface CustomizationType {
  designId?: string;
  designName?: string;
  designUrl?: string;
  printPosition?: 'front' | 'back';
  printSize?: string;
  transform?: {
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
  text?: {
    content: string;
    font: string;
    color: string;
    printPosition: 'front' | 'back';
    transform?: {
      position: { x: number; y: number };
      scale: number;
      rotation: number;
    };
  };
  color?: string;
  size?: string;
}

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: () => orderId ? getOrderById(orderId) : Promise.reject('No order ID provided'),
    enabled: !!orderId,
  });

  if (!orderId) {
    navigate('/admin/orders');
    return null;
  }

  if (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger les détails de la commande",
      variant: "destructive",
    });
  }

  const handleStatusChange = async (status: string) => {
    if (!orderId) return;
    
    try {
      await updateOrderStatus(
        orderId, 
        status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      );
      
      toast({
        title: "Statut mis à jour",
        description: `La commande a été mise à jour avec le statut: ${status}`,
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'processing': return 'bg-blue-500/20 text-blue-500';
      case 'shipped': return 'bg-indigo-500/20 text-indigo-500';
      case 'delivered': return 'bg-green-500/20 text-green-500';
      case 'cancelled': return 'bg-red-500/20 text-red-500';
      case 'paid': return 'bg-green-500/20 text-green-500';
      case 'failed': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper function to safely access customization data
  const getCustomizationData = (customization: unknown): CustomizationType | null => {
    if (!customization) return null;
    return customization as CustomizationType;
  };

  // Helper function to open a modal dialog
  const openModal = (modalId: string) => {
    const dialog = document.getElementById(modalId) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 pb-20">
        {/* Header */}
        <section className="relative py-16 bg-gradient-to-b from-rose-500/20 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Détails de la <span className="text-gradient">Commande</span>
                </h1>
                {!isLoading && order && (
                  <p className="text-white/70 mt-2">
                    Commande #{order.id.substring(0, 8)} • {order.created_at && formatDate(order.created_at)}
                  </p>
                )}
              </div>

              <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={() => navigate('/admin/orders')}>
                  Retour aux Commandes
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {isLoading ? (
          <section className="py-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-[300px]" />
                <Skeleton className="h-[300px] md:col-span-2" />
              </div>
              <Skeleton className="h-[400px] mt-6" />
            </div>
          </section>
        ) : order ? (
          <section className="py-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Client Information */}
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle>Informations Client</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{order.shipping_first_name} {order.shipping_last_name}</h3>
                      <p className="text-white/70">{order.shipping_email}</p>
                      <p className="text-white/70">{order.shipping_phone}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Adresse de livraison</h4>
                      <p className="text-white/70">{order.shipping_address}</p>
                      <p className="text-white/70">{order.shipping_postal_code} {order.shipping_city}</p>
                      <p className="text-white/70">{order.shipping_country}</p>
                    </div>
                    
                    {order.delivery_notes && (
                      <div>
                        <h4 className="font-medium mb-1">Notes de livraison</h4>
                        <p className="text-white/70">{order.delivery_notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="bg-black/40 border-white/10 md:col-span-2">
                  <CardHeader>
                    <CardTitle>Résumé de la Commande</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-white/5">
                        <div className="text-sm text-white/60">Date de commande</div>
                        <div className="flex items-center mt-1">
                          <CalendarIcon className="h-4 w-4 mr-2 text-white/60" />
                          {order.created_at && formatDate(order.created_at)}
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white/5">
                        <div className="text-sm text-white/60">Montant total</div>
                        <div className="text-xl font-bold mt-1">{order.total_amount.toFixed(2)} €</div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white/5">
                        <div className="text-sm text-white/60">Statut de la commande</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusBadgeClass(order.status)}>
                            {{
                              'pending': 'En attente',
                              'processing': 'En traitement',
                              'shipped': 'Expédiée',
                              'delivered': 'Livrée',
                              'cancelled': 'Annulée'
                            }[order.status] || order.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white/5">
                        <div className="text-sm text-white/60">Statut du paiement</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusBadgeClass(order.payment_status || 'pending')}>
                            {{
                              'pending': 'En attente',
                              'paid': 'Payée',
                              'failed': 'Échouée'
                            }[order.payment_status || 'pending'] || order.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-full sm:w-auto">
                        <Select 
                          defaultValue={order.status}
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Mettre à jour le statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="processing">En traitement</SelectItem>
                            <SelectItem value="shipped">Expédiée</SelectItem>
                            <SelectItem value="delivered">Livrée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card className="bg-black/40 border-white/10 md:col-span-3">
                  <CardHeader>
                    <CardTitle>Articles de la Commande</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-white/5">
                          <TableHead>Produit</TableHead>
                          <TableHead>Prix unitaire</TableHead>
                          <TableHead>Quantité</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Personnalisation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item, index) => {
                          // Safely get customization data
                          const customizationData = getCustomizationData(item.customization);
                          
                          return (
                            <TableRow key={index} className="hover:bg-white/5">
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="w-16 h-16 rounded bg-white/10 overflow-hidden">
                                    {item.products?.image_url ? (
                                      <img 
                                        src={item.products.image_url} 
                                        alt={item.products?.name || 'Produit'} 
                                        className="w-full h-full object-cover" 
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                                        <PackageIcon className="h-6 w-6 text-white/40" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium">{item.products?.name || 'Produit inconnu'}</div>
                                    {customizationData?.color && (
                                      <div className="text-sm text-white/60">Couleur: {customizationData.color}</div>
                                    )}
                                    {customizationData?.size && (
                                      <div className="text-sm text-white/60">Taille: {customizationData.size}</div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{item.price.toFixed(2)} €</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{(item.price * item.quantity).toFixed(2)} €</TableCell>
                              <TableCell>
                                {customizationData ? (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => openModal(`customization-modal-${index}`)}
                                  >
                                    <InfoIcon className="h-4 w-4 mr-1" /> Voir détails
                                  </Button>
                                ) : (
                                  <span className="text-white/40">Non personnalisé</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="border-t border-white/10 flex justify-end">
                    <div className="text-xl font-bold">Total: {order.total_amount.toFixed(2)} €</div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-10">
            <div className="container mx-auto px-4 text-center">
              <p>Aucune commande trouvée avec cet identifiant.</p>
            </div>
          </section>
        )}
      </main>

      {/* Customization Modals */}
      {!isLoading && order && order.items.map((item, index) => {
        // Safely get customization data
        const customizationData = getCustomizationData(item.customization);
        
        if (!customizationData) return null;
        
        return (
          <dialog key={index} id={`customization-modal-${index}`} className="modal modal-bottom sm:modal-middle bg-transparent">
            <div className="modal-box bg-black/90 border border-white/10 p-0 overflow-hidden max-w-3xl w-full">
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4">Détails de la personnalisation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Aperçu du design</h4>
                    
                    <div className="relative bg-white/5 rounded-lg p-2 aspect-square">
                      {/* Product base image */}
                      <img 
                        src={item.products?.image_url || '/placeholder.svg'} 
                        alt="Base du produit" 
                        className="w-full h-full object-contain" 
                      />
                      
                      {/* Design overlay */}
                      {customizationData.designUrl && (
                        <div 
                          className="absolute"
                          style={{
                            top: `${customizationData.transform?.position.y || 50}%`,
                            left: `${customizationData.transform?.position.x || 50}%`,
                            transform: `translate(-50%, -50%) scale(${customizationData.transform?.scale || 1}) rotate(${customizationData.transform?.rotation || 0}deg)`,
                            width: '40%',
                            height: 'auto',
                          }}
                        >
                          <img 
                            src={customizationData.designUrl} 
                            alt="Design personnalisé" 
                            className="w-full h-auto object-contain" 
                          />
                        </div>
                      )}
                      
                      {/* Text overlay */}
                      {customizationData.text?.content && (
                        <div 
                          className="absolute"
                          style={{
                            top: `${customizationData.text.transform?.position.y || 70}%`,
                            left: `${customizationData.text.transform?.position.x || 50}%`,
                            transform: `translate(-50%, -50%) scale(${customizationData.text.transform?.scale || 1}) rotate(${customizationData.text.transform?.rotation || 0}deg)`,
                            color: customizationData.text.color,
                            fontFamily: customizationData.text.font,
                            fontSize: '24px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {customizationData.text.content}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">Informations du design</h4>
                      <div className="bg-black/40 p-4 rounded-lg space-y-2">
                        {item.design ? (
                          <>
                            <p><strong>Nom du design:</strong> {item.design.name}</p>
                            <p><strong>Catégorie:</strong> {item.design.category}</p>
                            <div className="mt-2">
                              <h5 className="text-sm font-medium mb-1">Aperçu du design:</h5>
                              <div className="w-20 h-20 rounded bg-white/10 overflow-hidden">
                                <img 
                                  src={item.design.image_url}
                                  alt={item.design.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <p><strong>ID du design:</strong> {customizationData.designId}</p>
                            {customizationData.designName && (
                              <p><strong>Nom du design:</strong> {customizationData.designName}</p>
                            )}
                            <div className="mt-2">
                              <h5 className="text-sm font-medium mb-1">Aperçu du design:</h5>
                              <div className="w-20 h-20 rounded bg-white/10 overflow-hidden">
                                <img 
                                  src={customizationData.designUrl}
                                  alt="Design personnalisé"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Détails de la personnalisation</h4>
                      <div className="bg-black/40 p-4 rounded-lg space-y-2">
                        <p><strong>Position d'impression:</strong> {
                          customizationData.printPosition === 'front' ? 'Avant' : 'Arrière'
                        }</p>
                        <p><strong>Taille d'impression:</strong> {customizationData.printSize}</p>
                        
                        {customizationData.transform && (
                          <>
                            <p><strong>Position X:</strong> {customizationData.transform.position.x}%</p>
                            <p><strong>Position Y:</strong> {customizationData.transform.position.y}%</p>
                            <p><strong>Échelle:</strong> {customizationData.transform.scale}</p>
                            <p><strong>Rotation:</strong> {customizationData.transform.rotation}°</p>
                          </>
                        )}
                        
                        {customizationData.text && (
                          <>
                            <h5 className="font-medium mt-4 mb-1">Texte personnalisé</h5>
                            <p><strong>Contenu:</strong> {customizationData.text.content}</p>
                            <p><strong>Police:</strong> {customizationData.text.font}</p>
                            <p><strong>Couleur:</strong> <span className="inline-block w-4 h-4 rounded-full align-middle mr-1" style={{ backgroundColor: customizationData.text.color }}></span> {customizationData.text.color}</p>
                            <p><strong>Position:</strong> {
                              customizationData.text.printPosition === 'front' ? 'Avant' : 'Arrière'
                            }</p>
                            
                            {customizationData.text.transform && (
                              <>
                                <p><strong>Position X:</strong> {customizationData.text.transform.position.x}%</p>
                                <p><strong>Position Y:</strong> {customizationData.text.transform.position.y}%</p>
                                <p><strong>Échelle:</strong> {customizationData.text.transform.scale}</p>
                                <p><strong>Rotation:</strong> {customizationData.text.transform.rotation}°</p>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-action bg-black/40 p-4 border-t border-white/10">
                <form method="dialog">
                  <Button variant="default">Fermer</Button>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        );
      })}
      
      <Footer />
      
      <style>
        {`
        @media print {
          nav, footer, button, .bg-gradient-to-b {
            display: none !important;
          }
          body, html {
            background: white !important;
            color: black !important;
          }
          .bg-black\/40, .bg-white\/5, .bg-white\/10 {
            background: white !important;
            border: 1px solid #eee !important;
          }
          .text-white\/60, .text-white\/70 {
            color: #444 !important;
          }
          * {
            color: black !important;
          }
          .badge {
            border: 1px solid currentColor !important;
          }
          @page {
            margin: 1.5cm;
          }
        }
      `}
      </style>
    </div>
  );
};

export default OrderDetail;
