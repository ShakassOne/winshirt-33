import React from "react";
import { motion } from "framer-motion";

const NetflixPodUI: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_center,theme(colors.red.700),theme(colors.red.900))] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-xl p-8 backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.1)] transition-all duration-500 hover:scale-105"
        style={{ WebkitMaskImage: 'radial-gradient(white, transparent 70%)' }}
      >
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <h3 className="absolute top-4 left-1/2 -translate-x-1/2 text-sm text-white/60">NETFLIX</h3>
        <div className="absolute inset-y-12 right-4 w-40 flex flex-col justify-between">
          <div className="flex justify-center space-x-2 text-xs text-white/60 mb-4">
            <span className="px-2 py-1 bg-white/10 rounded-md">Shows</span>
            <span className="px-2 py-1 bg-white/10 rounded-md">Movies</span>
          </div>
          <div className="space-y-3 text-white/70 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/20" />
              <span>Dark City</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/20" />
              <span>Space Drift</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-white/20" />
              <span>Neon Dreams</span>
            </div>
          </div>
        </div>
        <img src="/images/pod.png" alt="pod" className="mx-auto my-16 w-52 h-52 object-contain" />
        <p className="text-4xl font-thin tracking-widest text-white text-center">360 POD</p>
      </motion.div>
    </div>
  );
};

export default NetflixPodUI;
