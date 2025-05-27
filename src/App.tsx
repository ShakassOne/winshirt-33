
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Lotteries from "./pages/Lotteries";
import LotteryDetail from "./pages/LotteryDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import OrderConfirmation from "./pages/OrderConfirmation";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import LotteriesAdmin from "./pages/admin/LotteriesAdmin";
import DesignsAdmin from "./pages/admin/DesignsAdmin";
import MockupsAdmin from "./pages/admin/MockupsAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import ThemeSettings from "./pages/admin/ThemeSettings";
import SocialNetworksAdmin from "./pages/admin/SocialNetworksAdmin";
import { OptimizedAuthProvider } from "./context/OptimizedAuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <OptimizedAuthProvider>
              <CartProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/lotteries" element={<Lotteries />} />
                  <Route path="/lotteries/:id" element={<LotteryDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Admin routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/products" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <ProductsAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/lotteries" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <LotteriesAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/designs" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <DesignsAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/mockups" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <MockupsAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/orders" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <OrdersAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <UsersAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/theme" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <ThemeSettings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/social" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <SocialNetworksAdmin />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CartProvider>
            </OptimizedAuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
