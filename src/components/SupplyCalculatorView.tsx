import React, { useState } from 'react';
import { Calculator, GlassWater, Snowflake, UtensilsCrossed, Cake, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { PartyPlan, PortionCalculations } from '../types';

interface SupplyCalculatorViewProps {
  plan: PartyPlan;
  onScaleHeadcount: (newAdults: number, newKids: number, newHours: number) => void;
}

export const SupplyCalculatorView: React.FC<SupplyCalculatorViewProps> = ({ plan, onScaleHeadcount }) => {
  const [adults, setAdults] = useState(plan.adultCount);
  const [kids, setKids] = useState(plan.kidCount);
  const [hours, setHours] = useState(plan.durationHours);

  const totalGuests = adults + kids;

  // Real-time calculation formulas
  const liveCalculations: PortionCalculations = {
    drinksTotal: Math.round(adults * hours * 1.5 + kids * hours * 1.0),
    icePounds: Math.round(totalGuests * 1.5 + (hours > 4 ? totalGuests * 0.5 : 0)),
    mainServings: Math.round(adults * 1.1 + kids * 0.8),
    appetizerPieces: Math.round(totalGuests * 5),
    dessertServings: Math.round(totalGuests * 1.1),
    platesCupsCount: Math.round(totalGuests * 2.2),
  };

  const hasChanged = adults !== plan.adultCount || kids !== plan.kidCount || hours !== plan.durationHours;

  return (
    <div className="space-y-4">
      {/* Header card with Live Guest Adjuster */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Event Supply & Portion Math Engine
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Standard catering benchmarks and formulas calculated specifically for your party.
                </p>
              </div>
            </div>
          </div>

          {hasChanged && (
            <button
              onClick={() => onScaleHeadcount(adults, kids, hours)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Scale to Shopping Plan</span>
            </button>
          )}
        </div>

        {/* Dynamic Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <span>Adult Guests</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">{adults}</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <span>Kids / Teens</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">{kids}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={kids}
              onChange={(e) => setKids(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <span>Party Duration</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">{hours} hours</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Calculations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Beverages */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <GlassWater className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Drink Servings</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">1.5 drinks/hr (adults), 1/hr (kids)</p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {liveCalculations.drinksTotal} <span className="text-xs font-normal text-slate-500">drinks</span>
          </p>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p>• Wine: ~{Math.ceil((adults * hours * 0.5) / 5)} bottles (5 glasses/bottle)</p>
            <p>• Beer / Seltzers: ~{Math.ceil(adults * hours * 0.7)} cans</p>
            <p>• Non-Alcoholic / Soda: ~{Math.ceil(totalGuests * hours * 0.5)} cans/servings</p>
          </div>
        </div>

        {/* Ice Calculation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ice Quantity</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">1.5 lbs/guest (drinks + chilling coolers)</p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {liveCalculations.icePounds} <span className="text-xs font-normal text-slate-500">lbs</span>
          </p>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p>• Recommendation: {Math.ceil(liveCalculations.icePounds / 20)} large 20lb bags or {Math.ceil(liveCalculations.icePounds / 10)} 10lb bags</p>
            <p>• 1 bag reserved exclusively for clean cocktail glasses</p>
          </div>
        </div>

        {/* Appetizers & Finger Food */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Appetizer Pieces</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">4-6 pieces per guest for cocktail/grazing</p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {liveCalculations.appetizerPieces} <span className="text-xs font-normal text-slate-500">bites</span>
          </p>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p>• Charcuterie / Cheese: ~{((adults * 2) / 16).toFixed(1)} lbs total cheese</p>
            <p>• Dips & Chips: ~{Math.ceil(totalGuests / 6)} large bags chips + 3 tubs salsa/dip</p>
          </div>
        </div>

        {/* Main Entrees */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Main Servings</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">0.5 lb protein or 1 hearty meal/person</p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {liveCalculations.mainServings} <span className="text-xs font-normal text-slate-500">portions</span>
          </p>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p>• Raw Meat/Protein: ~{Math.ceil(totalGuests * 0.55)} lbs (accounts for cooking shrinkage)</p>
            <p>• Side dishes: ~3-4 cups total volume per 5 guests</p>
          </div>
        </div>

        {/* Desserts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dessert Portions</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">1 slice / 2 cupcakes per guest</p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {liveCalculations.dessertServings} <span className="text-xs font-normal text-slate-500">servings</span>
          </p>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p>• Cake: 9-inch cake serves ~16-20 guests, 10-inch serves 24-28</p>
            <p>• Finger desserts: ~{liveCalculations.dessertServings * 2} cookies/macarons</p>
          </div>
        </div>

        {/* Tableware & Essentials */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Tableware & Buffers</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Includes 25% replacement buffer</p>
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {liveCalculations.platesCupsCount} <span className="text-xs font-normal text-slate-500">units</span>
          </p>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
            <p>• Plates: {Math.ceil(totalGuests * 1.5)} plates (appetizers + dinner + cake)</p>
            <p>• Cups: {Math.ceil(totalGuests * 2.0)} cups</p>
            <p>• Napkins: {Math.ceil(totalGuests * 2.5)} cocktail/dinner napkins</p>
          </div>
        </div>
      </div>
    </div>
  );
};
