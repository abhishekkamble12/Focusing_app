import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Zap } from 'lucide-react';

const TimerControls = ({ isActive, status, onStart, onPause, onStop }) => {
  return (
    <div className="flex items-center gap-6 mt-12 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
      {!isActive || status === 'paused' ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20"
        >
          <Play fill="currentColor" size={28} />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPause}
          className="w-16 h-16 rounded-2xl bg-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20"
        >
          <Pause fill="currentColor" size={28} />
        </motion.button>
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStop}
        disabled={status === 'idle'}
        className={`w-16 h-16 rounded-2xl ${status === 'idle' ? 'bg-white/5 text-gray-600' : 'bg-red-500 text-white shadow-red-500/20'} flex items-center justify-center shadow-lg transition-colors`}
      >
        <Square fill="currentColor" size={28} />
      </motion.button>

      <div className="w-[1px] h-8 bg-white/10" />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20"
      >
        <Zap fill="currentColor" size={28} />
      </motion.button>
    </div>
  );
};

export default TimerControls;
