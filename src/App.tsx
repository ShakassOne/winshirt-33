
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Lotteries from "./pages/Lotteries";
import ProductDetail from "./pages/ProductDetail";
import LotteryDetail from "./pages/LotteryDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import LotteriesAdmin from "./pages/admin/LotteriesAdmin";
import MockupsAdmin from "./pages/admin/MockupsAdmin";
import DesignsAdmin from "./pages/admin/DesignsAdmin";
import ThemeSettings from "./pages/admin/ThemeSettings";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import SocialNetworksAdmin from "./pages/admin/SocialNetworksAdmin";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useScrollReset } from "./hooks/useScrollReset";
import { ThemeProvider } from "./components/theme-provider";
import { CartProvider } from "./context/CartContext";
import { OptimizedAuthProvider } from "./context/OptimizedAuthContext";
import { createOptimizedQueryClient } from "./lib/queryClient";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";

// ScrollToTop component to reset scroll position
const ScrollToTop = () => {
  useScrollReset();
  return null;
};

// Créer le client de requête optimisé
const queryClient = createOptimizedQueryClient();

console.log('[App] Optimized query client and auth context configured');

// App component that will be rendered in main.tsx
const App = () => {
  console.log('[App] Rendering optimized application');
  
  return (
    <QueryClientProvider client={queryClient}>
      <OptimizedAuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/lotteries" element={<Lotteries />} />
                  <Route path="/lotteries/:id" element={<LotteryDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  
                  {/* Routes Admin protégées */}
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <ProtectedRoute>
                      <ProductsAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/lotteries" element={
                    <ProtectedRoute>
                      <LotteriesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/mockups" element={
                    <ProtectedRoute>
                      <MockupsAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/designs" element={
                    <ProtectedRoute>
                      <DesignsAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <ProtectedRoute>
                      <OrdersAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <ProtectedRoute>
                      <UsersAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/theme" element={
                    <ProtectedRoute>
                      <ThemeSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin/social-networks" element={
                    <ProtectedRoute>
                      <SocialNetworksAdmin />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </ThemeProvider>
      </OptimizedAuthProvider>
    </QueryClientProvider>
  );
};

export default App;
