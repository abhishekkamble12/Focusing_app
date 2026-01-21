import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock as ClockIcon, Calendar, Target, Flame, Award } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, isStreak }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass p-6 rounded-3xl border-white/5 flex flex-col gap-2 relative overflow-hidden"
  >
    {isStreak && (
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/20 blur-2xl rounded-full"
      />
    )}
    <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center text-${color} relative z-10`}>
      {isStreak ? <Flame className="animate-pulse" size={20} /> : <Icon size={20} />}
    </div>
    <span className="text-gray-400 text-sm mt-2 relative z-10">{title}</span>
    <span className="text-2xl font-bold relative z-10 flex items-center gap-2">
      {value}
      {isStreak && (
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame fill="#f97316" className="text-orange-500" size={18} />
        </motion.div>
      )}
    </span>
  </motion.div>
);


const StatsDashboard = ({ stats, isMini = false }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayTime = stats.daily[today] || 0;
  
  const formatTime = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const progress = Math.min((todayTime / stats.goals.daily) * 100, 100);

  // Mock weekly data for visualization
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const time = stats.daily[dayStr] || (Math.random() * 10000); // Mock data for empty days
    return { dayName, time };
  });

  const maxTime = Math.max(...last7Days.map(d => d.time), 14400);

  if (isMini) {
    return (
      <div className="space-y-4">
        <StatsCard 
          title="Focused Today" 
          value={formatTime(todayTime)} 
          icon={ClockIcon} 
          color="indigo-400" 
        />
        <div className="glass p-6 rounded-3xl border-white/5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 text-center">Week Pattern</h4>
          <div className="flex items-end justify-between h-12 gap-1 px-1">
            {last7Days.map((day, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(day.time / maxTime) * 100}%` }}
                className="flex-1 bg-primary/20 rounded-t-sm"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl px-6 mt-20 mb-20 space-y-12">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Focused Today" 
          value={formatTime(todayTime)} 
          icon={ClockIcon} 
          color="indigo-400" 
        />
        <StatsCard 
          title="Productivity Streak" 
          value={`${stats.streak} Days`} 
          icon={TrendingUp} 
          color="orange-500" 
          isStreak={true}
        />
        <StatsCard 
          title="Daily Goal" 
          value={`${Math.round(progress)}%`} 
          icon={Target} 
          color="pink-400" 
        />
        <StatsCard 
          title="Achievements" 
          value={`${stats.achievements.length} Unlocked`} 
          icon={Award} 
          color="amber-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Ring Card */}
        <div className="glass p-8 rounded-3xl border-white/5 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-8 self-start text-gray-200">Goal Progress</h3>
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 88}
                initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                animate={{ strokeDashoffset: (2 * Math.PI * 88) * (1 - progress / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{Math.round(progress)}%</span>
              <span className="text-gray-400 text-xs uppercase tracking-wider">of daily goal</span>
            </div>
          </div>
          <p className="mt-8 text-gray-400 text-sm text-center">
            Focused for <span className="text-primary font-bold">{formatTime(todayTime)}</span> today.
          </p>
        </div>

        {/* Weekly Chart Card */}
        <div className="glass p-8 rounded-3xl border-white/5 lg:col-span-2">
          <h3 className="text-xl font-bold mb-8 text-gray-200">Weekly Productivity</h3>
          <div className="flex items-end justify-between h-48 gap-4 px-2">
            {last7Days.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4">
                <div className="relative w-full group">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.time / maxTime) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`w-full max-w-[48px] mx-auto rounded-t-xl bg-gradient-to-t from-primary/20 to-primary group-hover:from-primary/40 group-hover:to-accent transition-all duration-300`}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-surface border border-white/10 px-2 py-1 rounded text-[10px] z-20">
                    {formatTime(Math.round(day.time))}
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 uppercase font-medium tracking-tighter">{day.dayName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievement Gallery */}
      <div className="glass p-8 rounded-3xl border-white/5">
        <h3 className="text-xl font-bold mb-8 text-gray-200">Unlocked Milestones</h3>
        <div className="flex flex-wrap gap-4">
          {stats.achievements.length > 0 ? (
            stats.achievements.map((ach, i) => (
              <motion.div
                key={ach}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <Award size={18} />
                </div>
                <span className="text-sm font-medium text-gray-300">
                  {ach === 'hour_focus' ? 'The Prime Hour' : ach === 'deep_work' ? 'Deep Work Master' : ach}
                </span>
              </motion.div>
            ))
          ) : (
            <div className="w-full py-8 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
              <Award size={32} className="mb-2 opacity-20" />
              <p className="text-sm">Complete your first focus hour to unlock milestones.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};


export default StatsDashboard;
