import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  DollarSign,
  Clock,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  HelpCircle,
  Wand2,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  Tag
} from 'lucide-react';
import { PartyPlan } from '../types';
import { PRESET_PARTIES } from '../data/presets';

interface DefineEventViewProps {
  plan?: PartyPlan;
  initialPlan?: PartyPlan;
  onUpdatePlan?: (updated: PartyPlan) => void;
  onPlanCreated?: (plan: PartyPlan) => void;
  onSelectPreset?: (preset: PartyPlan | string) => void;
  onGenerateWithAI?: (formData: any) => Promise<void>;
  isGenerating?: boolean;
  onProceedToReview?: () => void;
}

const OCCASIONS = [
  'Birthday Celebration',
  'Casual Backyard BBQ',
  'Cocktail & Grazing Soirée',
  'Dinner Party & Wine Night',
  'Kids / Family Carnival',
  'Game Day & Tailgate Cookout',
  'Holiday & Festive Gathering',
  'Baby / Bridal Shower',
];

const VENUE_TYPES = [
  { id: 'backyard', label: 'Backyard / Patio', desc: 'Grill & outdoor lawn' },
  { id: 'home', label: 'Living Room / Kitchen', desc: 'Cozy indoor gathering' },
  { id: 'park', label: 'Public Park / Pavilion', desc: 'Coolers & picnic tables' },
  { id: 'hall', label: 'Rented Venue / Hall', desc: 'Formal catering tables' },
];

export const DefineEventView: React.FC<DefineEventViewProps> = ({
  plan,
  initialPlan,
  onUpdatePlan,
  onPlanCreated,
  onSelectPreset: externalSelectPreset,
  onGenerateWithAI,
  isGenerating: externalIsGenerating = false,
  onProceedToReview,
}) => {
  const activePlan = plan || initialPlan;

  const [occasion, setOccasion] = useState(activePlan?.occasion || OCCASIONS[0]);
  const [theme, setTheme] = useState(activePlan?.theme || 'Festive & Fun');
  const [adultCount, setAdultCount] = useState(activePlan?.adultCount ?? 15);
  const [kidCount, setKidCount] = useState(activePlan?.kidCount ?? 0);
  const [durationHours, setDurationHours] = useState(activePlan?.durationHours ?? 3.5);
  const [budget, setBudget] = useState(activePlan?.budget ?? 350);
  const [venueType, setVenueType] = useState<any>(activePlan?.venueType || 'backyard');
  const [selectedDietary, setSelectedDietary] = useState<string[]>(activePlan?.dietaryRestrictions || []);
  const [vibe, setVibe] = useState(activePlan?.vibe || 'Festive & Lively');
  const [specialRequests, setSpecialRequests] = useState(activePlan?.specialRequests || '');
  const [internalGenerating, setInternalGenerating] = useState(false);

  const isGenerating = externalIsGenerating || internalGenerating;
  const totalGuests = adultCount + kidCount;

  // Sync state if activePlan changes from outside
  React.useEffect(() => {
    if (activePlan) {
      if (activePlan.occasion) setOccasion(activePlan.occasion);
      if (activePlan.theme) setTheme(activePlan.theme);
      if (typeof activePlan.adultCount === 'number') setAdultCount(activePlan.adultCount);
      if (typeof activePlan.kidCount === 'number') setKidCount(activePlan.kidCount);
      if (typeof activePlan.durationHours === 'number') setDurationHours(activePlan.durationHours);
      if (typeof activePlan.budget === 'number') setBudget(activePlan.budget);
      if (activePlan.venueType) setVenueType(activePlan.venueType);
      if (activePlan.dietaryRestrictions) setSelectedDietary(activePlan.dietaryRestrictions);
      if (activePlan.vibe) setVibe(activePlan.vibe);
      if (activePlan.specialRequests !== undefined) setSpecialRequests(activePlan.specialRequests);
    }
  }, [activePlan?.id]);

  const handleToggleDietary = (item: string) => {
    if (selectedDietary.includes(item)) {
      setSelectedDietary(selectedDietary.filter((d) => d !== item));
    } else {
      setSelectedDietary([...selectedDietary, item]);
    }
  };

  const handleSelectPreset = (preset: PartyPlan) => {
    const updated: PartyPlan = {
      ...preset,
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (onPlanCreated) onPlanCreated(updated);
    else if (onUpdatePlan) onUpdatePlan(updated);

    if (externalSelectPreset) {
      externalSelectPreset(preset.id);
    }

    setOccasion(preset.occasion);
    setTheme(preset.theme);
    setAdultCount(preset.adultCount);
    setKidCount(preset.kidCount);
    setDurationHours(preset.durationHours);
    setBudget(preset.budget);
    setVenueType(preset.venueType);
    setSelectedDietary(preset.dietaryRestrictions || []);
    setVibe(preset.vibe);
    setSpecialRequests(preset.specialRequests || '');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      occasion,
      theme,
      adultCount,
      kidCount,
      durationHours,
      budget,
      venueType,
      dietaryRestrictions: selectedDietary,
      vibe,
      customNotes: specialRequests,
    };

    if (onGenerateWithAI) {
      await onGenerateWithAI(formData);
    } else {
      setInternalGenerating(true);
      try {
        const response = await fetch('/api/party/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success && data.plan) {
          if (onPlanCreated) onPlanCreated(data.plan);
          else if (onUpdatePlan) onUpdatePlan(data.plan);
        }
      } catch (err) {
        console.error('Error generating party plan:', err);
      } finally {
        setInternalGenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* CUJ Step 1 Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                Task 1: Define Event
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                AI Intent Intake for Busy Hosts
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Define Your Party Requirements & Budget Constraints
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specify your event theme, headcount, budget cap, dietary guidelines, and custom requests. CymbalMart's AI Agent will calculate portion math and curate the exact grocery list.
            </p>
          </div>

          <button
            onClick={onProceedToReview}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shrink-0 cursor-pointer"
          >
            <span>Skip to List Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Starters */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Popular CymbalMart Event Blueprints</span>
          </h3>
          <span className="text-[11px] text-slate-400">1-click to auto-populate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_PARTIES.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-xs transition text-left cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {p.occasion}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {p.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {p.theme}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {p.totalGuests} guests • {p.durationHours} hrs
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${p.budget}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Event Intake Form */}
      <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-emerald-500" />
            <span>Customize Event Parameters</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">All fields ground CymbalMart portions</span>
        </div>

        {/* Occasion & Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Party Occasion
            </label>
            <select
              aria-label="Party occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white font-medium"
            >
              {OCCASIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Event Theme & Style
            </label>
            <input
              type="text"
              placeholder="e.g. Street Taco Bar, Tuscan Sunset, 80s Disco Arcade"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Headcount & Duration & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Adult Guests
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="200"
                value={adultCount}
                onChange={(e) => setAdultCount(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">1.5 drinks/hr avg</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Kids & Teens
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={kidCount}
              onChange={(e) => setKidCount(Math.max(0, Number(e.target.value)))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">1.0 drink/hr + snacks</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Duration (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="12"
              step="0.5"
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Paces food replenishment</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Budget Target ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="50"
                max="5000"
                step="25"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-6 pr-3 py-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              ~${(budget / Math.max(1, totalGuests)).toFixed(1)} per guest
            </span>
          </div>
        </div>

        {/* Venue Type Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Venue Environment
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {VENUE_TYPES.map((v) => (
              <button
                type="button"
                key={v.id}
                onClick={() => setVenueType(v.id)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  venueType === v.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">{v.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{v.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Restrictions Toggles */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Dietary Constraints & Allergies
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Gluten-Free Friendly',
              'Vegetarian Option',
              'Vegan Friendly',
              'Nut-Free (Strict)',
              'Dairy-Free Alternative',
              'Halal / Kosher Aware',
              'Non-Alcoholic Bar Focus',
            ].map((diet) => {
              const isSelected = selectedDietary.includes(diet);
              return (
                <button
                  type="button"
                  key={diet}
                  onClick={() => handleToggleDietary(diet)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{diet}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Special Requests & Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Include custom sheet cake from CymbalMart bakery, batch mocktails for kids, lots of avocados for guacamole bar..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {/* Submit button */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Generating will calculate portions and create an itemized shopping list for CymbalMart.
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>AI Calculating Portions & CymbalMart Aisles...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Curated Shopping List</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
