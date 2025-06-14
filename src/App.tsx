import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { OptimizedAuthProvider } from '@/context/OptimizedAuthContext';
import { CartProvider } from '@/context/CartContext';
import { createOptimizedQueryClient } from '@/lib/queryClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Pages
import Index from '@/pages/Index';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Lotteries from '@/pages/Lotteries';
import LotteryDetail from '@/pages/LotteryDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Account from '@/pages/Account';
import Orders from '@/pages/Orders';
import Payment from '@/pages/Payment';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentCancelled from '@/pages/PaymentCancelled';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Winners from '@/pages/Winners';
import FAQ from '@/pages/FAQ';
import Lexique from '@/pages/Lexique';
import ConditionsGenerales from '@/pages/ConditionsGenerales';
import PolitiqueConfidentialite from '@/pages/PolitiqueConfidentialite';
import ReglementDuJeu from '@/pages/ReglementDuJeu';
import NotFound from '@/pages/NotFound';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import ProductsAdmin from '@/pages/admin/ProductsAdmin';
import LotteriesAdmin from '@/pages/admin/LotteriesAdmin';
import UsersAdmin from '@/pages/admin/UsersAdmin';
import OrdersAdmin from '@/pages/admin/OrdersAdmin';
import DesignsAdmin from '@/pages/admin/DesignsAdmin';
import MockupsAdmin from '@/pages/admin/MockupsAdmin';
import DTFProductionAdmin from '@/pages/admin/DTFProductionAdmin';
import ShippingOptionsAdmin from '@/pages/admin/ShippingOptionsAdmin';
import SocialNetworksAdmin from '@/pages/admin/SocialNetworksAdmin';
import ThemeSettings from '@/pages/admin/ThemeSettings';
import AnalyticsAdmin from '@/pages/admin/AnalyticsAdmin';
import EmailAdmin from '@/pages/admin/EmailAdmin';
import LexiqueAdmin from '@/pages/admin/LexiqueAdmin';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const queryClient = createOptimizedQueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="winshirt-theme">
        <OptimizedAuthProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/lotteries" element={<Lotteries />} />
                    <Route path="/lottery/:id" element={<LotteryDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/cancelled" element={<PaymentCancelled />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/winners" element={<Winners />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/lexique" element={<Lexique />} />
                    <Route path="/conditions-generales" element={<ConditionsGenerales />} />
                    <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                    <Route path="/reglement-du-jeu" element={<ReglementDuJeu />} />

                    {/* Protected Routes */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />
                    <Route path="/account" element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                      <ProtectedRoute requireAdmin>
                        <ProductsAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/lotteries" element={
                      <ProtectedRoute requireAdmin>
                        <LotteriesAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedRoute requireAdmin>
                        <UsersAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <ProtectedRoute requireAdmin>
                        <OrdersAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/designs" element={
                      <ProtectedRoute requireAdmin>
                        <DesignsAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/mockups" element={
                      <ProtectedRoute requireAdmin>
                        <MockupsAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/dtf-production" element={
                      <ProtectedRoute requireAdmin>
                        <DTFProductionAdmin />  
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/shipping-options" element={
                      <ProtectedRoute requireAdmin>
                        <ShippingOptionsAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/social-networks" element={
                      <ProtectedRoute requireAdmin>
                        <SocialNetworksAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/emails" element={
                      <ProtectedRoute requireAdmin>
                        <EmailAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/lexique" element={
                      <ProtectedRoute requireAdmin>
                        <LexiqueAdmin />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/theme" element={
                      <ProtectedRoute requireAdmin>
                        <ThemeSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <ProtectedRoute requireAdmin>
                        <AnalyticsAdmin />
                      </ProtectedRoute>
                    } />

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
              <Toaster />
            </Router>
          </CartProvider>
        </OptimizedAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
