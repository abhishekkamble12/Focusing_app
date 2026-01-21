const STORAGE_KEY = 'chrono_flow_stats';

export const saveStats = (stats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const getStats = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  const defaults = {
    daily: {},
    weekly: [],
    streak: 0,
    lastActiveDate: null,
    achievements: [],
    goals: { daily: 14400 },
    tasks: [],
    xp: 0,
    level: 1
  };
  
  if (!data) return defaults;
  
  try {
    const parsed = JSON.parse(data);
    return { ...defaults, ...parsed };
  } catch (e) {
    return defaults;
  }
};


export const updateXP = (amount) => {
  const stats = getStats();
  stats.xp += amount;
  
  // Exponential leveling curve: 100 * level^1.5
  const xpForNextLevel = Math.floor(100 * Math.pow(stats.level, 1.5));
  if (stats.xp >= xpForNextLevel) {
    stats.xp -= xpForNextLevel;
    stats.level += 1;
    saveStats(stats);
    return { stats, leveledUp: true };
  }
  
  saveStats(stats);
  return { stats, leveledUp: false };
};

export const updateTasks = (tasks) => {
  const stats = getStats();
  stats.tasks = tasks;
  saveStats(stats);
  return stats;
};


export const updateDailyTime = (seconds) => {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  
  stats.daily[today] = (stats.daily[today] || 0) + seconds;
  
  // Update streak logic
  if (stats.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (stats.lastActiveDate === yesterdayStr) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.lastActiveDate = today;
  }
  
  saveStats(stats);
  
  // Award XP: 1 XP per minute of focus
  const xpResult = updateXP(Math.floor(seconds / 60));
  
  return xpResult.stats;
};

