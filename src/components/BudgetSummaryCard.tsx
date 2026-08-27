import React, { useState } from 'react';
import {
  DollarSign,
  CheckCircle2,
  ShoppingCart,
  TrendingDown,
  Sparkles,
  AlertCircle,
  Wand2,
  Tag,
  Loader2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PartyPlan, CymbalDepartment } from '../types';

interface BudgetSummaryCardProps {
  plan: PartyPlan;
  onOpenOptimizer: () => void;
  onAutoAlignBudget?: () => Promise<void>;
  isAutoAligning?: boolean;
  onProceedToCheckout?: () => void;
}

const DEPARTMENTS: { name: CymbalDepartment; color: string }[] = [
  { name: 'Produce', color: 'bg-emerald-500' },
  { name: 'Bakery & Deli', color: 'bg-amber-500' },
  { name: 'Meat & Seafood', color: 'bg-rose-500' },
  { name: 'Beverages & Bar', color: 'bg-blue-500' },
  { name: 'Snacks & Pantry', color: 'bg-orange-500' },
  { name: 'Party Supplies & Tableware', color: 'bg-purple-500' },
  { name: 'Cleanup & Essentials', color: 'bg-slate-500' },
];

export const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({
  plan,
  onOpenOptimizer,
  onAutoAlignBudget,
  isAutoAligning = false,
  onProceedToCheckout,
}) => {
  const [showDeptBreakdown, setShowDeptBreakdown] = useState(false);

  const totalEstimated = plan.shoppingList.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);
  const totalActual = plan.shoppingList.reduce(
    (acc, item) => acc + (item.isPurchased ? (item.actualCost ?? item.estimatedCost ?? 0) : 0),
    0
  );
  const purchasedCount = plan.shoppingList.filter((i) => i.isPurchased).length;
  const totalItems = plan.shoppingList.length;
  const completionPercent = totalItems > 0 ? Math.round((purchasedCount / totalItems) * 100) : 0;
  const isOverBudget = totalEstimated > plan.budget;
  const difference = Math.abs(plan.budget - totalEstimated);
  const storeBrandCount = plan.shoppingList.filter((i) => i.isStoreBrand).length;

  // Compute department totals
  const deptTotals = React.useMemo(() => {
    const map: Record<string, number> = {};
    plan.shoppingList.forEach((item) => {
      const dept = item.department || 'Produce';
      map[dept] = (map[dept] || 0) + (item.estimatedCost || 0);
    });
    return map;
  }, [plan.shoppingList]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/80">
              {plan.occasion}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {plan.theme} • {plan.venueType}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {plan.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Planning for <span className="font-semibold text-slate-800 dark:text-slate-200">{plan.adultCount} adults</span>
            {plan.kidCount > 0 && <>, <span className="font-semibold text-slate-800 dark:text-slate-200">{plan.kidCount} kids</span></>} • {plan.durationHours}h party
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {onAutoAlignBudget && (
            <button
              onClick={onAutoAlignBudget}
              disabled={isAutoAligning}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
              title="Automatically adjust quantities and store brands to fit target budget"
            >
              {isAutoAligning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>AI Aligning Budget...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Auto-Align Budget</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onOpenOptimizer}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Cost Optimizer</span>
          </button>

          {onProceedToCheckout && (
            <button
              onClick={onProceedToCheckout}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <span>Refine & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Planned Target Budget */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Target Budget</span>
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            ${plan.budget}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            ${plan.totalGuests > 0 ? (plan.budget / plan.totalGuests).toFixed(1) : 0}/guest
          </p>
        </div>

        {/* Estimated List Cost vs Budget Status */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Estimated Cart</span>
            <ShoppingCart className="w-3.5 h-3.5" />
          </div>
          <p className={`text-lg font-bold ${isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            ${totalEstimated.toFixed(0)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            {isOverBudget ? (
              <span className="text-rose-500 font-semibold flex items-center gap-0.5">
                <AlertCircle className="w-3 h-3" /> Over by ${difference.toFixed(0)}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ Under budget by ${difference.toFixed(0)}
              </span>
            )}
          </p>
        </div>

        {/* Store Brand / Cymbal Value */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Cymbal Brand Items</span>
            <Tag className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {storeBrandCount} / {totalItems}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Saves ~22% vs Name Brands
          </p>
        </div>

        {/* Shopping Progress */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Shopping Progress</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {completionPercent}%
          </p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Department Breakdown Toggle */}
      <div>
        <button
          onClick={() => setShowDeptBreakdown(!showDeptBreakdown)}
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer py-1"
        >
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>{showDeptBreakdown ? 'Hide' : 'View'} CymbalMart Department Cost Distribution</span>
        </button>

        {showDeptBreakdown && (
          <div className="mt-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEPARTMENTS.map((d) => {
                const cost = deptTotals[d.name] || 0;
                if (cost === 0) return null;
                const percent = totalEstimated > 0 ? Math.round((cost / totalEstimated) * 100) : 0;
                return (
                  <div key={d.name} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className={`w-2 h-2 rounded-full ${d.color}`} />
                      <span className="truncate">{d.name}</span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="font-bold text-slate-900 dark:text-white">${cost.toFixed(0)}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
