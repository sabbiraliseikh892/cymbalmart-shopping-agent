import React, { useState, useEffect } from 'react';
import { X, Sparkles, TrendingDown, Check, Loader2, ArrowRight } from 'lucide-react';
import { PartyPlan } from '../types';

interface CostOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
}

export const CostOptimizerModal: React.FC<CostOptimizerModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  const [loading, setLoading] = useState(false);
  const [tipsText, setTipsText] = useState('');
  const [activeTab, setActiveTab] = useState<'save_money' | 'elevate_vibe'>('save_money');

  useEffect(() => {
    if (isOpen) {
      fetchOptimization(activeTab);
    }
  }, [isOpen, activeTab]);

  const fetchOptimization = async (goal: 'save_money' | 'elevate_vibe') => {
    setLoading(true);
    try {
      const res = await fetch('/api/party/optimize-shopping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shoppingList: plan.shoppingList,
          budget: plan.budget,
          goal,
        }),
      });
      const data = await res.json();
      if (data.success && data.optimizationTips) {
        setTipsText(data.optimizationTips);
      } else {
        setTipsText(
          '1. Buy meats, chips, and canned beverages in bulk at Costco to save 30%.\n2. Pick up specialty cheeses, dips, and produce at Trader Joe\'s instead of premium delis.\n3. Make batch punch or margaritas in a large beverage dispenser rather than buying individual canned cocktails.'
        );
      }
    } catch (e) {
      setTipsText(
        '1. Buy non-perishables and beverages in bulk.\n2. Batch-prepare cocktails in a dispenser to save on individual mixers.\n3. Focus budget on 2 hero appetizers and fill the table with rustic bread and dips.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Shopping & Budget Optimizer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Selector */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('save_money')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'save_money'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Cut Costs by 20-30%</span>
          </button>

          <button
            onClick={() => setActiveTab('elevate_vibe')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'elevate_vibe'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Elevate Presentation</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {loading ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" />
              <p>Analyzing grocery items, portion ratios, and store pricing...</p>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
              {tipsText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
