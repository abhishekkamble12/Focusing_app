import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Trophy, LayoutDashboard } from 'lucide-react';
import { useTimer } from './hooks/useTimer';
import { useInactivity } from './hooks/useInactivity';
import { getStats, updateDailyTime, updateTasks, updateXP } from './utils/storage';

import Clock from './components/Clock';
import TimerControls from './components/TimerControls';
import StatsDashboard from './components/StatsDashboard';
import FocusMode from './components/FocusMode';
import Particles from './components/Particles';
import TaskDashboard from './components/TaskDashboard';
import XPOverlay from './components/XPOverlay';

export default function App() {
  const [stats, setStats] = useState(getStats());
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const { seconds, isActive, status, start, pause, stop } = useTimer();

  const handleInactivity = useCallback(() => {
    if (isActive && status === 'focused') {
      pause();
    }
  }, [isActive, status, pause]);

  const handleActivity = useCallback(() => {}, []);

  useInactivity(handleInactivity, handleActivity);

  const handleStop = () => {
    const sessionTime = stop();
    if (sessionTime > 0) {
      // Award XP immediately on stop
      const xpResult = updateXP(Math.floor(sessionTime / 60));
      if (xpResult.leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 5000);
      }
      
      const updatedStats = updateDailyTime(sessionTime);
      setStats({ ...updatedStats, xp: xpResult.stats.xp, level: xpResult.stats.level });
      checkAchievements(updatedStats);
    }
  };

  const handleUpdateTasks = (newTasks) => {
    const updatedStats = updateTasks(newTasks);
    setStats(updatedStats);
  };

  const checkAchievements = (currentStats) => {
    const today = new Date().toISOString().split('T')[0];
    const todayTime = currentStats.daily[today] || 0;
    
    let newAchievement = null;
    if (todayTime >= 3600 && !currentStats.achievements.includes('hour_focus')) {
      newAchievement = "The Prime Hour: Focused for 1 hour today!";
      currentStats.achievements.push('hour_focus');
    } else if (todayTime >= 14400 && !currentStats.achievements.includes('deep_work')) {
      newAchievement = "Deep Work Master: 4 hours of focus reached!";
      currentStats.achievements.push('deep_work');
    }

    if (newAchievement) {
      setShowAchievement(newAchievement);
      setTimeout(() => setShowAchievement(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary/30 overflow-x-hidden">
      <Particles />
      <XPOverlay level={stats.level} xp={stats.xp} showLevelUp={showLevelUp} />
      
      {/* Navbar */}
      <nav className="relative z-10 flex flex-col sm:flex-row justify-between items-center p-4 sm:p-8 max-w-[1600px] mx-auto gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent shrink-0" />
          <span className="text-xl font-bold tracking-tight">ChronoFlow</span>
          <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            PRO CMD CENTER
          </span>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFocusMode(true)}
            className="glass px-4 sm:px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 border-white/10 hover:bg-white/10 transition-colors"
          >
            <Maximize2 size={16} />
            <span className="hidden xs:inline">Focus Mode</span>
          </motion.button>
        </div>
      </nav>

      {/* Main Command Center Layout */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        
        {/* Left: Task Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-6"
        >
          <TaskDashboard tasks={stats.tasks} onUpdateTasks={handleUpdateTasks} />
          
          <div className="glass p-6 rounded-3xl border-white/5">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Command Tips</h4>
            <ul className="text-xs space-y-3 text-gray-500">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Allocate hours based on deep work capacity.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Use Focus Mode for tasks with {">"}2h allocation.
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Center: Clock & Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 flex flex-col items-center justify-center order-first lg:order-none py-10"
        >
          <Clock seconds={seconds} status={status} />

          
          <TimerControls 
            isActive={isActive} 
            status={status}
            onStart={start}
            onPause={pause}
            onStop={handleStop}
          />
          
          <div className="mt-12 flex items-center gap-8 text-gray-500 uppercase tracking-widest text-[10px] font-bold">
            <div className="flex items-center gap-2 transition-colors hover:text-primary cursor-default">
              <LayoutDashboard size={14} />
              Session Tracker Active
            </div>
          </div>
        </motion.div>

        {/* Right: Quick Stats Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-6"
        >
          <div className="glass p-6 rounded-3xl border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-bold uppercase tracking-widest">Today's Pulse</h4>
              <Trophy size={16} className="text-amber-500" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Streak</span>
                <span className="text-sm font-bold text-orange-500">{stats.streak} Days</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-full opacity-30" />
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-400">Focus XP</span>
                <span className="text-sm font-bold text-primary">{Math.round(stats.xp)} XP</span>
              </div>
            </div>
          </div>

          <div className="opacity-50 hover:opacity-100 transition-opacity">
             <StatsDashboard stats={stats} isMini={true} />
          </div>
        </motion.div>
      </main>

      {/* Achievement Toast */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60] glass px-8 py-4 rounded-3xl border-primary/20 flex items-center gap-4 bg-primary/10"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
              <Trophy size={24} />
            </div>
            <div>
              <h4 className="font-bold text-primary">Achievement Unlocked!</h4>
              <p className="text-sm text-gray-300">{showAchievement}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FocusMode 
        isActive={isFocusMode} 
        seconds={seconds} 
        onExit={() => setIsFocusMode(false)} 
      />

      <footer className="relative z-10 py-12 flex flex-col items-center opacity-30 mt-20">
        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />
        <span className="text-xs tracking-widest uppercase italic">ChronoFlow Command Center v2.0 • Forge Your Focus</span>
      </footer>
    </div>
  );
}
