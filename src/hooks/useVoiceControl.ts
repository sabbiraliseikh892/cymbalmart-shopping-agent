import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API interfaces
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognitionInstance;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognitionInstance;
    };
  }
}

export interface VoiceCommandHandlers {
  // Navigation & Step Control
  onGoToStep?: (step: 'define' | 'review' | 'refine_checkout') => void;
  onGoToTab?: (tab: 'cuj_workflow' | 'stores' | 'calculator' | 'timeline' | 'recipes') => void;
  onNextStep?: () => void;
  onPrevStep?: () => void;

  // Party Definition
  onSetTheme?: (theme: string) => void;
  onSetOccasion?: (occasion: string) => void;
  onSetGuests?: (adults: number, kids?: number) => void;
  onSetBudget?: (budget: number) => void;
  onGeneratePlan?: () => void;
  onLoadPreset?: (presetId: string) => void;

  // Shopping List Modifications
  onAddItem?: (name: string, cost?: number, category?: string) => void;
  onRemoveItem?: (itemName: string) => void;
  onIncreaseQuantity?: (itemName: string) => void;
  onDecreaseQuantity?: (itemName: string) => void;
  onCheckItem?: (itemName: string) => void;
  onUncheckItem?: (itemName: string) => void;

  // Budget & Brand Optimization
  onAutoAlignBudget?: () => void;
  onSwapToStoreBrand?: (enable: boolean) => void;

  // Checkout & Fulfillment
  onSetFulfillment?: (method: 'curbside_pickup' | 'express_delivery' | 'instore_route') => void;
  onApplyPromo?: (code: string) => void;
  onPlaceOrder?: () => void;

  // Assistant & Help
  onOpenAssistant?: () => void;
  onCloseAssistant?: () => void;
  onAskQuestion?: (query: string) => void;
  onExportList?: () => void;
  onOpenNewPlanWizard?: () => void;
}

export interface UseVoiceControlReturn {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  feedback: string;
  lastCommand: string | null;
  isSupported: boolean;
  isSpeaking: boolean;
  isContinuous: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  toggleContinuous: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  executeVoiceText: (text: string) => boolean;
}

export function useVoiceControl(handlers: VoiceCommandHandlers): UseVoiceControlReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [feedback, setFeedback] = useState<string>('Voice Assistant ready. Tap or say "Hey Cymbal" / "Help".');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  // Speech Synthesis (Text-to-Speech)
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Parse natural language voice commands
  const executeVoiceText = useCallback((rawText: string): boolean => {
    const text = rawText.trim().toLowerCase();
    if (!text) return false;

    setLastCommand(rawText);
    const h = handlersRef.current;

    // 1. Navigation / Step commands
    if (
      text.includes('go to step 1') ||
      text.includes('define event') ||
      text.includes('event setup') ||
      text.includes('step one')
    ) {
      h.onGoToStep?.('define');
      const msg = 'Moving to Step 1: Define Event.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (
      text.includes('go to step 2') ||
      text.includes('review list') ||
      text.includes('shopping list') ||
      text.includes('step two') ||
      text.includes('review and align')
    ) {
      h.onGoToStep?.('review');
      const msg = 'Moving to Step 2: Review and Align Budget.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (
      text.includes('go to step 3') ||
      text.includes('checkout') ||
      text.includes('refine and checkout') ||
      text.includes('step three') ||
      text.includes('finalize order') ||
      text.includes('go to cart')
    ) {
      h.onGoToStep?.('refine_checkout');
      const msg = 'Moving to Step 3: Refine and Checkout.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('next step') || text.includes('continue to next') || text.includes('proceed')) {
      h.onNextStep?.();
      const msg = 'Moving to next step.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('previous step') || text.includes('go back') || text.includes('back step')) {
      h.onPrevStep?.();
      const msg = 'Going back.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    // 2. Tab Navigation
    if (text.includes('open store map') || text.includes('store run') || text.includes('aisle guide') || text.includes('show stores')) {
      h.onGoToTab?.('stores');
      const msg = 'Opening CymbalMart In-Store Aisle Map.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('calculator') || text.includes('drink calculator') || text.includes('supply calculator')) {
      h.onGoToTab?.('calculator');
      const msg = 'Opening Party Supply & Drink Calculator.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('timeline') || text.includes('party schedule') || text.includes('countdown')) {
      h.onGoToTab?.('timeline');
      const msg = 'Opening Party Host Timeline.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('recipes') || text.includes('party tips') || text.includes('cocktail recipe')) {
      h.onGoToTab?.('recipes');
      const msg = 'Opening Recipes & CymbalMart Tips.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    // 3. Budget Alignment & Brand Optimization
    if (
      text.includes('auto align') ||
      text.includes('align budget') ||
      text.includes('optimize budget') ||
      text.includes('fit my budget') ||
      text.includes('fix budget')
    ) {
      h.onAutoAlignBudget?.();
      const msg = 'Auto-aligning your shopping list to target budget...';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (
      text.includes('swap to store brand') ||
      text.includes('switch to store brand') ||
      text.includes('use cymbal brand') ||
      text.includes('cymbal brand on') ||
      text.includes('save money') ||
      text.includes('apply store brands')
    ) {
      h.onSwapToStoreBrand?.(true);
      const msg = 'Swapped items to Cymbal Everyday Value store brands for ~22% savings!';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (
      text.includes('reset brands') ||
      text.includes('restore original brands') ||
      text.includes('disable store brand')
    ) {
      h.onSwapToStoreBrand?.(false);
      const msg = 'Restored standard brand selections.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    // 4. Fulfillment & Checkout Commands
    if (text.includes('curbside pickup') || text.includes('select curbside') || text.includes('store pickup')) {
      h.onSetFulfillment?.('curbside_pickup');
      const msg = 'Selected CymbalMart Curbside Pickup Bay.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('delivery') || text.includes('express delivery') || text.includes('ship to me')) {
      h.onSetFulfillment?.('express_delivery');
      const msg = 'Selected CymbalMart 2-Hour Express Delivery.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('in store shopping') || text.includes('in store route') || text.includes('walk the store')) {
      h.onSetFulfillment?.('instore_route');
      const msg = 'Selected In-Store Shopping Route.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('place order') || text.includes('confirm order') || text.includes('complete checkout') || text.includes('submit order')) {
      h.onPlaceOrder?.();
      const msg = 'Placing your CymbalMart party order now!';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('apply coupon') || text.includes('apply promo') || text.includes('discount code')) {
      const match = text.match(/(?:code|coupon|promo)\s+([a-z0-9]+)/i);
      const code = match ? match[1].toUpperCase() : 'PARTYHOST15';
      h.onApplyPromo?.(code);
      const msg = `Applied promo coupon code ${code}!`;
      setFeedback(msg);
      speak(msg);
      return true;
    }

    // 5. Presets Loading
    if (text.includes('taco fiesta') || text.includes('taco bar') || text.includes('margarita')) {
      h.onLoadPreset?.('preset-taco-fiesta');
      const msg = 'Loading Fiesta Taco & Margarita Bar Blueprint for 20 guests.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('garden cocktail') || text.includes('spritz') || text.includes('grazing')) {
      h.onLoadPreset?.('preset-garden-cocktail');
      const msg = 'Loading Sunset Grazing & Spritz Blueprint for 15 guests.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('kids birthday') || text.includes('pizza carnival') || text.includes('children party')) {
      h.onLoadPreset?.('preset-kids-birthday');
      const msg = 'Loading Kids Birthday Pizza Carnival Blueprint for 16 guests.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    // 6. Plan Parameters
    // Budget: "set budget to 400" or "budget 250 dollars"
    const budgetMatch = text.match(/(?:set budget|budget to|budget)\s*(?:of|is|to)?\s*\$?(\d+)/i);
    if (budgetMatch) {
      const val = parseInt(budgetMatch[1], 10);
      if (!isNaN(val) && val > 0) {
        h.onSetBudget?.(val);
        const msg = `Updated target party budget to $${val}.`;
        setFeedback(msg);
        speak(msg);
        return true;
      }
    }

    // Guests: "set guests to 25" or "18 adults and 6 kids" or "20 people"
    const guestMatchWithKids = text.match(/(\d+)\s*adults?\s*(?:and)?\s*(\d+)\s*kids?/i);
    if (guestMatchWithKids) {
      const adults = parseInt(guestMatchWithKids[1], 10);
      const kids = parseInt(guestMatchWithKids[2], 10);
      h.onSetGuests?.(adults, kids);
      const msg = `Updated guest count to ${adults} adults and ${kids} kids.`;
      setFeedback(msg);
      speak(msg);
      return true;
    }

    const simpleGuestMatch = text.match(/(?:guests?|people|attendees)\s*(?:to|is|of)?\s*(\d+)/i);
    if (simpleGuestMatch) {
      const total = parseInt(simpleGuestMatch[1], 10);
      if (!isNaN(total) && total > 0) {
        h.onSetGuests?.(total, 0);
        const msg = `Updated guest count to ${total} guests.`;
        setFeedback(msg);
        speak(msg);
        return true;
      }
    }

    // Theme: "set theme to tropical paradise"
    const themeMatch = text.match(/(?:set theme|change theme|theme to|theme is)\s*(?:to|is)?\s*([a-z0-9\s]+)/i);
    if (themeMatch && !text.includes('define') && !text.includes('review')) {
      const themeVal = themeMatch[1].trim();
      if (themeVal.length > 2) {
        h.onSetTheme?.(themeVal);
        const msg = `Updated theme to ${themeVal}.`;
        setFeedback(msg);
        speak(msg);
        return true;
      }
    }

    // 7. Add item: "add [item name] [optional price] [optional dollars]"
    // e.g. "add guacamole", "add salsa for 5 dollars", "add 2 packs of chips 6 dollars"
    const addMatch = text.match(/^(?:please\s+)?add\s+(?:item\s+)?(.+?)(?:\s+(?:for|costing|price)\s+\$?(\d+(?:\.\d+)?))?$/i);
    if (addMatch && !text.includes('wizard') && !text.includes('assistant')) {
      const itemName = addMatch[1].replace(/(?:to (?:the )?shopping list|to cart|to my list)$/i, '').trim();
      const cost = addMatch[2] ? parseFloat(addMatch[2]) : undefined;
      if (itemName) {
        h.onAddItem?.(itemName, cost);
        const msg = `Added "${itemName}"${cost ? ` ($${cost})` : ''} to your CymbalMart shopping list.`;
        setFeedback(msg);
        speak(msg);
        return true;
      }
    }

    // 8. Remove item: "remove [item name]" or "delete [item name]"
    const removeMatch = text.match(/^(?:please\s+)?(?:remove|delete)\s+(?:item\s+)?(.+?)(?:\s+from (?:my |the )?list)?$/i);
    if (removeMatch) {
      const itemName = removeMatch[1].trim();
      if (itemName) {
        h.onRemoveItem?.(itemName);
        const msg = `Removed "${itemName}" from your shopping list.`;
        setFeedback(msg);
        speak(msg);
        return true;
      }
    }

    // 9. Increase / Decrease quantity: "increase chips", "decrease soda"
    if (text.startsWith('increase ') || text.startsWith('more ')) {
      const item = text.replace(/^(?:increase|more)\s+/i, '').trim();
      if (item) {
        h.onIncreaseQuantity?.(item);
        const msg = `Increased quantity for ${item}.`;
        setFeedback(msg);
        speak(msg);
        return true;
      }
    }

    if (text.startsWith('decrease ') || text.startsWith('less ')) {
      const item = text.replace(/^(?:decrease|less)\s+/i, '').trim();
      if (item) {
        h.onDecreaseQuantity?.(item);
        const msg = `Decreased quantity for ${item}.`;
        setFeedback(msg);
        speak(msg);
        return true;
      }
    }

    // 10. Check / Uncheck item in list: "check off salsa", "mark chips as bought"
    if (text.includes('check off') || text.includes('mark as bought') || text.includes('got the') || text.includes('bought the')) {
      const item = text.replace(/^(?:check off|mark as bought|got the|bought the)\s+/i, '').trim();
      if (item) {
        h.onCheckItem?.(item);
        const msg = `Marked ${item} as checked.`;
        setFeedback(msg);
        speak(msg);
        return true;
      }
    }

    // 11. Wizard & Modals
    if (text.includes('generate plan') || text.includes('create party plan') || text.includes('build plan')) {
      h.onGeneratePlan?.();
      const msg = 'Generating customized CymbalMart party plan and shopping list...';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('new plan wizard') || text.includes('open wizard') || text.includes('start new plan')) {
      h.onOpenNewPlanWizard?.();
      const msg = 'Opening New Plan Creation Wizard.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('export') || text.includes('print list') || text.includes('share plan')) {
      h.onExportList?.();
      const msg = 'Opening Export and Print preview.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    // 12. Assistant Dialog
    if (text.includes('open assistant') || text.includes('chat with assistant') || text.includes('open chat') || text.includes('hey cymbal')) {
      h.onOpenAssistant?.();
      const msg = 'Opening CymbalMart Assistant.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    if (text.includes('close assistant') || text.includes('close chat')) {
      h.onCloseAssistant?.();
      const msg = 'Closed CymbalMart Assistant.';
      setFeedback(msg);
      speak(msg);
      return true;
    }

    // 13. General Query / Ask Assistant: "where is ice located?", "what aisle is salsa?"
    if (
      text.includes('aisle') ||
      text.includes('where is') ||
      text.includes('how much') ||
      text.includes('recipe') ||
      text.includes('recommend') ||
      text.includes('tell me') ||
      text.includes('help')
    ) {
      h.onAskQuestion?.(rawText);
      const msg = `Consulting CymbalMart Assistant on: "${rawText}"`;
      setFeedback(msg);
      return true;
    }

    // Unmatched command feedback
    const defaultMsg = `Heard: "${rawText}". Say "Help" or try "Go to Step 2", "Auto align budget", or "Add guacamole $4".`;
    setFeedback(defaultMsg);
    return false;
  }, [speak]);

  // Speech Recognition Initialization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setFeedback('Speech recognition is not supported in this browser. You can type commands in the Voice Control panel.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback('🎙️ Listening... Speak your hands-free CymbalMart command.');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let finalStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            finalStr += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (finalStr) {
          const cleanFinal = finalStr.trim();
          setTranscript(cleanFinal);
          setInterimTranscript('');
          executeVoiceText(cleanFinal);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed') {
          setFeedback('Microphone permission blocked. Please allow microphone access in your browser settings.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Keep waiting silently
        } else {
          setFeedback(`Voice error: ${event.error}. Click mic to retry.`);
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // Auto-restart if continuous mode is enabled and state still listening
        if (recognitionRef.current && isContinuous) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition init error:', e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [executeVoiceText, isContinuous]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setFeedback('Speech recognition is not available.');
      return;
    }
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.warn('Recognition start exception:', e);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript('');
    } catch (e) {
      console.warn('Recognition stop exception:', e);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const toggleContinuous = useCallback(() => {
    setIsContinuous((prev) => !prev);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    feedback,
    lastCommand,
    isSupported,
    isSpeaking,
    isContinuous,
    startListening,
    stopListening,
    toggleListening,
    toggleContinuous,
    speak,
    stopSpeaking,
    executeVoiceText,
  };
}
