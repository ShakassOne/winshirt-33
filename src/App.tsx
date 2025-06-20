
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { OptimizedAuthProvider } from "@/context/OptimizedAuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProviderWrapper } from "@/components/theme/theme-provider-wrapper";
import { GlobalCaptureElements } from "@/components/capture/GlobalCaptureElements";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancelled from "@/pages/PaymentCancelled";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Orders from "@/pages/Orders";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import Profile from "@/pages/Profile";
import Lotteries from "@/pages/Lotteries";
import LotteryDetail from "@/pages/LotteryDetail";
import Winners from "@/pages/Winners";
import FAQ from "@/pages/FAQ";
import ConditionsGenerales from "@/pages/ConditionsGenerales";
import PolitiqueConfidentialite from "@/pages/PolitiqueConfidentialite";
import ReglementDuJeu from "@/pages/ReglementDuJeu";
import Lexique from "@/pages/Lexique";
import NotFound from "@/pages/NotFound";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import ProductsAdmin from "@/pages/admin/ProductsAdmin";
import OrdersAdmin from "@/pages/admin/OrdersAdmin";
import UsersAdmin from "@/pages/admin/UsersAdmin";
import LotteriesAdmin from "@/pages/admin/LotteriesAdmin";
import DesignsAdmin from "@/pages/admin/DesignsAdmin";
import MockupsAdmin from "@/pages/admin/MockupsAdmin";
import ShippingOptionsAdmin from "@/pages/admin/ShippingOptionsAdmin";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import SocialNetworksAdmin from "@/pages/admin/SocialNetworksAdmin";
import EmailAdmin from "@/pages/admin/EmailAdmin";
import LexiqueAdmin from "@/pages/admin/LexiqueAdmin";
import AnalyticsAdmin from "@/pages/admin/AnalyticsAdmin";
import DTFProductionAdmin from "@/pages/admin/DTFProductionAdmin";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { optimizedQueryClient } from "@/lib/optimizedQueryClient";

function App() {
  return (
    <QueryClientProvider client={optimizedQueryClient}>
      <ThemeProviderWrapper>
        <OptimizedAuthProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <GlobalCaptureElements />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/lotteries" element={<Lotteries />} />
                  <Route path="/lotteries/:id" element={<LotteryDetail />} />
                  <Route path="/winners" element={<Winners />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/conditions-generales" element={<ConditionsGenerales />} />
                  <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                  <Route path="/reglement-du-jeu" element={<ReglementDuJeu />} />
                  <Route path="/lexique" element={<Lexique />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin/products" element={<ProtectedRoute requireAdmin><ProductsAdmin /></ProtectedRoute>} />
                  <Route path="/admin/orders" element={<ProtectedRoute requireAdmin><OrdersAdmin /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UsersAdmin /></ProtectedRoute>} />
                  <Route path="/admin/lotteries" element={<ProtectedRoute requireAdmin><LotteriesAdmin /></ProtectedRoute>} />
                  <Route path="/admin/designs" element={<ProtectedRoute requireAdmin><DesignsAdmin /></ProtectedRoute>} />
                  <Route path="/admin/mockups" element={<ProtectedRoute requireAdmin><MockupsAdmin /></ProtectedRoute>} />
                  <Route path="/admin/shipping" element={<ProtectedRoute requireAdmin><ShippingOptionsAdmin /></ProtectedRoute>} />
                  <Route path="/admin/theme" element={<ProtectedRoute requireAdmin><ThemeSettings /></ProtectedRoute>} />
                  <Route path="/admin/social" element={<ProtectedRoute requireAdmin><SocialNetworksAdmin /></ProtectedRoute>} />
                  <Route path="/admin/email" element={<ProtectedRoute requireAdmin><EmailAdmin /></ProtectedRoute>} />
                  <Route path="/admin/lexique" element={<ProtectedRoute requireAdmin><LexiqueAdmin /></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AnalyticsAdmin /></ProtectedRoute>} />
                  <Route path="/admin/dtf-production" element={<ProtectedRoute requireAdmin><DTFProductionAdmin /></ProtectedRoute>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
              <SonnerToaster />
            </Router>
          </CartProvider>
        </OptimizedAuthProvider>
      </ThemeProviderWrapper>
    </QueryClientProvider>
  );
}

export default App;
