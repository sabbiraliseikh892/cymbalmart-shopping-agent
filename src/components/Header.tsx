import React from 'react';
import { ShoppingBag, Sparkles, Plus, Download, Printer, RefreshCw, MessageSquare, Store, Mic, Radio } from 'lucide-react';
import { PartyPlan } from '../types';

interface HeaderProps {
  currentPlan: PartyPlan | null;
  onOpenNewPlanModal: () => void;
  onOpenChat: () => void;
  isChatOpen: boolean;
  onOpenExport: () => void;
  onSelectPreset: (id: string) => void;
  isVoiceListening?: boolean;
  onToggleVoice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlan,
  onOpenNewPlanModal,
  onOpenChat,
  isChatOpen,
  onOpenExport,
  onSelectPreset,
  isVoiceListening = false,
  onToggleVoice,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white px-4 lg:px-8 py-3.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-slate-950">
            <Store className="w-5 h-5 stroke-[2.2] text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                CymbalMart
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Party Planner Shopping Agent
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              {currentPlan ? `${currentPlan.title} • ${currentPlan.totalGuests} Guests • $${currentPlan.budget} Budget` : 'Convert event intent into a curated, budget-conscious shopping list'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Preset quick loader */}
          <div className="relative inline-block text-left">
            <select
              aria-label="Load preset CymbalMart party plan"
              onChange={(e) => {
                if (e.target.value) {
                  onSelectPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none transition cursor-pointer"
            >
              <option value="" disabled>Load CymbalMart Blueprint...</option>
              <option value="preset-taco-fiesta">🌮 Fiesta Taco & Margarita Bar (20 guests)</option>
              <option value="preset-garden-cocktail">🍸 Sunset Grazing & Spritz (15 guests)</option>
              <option value="preset-kids-birthday">🦖 Kids Birthday Pizza Carnival (16 guests)</option>
            </select>
          </div>

          <button
            onClick={onOpenNewPlanModal}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
            title="Create a tailored party plan with AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Plan Wizard</span>
          </button>

          {currentPlan && (
            <button
              id="header-export-btn"
              onClick={onOpenExport}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
              title="Export or Print shopping list"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export & Print</span>
            </button>
          )}

          {onToggleVoice && (
            <button
              id="header-voice-btn"
              onClick={onToggleVoice}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition border cursor-pointer ${
                isVoiceListening
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md ring-2 ring-rose-400/40 animate-pulse'
                  : 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/50 hover:border-emerald-400'
              }`}
              title={isVoiceListening ? 'Voice Control Active - Click to stop' : 'Enable hands-free voice control'}
            >
              <Mic className={`w-3.5 h-3.5 ${isVoiceListening ? 'text-white' : 'text-emerald-400'}`} />
              <span>{isVoiceListening ? 'Voice Active' : 'Voice Control'}</span>
            </button>
          )}

          <button
            id="header-assistant-btn"
            onClick={onOpenChat}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition border cursor-pointer ${
              isChatOpen
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs ring-2 ring-emerald-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
            }`}
            title="Chat with CymbalMart Assistant"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>CymbalMart Assistant</span>
          </button>
        </div>
      </div>
    </header>
  );
};
