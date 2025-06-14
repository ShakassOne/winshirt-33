import logger from '@/utils/logger';

import { useStableAdminQuery } from './useStableAdminQuery';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  uniqueCustomers: number;
  conversionRate: number;
  salesByDay: { date: string; revenue: number; orders: number }[];
  topProducts: { name: string; revenue: number; quantity: number }[];
  lotteryStats: { 
    title: string; 
    participants: number; 
    goal: number; 
    percentage: number;
    value: number;
  }[];
}

export const useAnalyticsData = () => {
  return useStableAdminQuery<AnalyticsData>({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      logger.log('🔄 [Analytics] Fetching analytics data...');
      
      // Récupérer les commandes payées
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_status', 'paid');
      
      if (ordersError) throw ordersError;

      // Récupérer les items de commandes avec produits
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products:product_id (*),
          orders:order_id (payment_status, created_at)
        `);
      
      if (itemsError) throw itemsError;

      // Récupérer les statistiques des loteries
      const { data: lotteries, error: lotteriesError } = await supabase
        .from('lotteries')
        .select('*')
        .eq('is_active', true);
      
      if (lotteriesError) throw lotteriesError;

      // Filtrer les items des commandes payées
      const paidOrderItems = orderItems.filter(
        item => item.orders?.payment_status === 'paid'
      );

      // Calculer les métriques principales
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount as any), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const uniqueCustomers = new Set(orders.map(order => order.user_id || order.guest_email)).size;
      
      // Simuler un taux de conversion (sessions vs commandes)
      const conversionRate = totalOrders > 0 ? (totalOrders / (totalOrders * 10)) * 100 : 0;

      // Analyser les ventes par jour (30 derniers jours)
      const salesByDay = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.filter(order => 
          order.created_at?.split('T')[0] === dateStr
        );
        
        salesByDay.push({
          date: dateStr,
          revenue: dayOrders.reduce((sum, order) => sum + parseFloat(order.total_amount as any), 0),
          orders: dayOrders.length
        });
      }

      // Top des produits
      const productStats = new Map();
      paidOrderItems.forEach(item => {
        const productName = item.products?.name || 'Produit inconnu';
        const revenue = parseFloat(item.price as any) * item.quantity;
        
        if (productStats.has(productName)) {
          const existing = productStats.get(productName);
          productStats.set(productName, {
            name: productName,
            revenue: existing.revenue + revenue,
            quantity: existing.quantity + item.quantity
          });
        } else {
          productStats.set(productName, {
            name: productName,
            revenue,
            quantity: item.quantity
          });
        }
      });

      const topProducts = Array.from(productStats.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Statistiques des loteries
      const lotteryStats = lotteries.map(lottery => ({
        title: lottery.title,
        participants: lottery.participants || 0,
        goal: lottery.goal,
        percentage: lottery.goal > 0 ? ((lottery.participants || 0) / lottery.goal) * 100 : 0,
        value: parseFloat(lottery.value as any)
      }));

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        uniqueCustomers,
        conversionRate,
        salesByDay,
        topProducts,
        lotteryStats
      };
    },
    debugName: 'Analytics'
  });
};
