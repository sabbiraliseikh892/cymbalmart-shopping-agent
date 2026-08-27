import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  PlusCircle,
  Check,
  Store,
  Clock,
  MapPin,
  Tag,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  HelpCircle,
  DollarSign,
  Utensils
} from 'lucide-react';
import { PartyPlan, ChatMessage } from '../types';

interface AgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: PartyPlan | null;
  onAddItemDirectly: (item: {
    name: string;
    category: any;
    quantity: number;
    unit: string;
    estimatedCost: number;
    storeRecommendation: string;
  }) => void;
  onUpdatePlanState?: (updater: (prev: PartyPlan) => PartyPlan) => void;
}

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  isOpen,
  onClose,
  plan,
  onAddItemDirectly,
  onUpdatePlanState,
}) => {
  const defaultWelcomeMessage = `👋 **Hello! Welcome to CymbalMart.**\n\nI'm **CymbalMart Assistant**, your dedicated AI shopping & customer assistant.\n\nHere are some things I can help you with today:\n- 📍 **Locate items** by aisle (Produce, Deli, Meats, Bakery, Beverages)\n- 💰 **Find Cymbal Everyday Value brand deals** to save 20–30%\n- 🥗 **Dietary assistance** (Gluten-Free, Vegan, Kosher, Nut-Free)\n- 📦 **Store info** (Curbside pickup bays, same-day delivery, returns)\n- 🎉 **Event & catering planning** to stay on budget!`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: plan
        ? `👋 **Hello! Welcome to CymbalMart.**\n\nI'm **CymbalMart Assistant**, your AI shopping & party specialist.\n\nI see you're working on **${plan.title}** ($${plan.budget} budget for ${plan.totalGuests} guests).\n\nAsk me for item aisle locations, store brand swaps, portion sizing, or customer service questions!`
        : defaultWelcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentPlan: plan || null,
          userQuery: textToSend.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `I apologize for the interruption! ${err.message || 'Please check your connection and try asking again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: plan
          ? `👋 **Chat refreshed.** How can I assist with **${plan.title}** or your CymbalMart store visit?`
          : `👋 **Chat refreshed.** How can I assist you with your CymbalMart shopping trip today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const customerQuickPrompts = [
    { label: '🕒 Store hours & pickup', text: 'What are your store hours and how does curbside pickup work?' },
    { label: '💡 Cymbal brand deals', text: 'Which Cymbal Everyday Value store brand items offer the biggest savings?' },
    { label: '📍 Aisle finder for items', text: 'Which aisles are chips, dips, fresh salsa, and sparkling drinks located in?' },
    { label: '🥑 Vegan & allergy snacks', text: 'Can you recommend top allergy-friendly and vegan party snacks at CymbalMart?' },
    { label: '💰 Budget optimization', text: 'How can I keep my party food and beverage shopping under budget?' },
  ];

  if (!isOpen) return null;

  return (
    <div
      id="cymbalmart-assistant-drawer"
      className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
              <Store className="w-5 h-5 text-slate-950 stroke-[2.2]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                CymbalMart Assistant
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                AI Customer Service
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Supercenter #1042 • Live Store Helper</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Start new conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Close CymbalMart Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Store Quick Info Bar */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Open Today: <strong>6:00 AM – 11:00 PM</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Freshness Guarantee</span>
        </div>
      </div>

      {/* Customer Quick Action Chips */}
      <div className="p-2.5 bg-slate-950/30 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {customerQuickPrompts.map((item, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(item.text)}
            disabled={isLoading}
            className="whitespace-nowrap text-[11px] font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full border border-slate-700/80 transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  isBot
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                {isBot ? <Store className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  isBot
                    ? 'bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-xs'
                    : 'bg-emerald-600 text-white shadow-xs'
                }`}
              >
                {isBot && (
                  <div className="text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>CymbalMart Assistant</span>
                  </div>
                )}
                <div className="whitespace-pre-line break-words">{msg.content}</div>
                <div
                  className={`text-[10px] mt-2 flex items-center justify-between ${
                    isBot ? 'text-slate-400' : 'text-emerald-200'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 text-slate-300 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>CymbalMart Assistant is searching departments & inventory...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3.5 bg-slate-950/80 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask CymbalMart Assistant (e.g. 'Where is olive oil located?' or 'Best party snacks')..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-xs transition cursor-pointer shrink-0"
            title="Send message to CymbalMart Assistant"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-2">
          Powered by CymbalMart AI • Answers grounded in real store inventory & departments
        </p>
      </div>
    </div>
  );
};

export const CymbalMartAssistantDrawer = AgentChatDrawer;

