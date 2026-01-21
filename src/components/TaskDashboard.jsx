import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Clock, Trash2, Target } from 'lucide-react';

const TaskDashboard = ({ tasks = [], onUpdateTasks }) => {
  const [newTask, setNewTask] = useState('');
  const [newHours, setNewHours] = useState(1);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const colors = ['border-primary', 'border-accent', 'border-secondary', 'border-emerald-500'];
    const task = {
      id: Date.now(),
      text: newTask,
      allocatedHours: Number(newHours),
      completed: false,
      color: colors[tasks.length % colors.length]
    };
    
    onUpdateTasks([...tasks, task]);
    setNewTask('');
    setNewHours(1);
  };

  const toggleTask = (id) => {
    onUpdateTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id) => {
    onUpdateTasks(tasks.filter(t => t.id !== id));
  };

  const totalAllocated = tasks.reduce((acc, t) => acc + t.allocatedHours, 0);

  return (
    <div className="w-full glass p-4 sm:p-6 rounded-3xl border-white/5 h-fit">

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Target size={20} className="text-primary" />
          Daily Focus Tasks
        </h3>
        <span className="text-xs bg-white/5 px-2 py-1 rounded-full text-gray-400">
          {totalAllocated}h Planned
        </span>
      </div>

      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What's the main goal?"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2">
          <Clock size={14} className="text-gray-500" />
          <input
            type="number"
            value={newHours}
            onChange={(e) => setNewHours(e.target.value)}
            min="0.5"
            step="0.5"
            className="w-10 bg-transparent text-sm focus:outline-none"
          />
          <span className="text-[10px] text-gray-500 mr-1">h</span>
        </div>
        <button
          type="submit"
          className="p-2 bg-primary rounded-xl hover:bg-primary/80 transition-colors"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`group flex items-center gap-3 p-3 rounded-2xl bg-white/5 border-l-4 ${task.color} hover:bg-white/10 transition-all`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 group-hover:border-white/30'
                }`}
              >
                {task.completed && <Check size={14} />}
              </button>
              
              <div className="flex-1">
                <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                  {task.text}
                </p>
                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
                  {task.allocatedHours} hours allocated
                </span>
              </div>

              <button
                onClick={() => removeTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
            <p className="text-gray-500 text-sm italic">Add your first task to start the day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;
