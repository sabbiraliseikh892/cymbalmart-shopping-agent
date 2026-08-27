import React, { useState } from 'react';
import { X, Sparkles, Loader2, Users, DollarSign, Clock, MapPin, Check } from 'lucide-react';
import { PartyPlan } from '../types';

interface PlanWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: PartyPlan) => void;
}

const OCCASIONS = [
  'Birthday Celebration',
  'Backyard BBQ & Cookout',
  'Cocktail Soirée & Grazing',
  'Kids Theme Party',
  'Dinner Party',
  'Game Night & Watch Party',
  'Graduation / Milestone',
  'Holiday Gathering',
  'Baby Shower / Bridal',
];

const VENUES = [
  { id: 'home', label: 'Home / Living Room', icon: '🏠' },
  { id: 'backyard', label: 'Backyard / Patio', icon: '🌳' },
  { id: 'park', label: 'Public Park / Beach', icon: '🏖️' },
  { id: 'hall', label: 'Rented Event Hall', icon: '🏛️' },
  { id: 'outdoor', label: 'Rooftop / Garden', icon: '🌿' },
];

const DIETARY_OPTIONS = [
  'Vegetarian Options',
  'Vegan Friendly',
  'Gluten-Free Safe',
  'Nut-Free Environment',
  'Dairy-Free Options',
  'Halal / Kosher',
  'Non-Alcoholic Mocktails Focus',
];

const VIBES = [
  'Festive & High Energy',
  'Chic & Sophisticated',
  'Casual & Laid-back',
  'Kid-Friendly & Playful',
  'Budget DIY & Thrifty',
];

export const PlanWizardModal: React.FC<PlanWizardModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
}) => {
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [theme, setTheme] = useState('Neon & Retro Fun');
  const [adultCount, setAdultCount] = useState(15);
  const [kidCount, setKidCount] = useState(0);
  const [durationHours, setDurationHours] = useState(3.5);
  const [budget, setBudget] = useState(300);
  const [venueType, setVenueType] = useState('backyard');
  const [dietary, setDietary] = useState<string[]>(['Gluten-Free Safe']);
  const [vibe, setVibe] = useState(VIBES[0]);
  const [customNotes, setCustomNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDietary = (item: string) => {
    setDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/party/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          theme,
          adultCount: Number(adultCount),
          kidCount: Number(kidCount),
          durationHours: Number(durationHours),
          budget: Number(budget),
          venueType,
          dietaryRestrictions: dietary,
          vibe,
          customNotes,
        }),
      });

      const data = await response.json();
      if (data.success && data.plan) {
        onPlanCreated(data.plan);
        onClose();
      } else {
        throw new Error(data.error || 'Failed to generate party plan');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while generating the party plan.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create New Party Plan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI will estimate exact portions, itemized supplies, and store runs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleGenerate} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Occasion & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Occasion Type
              </label>
              <select
                aria-label="Select occasion type"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white"
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Party Theme / Focus
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. 90s Neon Disco, Tropical Luau, Taco Fiesta"
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Headcount, Hours & Budget */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Adults
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={adultCount}
                onChange={(e) => setAdultCount(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kids / Teens
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={kidCount}
                onChange={(e) => setKidCount(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duration (hrs)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                step="0.5"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Budget ($ USD)
              </label>
              <input
                type="number"
                min="30"
                max="20000"
                step="25"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Venue Selector */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Venue Atmosphere
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {VENUES.map((v) => (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => setVenueType(v.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col items-center justify-center text-center gap-1 cursor-pointer ${
                    venueType === v.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-base">{v.icon}</span>
                  <span className="text-[11px] leading-tight">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions & Preferences */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Dietary & Inclusivity Preferences
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DIETARY_OPTIONS.map((d) => {
                const isSelected = dietary.includes(d);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleDietary(d)}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{d}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vibe Selection */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Overall Vibe
            </label>
            <div className="flex flex-wrap gap-1.5">
              {VIBES.map((vb) => (
                <button
                  type="button"
                  key={vb}
                  onClick={() => setVibe(vb)}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition cursor-pointer ${
                    vibe === vb
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {vb}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests / Notes */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Special Requests & Must-Haves (Optional)
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Must include a signature spicy mezcal drink, prioritize gluten-free appetizers, need lawn games."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Submit footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Planning Party & Shopping Lists...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
