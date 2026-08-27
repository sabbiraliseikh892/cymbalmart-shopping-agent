import React from 'react';
import { Sparkles, ClipboardList, CheckCircle, ChevronRight, DollarSign, Store, ShoppingBag, ArrowRight } from 'lucide-react';
import { CUJStep, PartyPlan } from '../types';

interface CUJStepperProps {
  currentStep: CUJStep;
  onSelectStep?: (step: CUJStep) => void;
  onStepClick?: (step: CUJStep) => void;
  plan?: PartyPlan;
  totalCost?: number;
}

export const CUJStepper: React.FC<CUJStepperProps> = ({
  currentStep,
  onSelectStep,
  onStepClick,
  plan,
  totalCost,
}) => {
  const handleStepChange = (step: CUJStep) => {
    if (onSelectStep) onSelectStep(step);
    else if (onStepClick) onStepClick(step);
  };

  const budget = plan?.budget ?? 350;
  const guests = plan?.totalGuests ?? 15;
  const itemsCount = plan?.shoppingList?.length ?? 0;
  const computedTotal = totalCost ?? (plan?.shoppingList ? plan.shoppingList.reduce((acc, i) => acc + (i.estimatedCost || 0), 0) : 0);
  const variance = budget - computedTotal;
  const isBudgetAligned = variance >= 0;

  const steps = [
    {
      id: 'define' as CUJStep,
      number: '1',
      title: 'Define Event',
      subtitle: `${guests} Guests • $${budget} Budget`,
      icon: Sparkles,
      tag: plan?.theme || 'Party Setup',
    },
    {
      id: 'review' as CUJStep,
      number: '2',
      title: 'Review & Align Budget',
      subtitle: isBudgetAligned ? `$${Math.abs(variance).toFixed(0)} under budget` : `$${Math.abs(variance).toFixed(0)} over budget`,
      icon: ClipboardList,
      tag: `${itemsCount} Items ($${computedTotal.toFixed(0)})`,
      isWarning: !isBudgetAligned,
    },
    {
      id: 'refine_checkout' as CUJStep,
      number: '3',
      title: 'Refine & Checkout',
      subtitle: 'Fulfillment & Order Confirmation',
      icon: ShoppingBag,
      tag: 'Pickup & Delivery',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-xs mb-5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Step Tabs */}
        <div className="grid grid-cols-3 gap-2 flex-1">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => handleStepChange(step.id)}
                className={`relative flex items-center gap-2.5 p-2.5 sm:px-3.5 sm:py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/80 shadow-xs ring-1 ring-emerald-500/20'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Step {step.number}
                    </span>
                    {step.isWarning && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                    {step.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Action to Next Step */}
        <div className="flex items-center justify-between md:justify-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="text-right hidden lg:block">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Total</span>
            <span className={`text-sm font-extrabold ${isBudgetAligned ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              ${computedTotal.toFixed(0)} <span className="text-[11px] text-slate-400 font-normal">/ ${budget}</span>
            </span>
          </div>

          {currentStep === 'define' && (
            <button
              onClick={() => handleStepChange('review')}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>Review List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 'review' && (
            <button
              onClick={() => handleStepChange('refine_checkout')}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>Refine & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStep === 'refine_checkout' && (
            <button
              onClick={() => handleStepChange('review')}
              className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
            >
              <span>Back to List</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
