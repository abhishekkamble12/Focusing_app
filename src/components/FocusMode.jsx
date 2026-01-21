import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minimize2 } from 'lucide-react';

const FocusMode = ({ isActive, seconds, onExit }) => {
  const formatElapsed = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
        >
          {/* Ambient Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full"
            />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 flex flex-col items-center px-4"
          >
            <span className="text-primary tracking-[0.2em] sm:tracking-[0.5em] uppercase text-xs sm:text-sm mb-4 sm:mb-8 animate-pulse text-center">Deep Focus</span>
            <h1 className="text-5xl sm:text-9xl font-thin tracking-tighter tabular-nums mb-8 sm:mb-12 text-center">
              {formatElapsed(seconds)}
            </h1>

            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExit}
              className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Minimize2 size={24} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusMode;
