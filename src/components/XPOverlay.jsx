import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp } from 'lucide-react';

const XPOverlay = ({ level, xp, showLevelUp }) => {
  const xpForNextLevel = Math.floor(100 * Math.pow(level, 1.5));
  const progress = (xp / xpForNextLevel) * 100;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs px-4">
      <div className="glass px-6 py-3 rounded-2xl flex flex-col gap-2 border-white/10 group transition-all hover:border-primary/30">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20 font-bold group-hover:scale-110 transition-transform">
              {level}
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-primary transition-colors">
              Focus Level
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            {Math.round(xp)} / {xpForNextLevel} XP
          </span>
        </div>
        
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="h-full bg-gradient-to-r from-primary to-accent"
          />
        </div>
      </div>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 glass px-8 py-6 rounded-3xl border-primary bg-primary/10 flex flex-col items-center gap-4 shadow-2xl shadow-primary/20 backdrop-blur-2xl"
          >
            <div className="p-4 rounded-full bg-primary/20 text-primary">
              <ArrowUp size={32} className="animate-bounce" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-gradient uppercase tracking-tighter italic">Level Up!</h2>
              <p className="text-gray-400 text-sm">You've reached Level {level}</p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="text-accent" size={24} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default XPOverlay;
