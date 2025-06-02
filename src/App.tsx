import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { OptimizedAuthProvider } from "@/context/OptimizedAuthContext";
import { CartProvider } from "@/context/CartContext";
import StripeProvider from "@/components/payment/StripeProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import Orders from "./pages/Orders";
import OrderConfirmation from "./pages/OrderConfirmation";
import Lotteries from "./pages/Lotteries";
import LotteryDetail from "./pages/LotteryDetail";
import Winners from "./pages/Winners";
import Account from "./pages/Account";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import ConditionsGenerales from "./pages/ConditionsGenerales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import ReglementDuJeu from "./pages/ReglementDuJeu";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import AnalyticsAdmin from "./pages/admin/AnalyticsAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import LotteriesAdmin from "./pages/admin/LotteriesAdmin";
import DesignsAdmin from "./pages/admin/DesignsAdmin";
import MockupsAdmin from "./pages/admin/MockupsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import ShippingOptionsAdmin from "./pages/admin/ShippingOptionsAdmin";
import SocialNetworksAdmin from "./pages/admin/SocialNetworksAdmin";
import ThemeSettings from "./pages/admin/ThemeSettings";
import DTFProductionAdmin from "./pages/admin/DTFProductionAdmin";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="winshirt-theme">
        <OptimizedAuthProvider>
          <CartProvider>
            <StripeProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/cancelled" element={<PaymentCancelled />} />
                    <Route 
                      path="/orders" 
                      element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/lotteries" element={<Lotteries />} />
                    <Route path="/lottery/:id" element={<LotteryDetail />} />
                    <Route path="/winners" element={<Winners />} />
                    <Route 
                      path="/account" 
                      element={
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/conditions-generales" element={<ConditionsGenerales />} />
                    <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                    <Route path="/reglement-du-jeu" element={<ReglementDuJeu />} />
                    
                    {/* Routes Admin */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/analytics" 
                      element={
                        <ProtectedRoute>
                          <AnalyticsAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/orders" 
                      element={
                        <ProtectedRoute>
                          <OrdersAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/products" 
                      element={
                        <ProtectedRoute>
                          <ProductsAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/lotteries" 
                      element={
                        <ProtectedRoute>
                          <LotteriesAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/designs" 
                      element={
                        <ProtectedRoute>
                          <DesignsAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/mockups" 
                      element={
                        <ProtectedRoute>
                          <MockupsAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/users" 
                      element={
                        <ProtectedRoute>
                          <UsersAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/shipping" 
                      element={
                        <ProtectedRoute>
                          <ShippingOptionsAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/social" 
                      element={
                        <ProtectedRoute>
                          <SocialNetworksAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/settings" 
                      element={
                        <ProtectedRoute>
                          <ThemeSettings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/dtf-production" 
                      element={
                        <ProtectedRoute>
                          <DTFProductionAdmin />
                        </ProtectedRoute>
                      } 
                    />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </StripeProvider>
          </CartProvider>
        </OptimizedAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
