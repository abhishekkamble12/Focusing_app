import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
  "Time is the wisest counselor of all. — Pericles",
  "The key is in not spending time, but in investing it. — Stephen Covey",
  "Your time is limited, so don't waste it living someone else's life. — Steve Jobs",
  "Time is what we want most, but what we use worst. — William Penn",
  "Lost time is never found again. — Benjamin Franklin"
];

const Clock = ({ seconds, status }) => {
  const [time, setTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 10000);
    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatElapsed = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (status) {
      case 'focused': return 'from-primary to-accent';
      case 'paused': return 'from-yellow-400 to-orange-500';
      default: return 'from-blue-400 to-cyan-500';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Outer Pulse */}
      <motion.div
        animate={{
          scale: status === 'focused' ? [1, 1.05, 1] : 1,
          opacity: status === 'focused' ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full bg-gradient-radial ${getStatusColor()} blur-3xl`}
      />

      {/* Main Clock Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-64 h-64 sm:w-80 sm:h-80 rounded-full flex flex-col items-center justify-center relative z-10 border-white/10"
      >
        <span className="text-gray-400 text-[10px] sm:text-sm mb-1 tracking-widest uppercase">Current Time</span>
        <h2 className="text-3xl sm:text-5xl font-light tracking-tighter mb-4 tabular-nums text-center">
          {formatTime(time)}
        </h2>
        
        <div className="h-[1px] w-16 sm:w-24 bg-white/10 mb-4" />
        
        <span className="text-gray-400 text-[10px] sm:text-sm mb-1 tracking-widest uppercase">Session</span>
        <motion.h3 
          key={seconds}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl sm:text-4xl font-bold tabular-nums bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent`}
        >
          {formatElapsed(seconds)}
        </motion.h3>
      </motion.div>


      {/* Quote */}
      <div className="mt-12 h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-gray-400 italic text-center max-w-md px-6"
          >
            {QUOTES[quoteIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Clock;
