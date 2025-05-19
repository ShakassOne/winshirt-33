import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Lotteries from "@/pages/Lotteries";
import LotteryDetail from "@/pages/LotteryDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Payment from "@/pages/Payment";
import OrderConfirmation from "@/pages/OrderConfirmation";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/admin/Dashboard";
import ProductsAdmin from "@/pages/admin/ProductsAdmin";
import LotteriesAdmin from "@/pages/admin/LotteriesAdmin";
import DesignsAdmin from "@/pages/admin/DesignsAdmin";
import MockupsAdmin from "@/pages/admin/MockupsAdmin";
import ThemeSettings from "@/pages/admin/ThemeSettings";
import { CartProvider } from "@/context/CartContext";
import OrderDetail from "./pages/OrderDetail";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:productId" element={<ProductDetail />} />
              <Route path="lotteries" element={<Lotteries />} />
              <Route path="lotteries/:lotteryId" element={<LotteryDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="payment" element={<Payment />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="order/:orderId" element={<OrderDetail />} />
              
              {/* Admin routes */}
              <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="admin/dashboard" element={<Dashboard />} />
              <Route path="admin/products" element={<ProductsAdmin />} />
              <Route path="admin/lotteries" element={<LotteriesAdmin />} />
              <Route path="admin/designs" element={<DesignsAdmin />} />
              <Route path="admin/mockups" element={<MockupsAdmin />} />
              <Route path="admin/theme" element={<ThemeSettings />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
