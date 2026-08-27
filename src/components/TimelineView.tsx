import React, { useState } from 'react';
import { Calendar, Clock, Check, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: { timeframe: any; task: string; category: any }) => void;
  onDeleteTask: (id: string) => void;
}

const TIMEFRAME_LABELS: Record<string, { label: string; badgeColor: string }> = {
  '2_weeks_prior': { label: '2 Weeks Prior', badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900' },
  '1_week_prior': { label: '1 Week Prior', badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900' },
  '3_days_prior': { label: '3 Days Prior (Major Store Runs)', badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900' },
  '1_day_prior': { label: '1 Day Prior (Food Prep & Chilling)', badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900' },
  'day_of_morning': { label: 'Day of Party (Morning)', badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900' },
  '2_hours_prior': { label: 'Final 2 Hours (Party Launch)', badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900' },
};

const CATEGORY_TAGS: Record<string, string> = {
  shopping: '🛒 Shopping',
  prep: '🔪 Kitchen Prep',
  cooking: '🔥 Cooking',
  decor: '🎈 Decorating',
  setup: '✨ Setup & Ambiance',
};

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTimeframe, setNewTimeframe] = useState<TimelineEvent['timeframe']>('1_day_prior');
  const [newCategory, setNewCategory] = useState<TimelineEvent['category']>('prep');

  const timeframes: TimelineEvent['timeframe'][] = [
    '2_weeks_prior',
    '1_week_prior',
    '3_days_prior',
    '1_day_prior',
    'day_of_morning',
    '2_hours_prior',
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddTask({
      timeframe: newTimeframe,
      task: newTaskText.trim(),
      category: newCategory,
    });
    setNewTaskText('');
    setIsAdding(false);
  };

  const completedCount = timeline.filter((t) => t.completed).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Party Countdown & Shopping Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedCount} of {timeline.length} prep milestones completed
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Milestone</span>
        </button>
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            New Countdown Milestone
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              aria-label="Select milestone timeframe"
              value={newTimeframe}
              onChange={(e) => setNewTimeframe(e.target.value as any)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            >
              {timeframes.map((tf) => (
                <option key={tf} value={tf}>
                  {TIMEFRAME_LABELS[tf]?.label || tf}
                </option>
              ))}
            </select>

            <select
              aria-label="Select milestone category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            >
              <option value="shopping">🛒 Shopping</option>
              <option value="prep">🔪 Kitchen Prep</option>
              <option value="cooking">🔥 Cooking</option>
              <option value="decor">🎈 Decorating</option>
              <option value="setup">✨ Setup</option>
            </select>

            <input
              type="text"
              placeholder="e.g. Chill prosecco in ice buckets"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="sm:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Phased Timeline List */}
      <div className="space-y-4">
        {timeframes.map((tf) => {
          const tasks = timeline.filter((t) => t.timeframe === tf);
          if (tasks.length === 0) return null;

          const meta = TIMEFRAME_LABELS[tf] || { label: tf, badgeColor: 'bg-slate-100' };

          return (
            <div
              key={tf}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${meta.badgeColor}`}>
                  {meta.label}
                </span>
                <span className="text-xs text-slate-400">
                  {tasks.filter((t) => t.completed).length}/{tasks.length} done
                </span>
              </div>

              <div className="space-y-2 mt-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between gap-3 p-2.5 rounded-xl border transition ${
                      task.completed
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-400'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 cursor-pointer ${
                          task.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'
                        }`}
                      >
                        <Check className={`w-3 h-3 stroke-[3] ${task.completed ? 'opacity-100' : 'opacity-0'}`} />
                      </button>

                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.task}
                        </p>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 inline-block">
                          {CATEGORY_TAGS[task.category] || task.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition"
                      title="Remove task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
