import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Radio,
  Send,
  X,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';
import { UseVoiceControlReturn } from '../hooks/useVoiceControl';

interface VoiceControlBarProps {
  voice: UseVoiceControlReturn;
  currentStepTitle?: string;
}

export const VoiceControlBar: React.FC<VoiceControlBarProps> = ({
  voice,
  currentStepTitle = 'Party Setup',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const {
    isListening,
    transcript,
    interimTranscript,
    feedback,
    lastCommand,
    isSupported,
    isSpeaking,
    isContinuous,
    toggleListening,
    toggleContinuous,
    stopSpeaking,
    executeVoiceText,
  } = voice;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    executeVoiceText(manualInput.trim());
    setManualInput('');
  };

  const sampleCommands = [
    { label: 'Step 1: Define', cmd: 'Go to Step 1' },
    { label: 'Step 2: Review List', cmd: 'Go to Step 2' },
    { label: 'Step 3: Checkout', cmd: 'Go to Step 3' },
    { label: 'Align Budget', cmd: 'Auto align budget' },
    { label: 'Swap Store Brand', cmd: 'Swap to store brand' },
    { label: 'Add Item', cmd: 'Add guacamole 5 dollars' },
    { label: 'Set Budget $400', cmd: 'Set budget to 400' },
    { label: 'Set Guests 20', cmd: 'Set guests to 20' },
    { label: 'Curbside Pickup', cmd: 'Select curbside pickup' },
    { label: 'Place Order', cmd: 'Place order' },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-3 pointer-events-none">
      <div className="pointer-events-auto bg-slate-950/90 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl shadow-2xl shadow-emerald-950/50 text-white overflow-hidden transition-all duration-300">
        
        {/* Main Floating Voice Bar */}
        <div className="flex items-center justify-between p-2.5 sm:px-4 sm:py-3 gap-2 sm:gap-4">
          {/* Left: Active Status Indicator & Main Mic Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              id="voice-mic-toggle-btn"
              onClick={toggleListening}
              className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl font-bold transition-all cursor-pointer shadow-lg ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 ring-4 ring-rose-500/30 animate-pulse'
                  : 'bg-gradient-to-tr from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-950/50'
              }`}
              title={isListening ? 'Stop listening (Voice Active)' : 'Start hands-free voice control'}
            >
              {isListening ? (
                <Mic className="w-5 h-5 animate-bounce" />
              ) : (
                <Mic className="w-5 h-5 stroke-[2.5]" />
              )}
              {isListening && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              )}
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Radio className={`w-3 h-3 ${isListening ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                  {isListening ? 'Hands-Free Active' : 'Hands-Free Voice Control'}
                </span>
                <span className="hidden sm:inline text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {currentStepTitle}
                </span>
              </div>
              <p className="text-xs text-slate-200 truncate max-w-[200px] sm:max-w-md font-medium">
                {interimTranscript ? (
                  <span className="italic text-emerald-300">"{interimTranscript}"</span>
                ) : transcript ? (
                  <span className="text-slate-100 font-semibold">"{transcript}"</span>
                ) : (
                  feedback
                )}
              </p>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Text to Speech Speaker state */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1.5 rounded-lg hover:bg-amber-500/30 transition cursor-pointer"
                title="Stop audio readout"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden md:inline text-[11px] font-semibold">Speaking...</span>
              </button>
            )}

            {/* Continuous mode toggle */}
            <button
              onClick={toggleContinuous}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer hidden md:flex items-center gap-1 ${
                isContinuous
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Continuous listening mode keeps mic active through multiple commands"
            >
              <Radio className="w-3 h-3" />
              <span>{isContinuous ? 'Auto-Listen: ON' : 'Auto-Listen: OFF'}</span>
            </button>

            {/* Expand / Help Drawer Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
              title={isExpanded ? 'Collapse voice commands drawer' : 'View full hands-free voice command cheat sheet'}
            >
              <span className="hidden sm:inline">Commands</span>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Voice Command Cheat Sheet & Manual Simulator */}
        {isExpanded && (
          <div className="border-t border-slate-800 p-3 sm:p-4 bg-slate-900/90 text-xs space-y-3 animate-in slide-in-from-bottom duration-200">
            {/* Speech Support Warning if applicable */}
            {!isSupported && (
              <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Web Speech API is limited in this environment. You can test any voice command below:</span>
              </div>
            )}

            {/* Quick Clickable Voice Command Chips */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Try Instant Voice Commands (or speak aloud):</span>
                <span className="text-emerald-400 text-[10px]">100% Hands-Free Certified</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleCommands.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => executeVoiceText(item.cmd)}
                    className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-emerald-950/60 hover:text-emerald-300 hover:border-emerald-500/50 border border-slate-700/80 px-2.5 py-1 rounded-lg text-slate-300 text-[11px] transition cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="font-medium">{item.label}</span>
                    <span className="text-slate-500 text-[10px]">("{item.cmd}")</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Command Manual Input Simulator (for environments with restricted mic permissions) */}
            <form onSubmit={handleManualSubmit} className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder='Speak or type: "Add salsa $4", "Go to Step 3", "Auto align budget", "Place order"...'
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Run Voice Command</span>
              </button>
            </form>

            {/* Status & Last Command Feedback */}
            {lastCommand && (
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Last Executed: <strong className="text-white">"{lastCommand}"</strong></span>
                </span>
                <span className="text-slate-400 shrink-0 ml-2">{feedback}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
