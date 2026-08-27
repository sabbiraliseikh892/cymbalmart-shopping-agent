import React from 'react';
import { Wine, Utensils, Lightbulb, Sparkles, Plus, Check } from 'lucide-react';
import { PartyPlan } from '../types';

interface RecipesAndTipsViewProps {
  plan: PartyPlan;
  onAddIngredientToShoppingList: (name: string) => void;
  onAskAiForRecipe: () => void;
}

export const RecipesAndTipsView: React.FC<RecipesAndTipsViewProps> = ({
  plan,
  onAddIngredientToShoppingList,
  onAskAiForRecipe,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Signature Menu & Host Pro-Tips
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Batch recipes, signature cocktails, and hosting hacks matched to your theme.
            </p>
          </div>
        </div>

        <button
          onClick={onAskAiForRecipe}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask CymbalMart Assistant</span>
        </button>
      </div>

      {/* Recipes / Cocktails Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(plan.recipesOrCocktails || []).map((recipe, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🍹</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {recipe.name}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                {recipe.description}
              </p>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Key Ingredients & Proportions
                </h5>
                <div className="space-y-1.5">
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                      <span>• {ing}</span>
                      <button
                        onClick={() => onAddIngredientToShoppingList(ing)}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                        title="Add to shopping list"
                      >
                        <Plus className="w-3 h-3" /> Add item
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Host Pro Tips Card */}
      <div className="bg-gradient-to-br from-amber-500/5 via-emerald-500/5 to-slate-900/5 dark:from-amber-950/20 dark:via-emerald-950/20 dark:to-slate-900/40 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-300">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Host Experience & Workflow Hacks
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(plan.tips || []).map((tip, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-amber-100 dark:border-slate-700/60 p-3.5 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
            >
              <span className="font-bold text-amber-500">#{idx + 1}</span>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
