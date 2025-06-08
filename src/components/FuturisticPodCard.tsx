import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FuturisticPodCardProps {
  className?: string;
}

const FuturisticPodCard: React.FC<FuturisticPodCardProps> = ({ className }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,_theme(colors.red.500),theme(colors.orange.500),theme(colors.orange.300))] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className={cn(
          'relative w-full max-w-md p-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl shadow-[0_0_60px_rgba(255,255,255,0.1)] hover:scale-[1.01] transition-all duration-500',
          className
        )}
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 90%)' }}
      >
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="absolute top-4 right-4 space-y-2 text-white/60">
          <div className="h-2 w-16 bg-white/10 rounded-full" />
          <div className="h-2 w-12 bg-white/10 rounded-full" />
          <div className="flex space-x-2">
            <span className="h-6 w-6 rounded-full bg-white/20" />
            <span className="h-6 w-6 rounded-full bg-white/20" />
            <span className="h-6 w-6 rounded-full bg-white/20" />
          </div>
        </div>
        <p className="text-xs tracking-wide text-white/70 mb-4">Pod Series</p>
        <img src="/images/pod.png" alt="pod" className="mx-auto mb-6 w-40 h-40 object-contain" />
        <h2 className="text-4xl font-extralight text-white">360 POD</h2>
      </motion.div>
    </div>
  );
};

export default FuturisticPodCard;
