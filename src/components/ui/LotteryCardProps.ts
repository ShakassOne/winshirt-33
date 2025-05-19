
import { Lottery } from '@/types/supabase.types';

export interface LotteryCardProps {
  lottery: Lottery;
  id?: string;
  title?: string;
  image?: string;
  value?: number;
  participants?: number;
  goal?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  drawDate?: Date;
  key?: string;
}
