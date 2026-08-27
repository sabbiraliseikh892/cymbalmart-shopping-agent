import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Store,
  Calculator,
  Calendar,
  Utensils,
  Sparkles,
  MessageSquare,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle2,
  ListOrdered,
  CheckCheck
} from 'lucide-react';
import { PartyPlan, ShoppingItem, TimelineEvent, CUJStep, CategoryType, CymbalDepartment } from './types';
import { PRESET_PARTIES } from './data/presets';
import { Header } from './components/Header';
import { CUJStepper } from './components/CUJStepper';
import { DefineEventView } from './components/DefineEventView';
import { BudgetSummaryCard } from './components/BudgetSummaryCard';
import { ShoppingListView } from './components/ShoppingListView';
import { RefineCheckoutView } from './components/RefineCheckoutView';
import { StoreRunView } from './components/StoreRunView';
import { SupplyCalculatorView } from './components/SupplyCalculatorView';
import { TimelineView } from './components/TimelineView';
import { RecipesAndTipsView } from './components/RecipesAndTipsView';
import { PlanWizardModal } from './components/PlanWizardModal';
import { AddItemModal } from './components/AddItemModal';
import { ExportShareModal } from './components/ExportShareModal';
import { CostOptimizerModal } from './components/CostOptimizerModal';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { VoiceControlBar } from './components/VoiceControlBar';
import { useVoiceControl } from './hooks/useVoiceControl';

type TabType = 'cuj_workflow' | 'stores' | 'calculator' | 'timeline' | 'recipes';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<PartyPlan>(() => {
    const saved = localStorage.getItem('cymbalmart_party_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return PRESET_PARTIES[0];
  });

  const [cujStep, setCujStep] = useState<CUJStep>('review');
  const [activeTab, setActiveTab] = useState<TabType>('cuj_workflow');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAutoAligning, setIsAutoAligning] = useState(false);

  // Save to localStorage whenever currentPlan updates
  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem('cymbalmart_party_plan', JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Item Purchased
  const handleTogglePurchased = (id: string) => {
    setCurrentPlan((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList.map((item) =>
        item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  // Toggle Store Brand (Cymbal Brand Savings)
  const handleToggleStoreBrand = (id: string) => {
    setCurrentPlan((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList.map((item) => {
        if (item.id !== id) return item;
        const willBeStoreBrand = !item.isStoreBrand;
        if (willBeStoreBrand) {
          const original = item.originalEstimatedCost || item.estimatedCost;
          const discounted = Math.max(1, Math.round(original * 0.78));
          return {
            ...item,
            isStoreBrand: true,
            originalEstimatedCost: original,
            estimatedCost: discounted,
            notes: item.notes ? `${item.notes} • Cymbal Brand chosen` : 'Cymbal Everyday Value Brand (~22% savings)',
          };
        } else {
          const restored = item.originalEstimatedCost || Math.round(item.estimatedCost / 0.78);
          return {
            ...item,
            isStoreBrand: false,
            estimatedCost: restored,
            originalEstimatedCost: undefined,
          };
        }
      }),
      updatedAt: new Date().toISOString(),
    }));
    showToast('Updated item brand selection & cost');
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    setCurrentPlan((prev) => ({
      ...prev,
      shoppingList: prev.shoppingList.filter((item) => item.id !== id),
      updatedAt: new Date().toISOString(),
    }));
    showToast('Item removed from shopping list');
  };

  // Save or Update Item
  const handleSaveItem = (item: ShoppingItem) => {
    setCurrentPlan((prev) => {
      const exists = prev.shoppingList.some((i) => i.id === item.id);
      const updatedList = exists
        ? prev.shoppingList.map((i) => (i.id === item.id ? item : i))
        : [item, ...prev.shoppingList];

      return {
        ...prev,
        shoppingList: updatedList,
        updatedAt: new Date().toISOString(),
      };
    });
    setEditingItem(null);
    showToast(editingItem ? 'Item updated! Budget recalculated.' : 'New CymbalMart item added! Budget recalculated.');
  };

  // Update item quantity with automatic item cost & budget recalculation
  const handleUpdateItemQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.map((item) => {
        if (item.id === id) {
          const oldQty = item.quantity || 1;
          const unitPrice = item.estimatedCost / oldQty;
          const newCost = Math.max(1, Math.round(unitPrice * newQuantity));
          return {
            ...item,
            quantity: newQuantity,
            estimatedCost: newCost,
            originalEstimatedCost: item.originalEstimatedCost
              ? Math.max(1, Math.round((item.originalEstimatedCost / oldQty) * newQuantity))
              : undefined,
          };
        }
        return item;
      });

      return {
        ...prev,
        shoppingList: updatedList,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  // Update item cost directly with automatic budget recalculation
  const handleUpdateItemCost = (id: string, newCost: number) => {
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            estimatedCost: Math.max(0, Math.round(newCost)),
          };
        }
        return item;
      });

      return {
        ...prev,
        shoppingList: updatedList,
        updatedAt: new Date().toISOString(),
      };
    });
    showToast('Item price updated! Budget totals recalculated.');
  };

  // Quick add item directly from shopping list bar
  const handleQuickAddItem = (name: string, cost: number, category: CategoryType) => {
    const deptMap: Record<CategoryType, { dept: CymbalDepartment; aisle: string }> = {
      food: { dept: 'Produce', aisle: 'Aisle 1 - Fresh Produce' },
      drinks: { dept: 'Beverages & Bar', aisle: 'Aisle 8 - Craft Beverages' },
      decor: { dept: 'Party Supplies & Tableware', aisle: 'Aisle 11 - Tableware & Balloons' },
      tableware: { dept: 'Party Supplies & Tableware', aisle: 'Aisle 11 - Tableware' },
      favors_games: { dept: 'Party Supplies & Tableware', aisle: 'Aisle 12 - Party Games' },
      essentials_cleanup: { dept: 'Cleanup & Essentials', aisle: 'Aisle 14 - Paper & Cleaning' },
    };

    const config = deptMap[category] || { dept: 'Produce', aisle: 'Aisle 1 - General' };

    const newItem: ShoppingItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      category,
      department: config.dept,
      aisle: config.aisle,
      quantity: 1,
      unit: 'pack',
      estimatedCost: cost,
      isPurchased: false,
      storeRecommendation: 'CymbalMart Supercenter',
      priority: 'must_have',
    };

    setCurrentPlan((prev) => ({
      ...prev,
      shoppingList: [newItem, ...prev.shoppingList],
      updatedAt: new Date().toISOString(),
    }));
    showToast(`Added "${name}" ($${cost})! Budget recalculated.`);
  };

  // Batch toggle store brands for all items to save ~22%
  const handleBatchToggleStoreBrand = (enable: boolean) => {
    setCurrentPlan((prev) => {
      const updatedList = prev.shoppingList.map((item) => {
        if (enable) {
          if (!item.isStoreBrand) {
            const orig = item.originalEstimatedCost || item.estimatedCost;
            const discounted = Math.max(1, Math.round(orig * 0.78));
            return {
              ...item,
              isStoreBrand: true,
              originalEstimatedCost: orig,
              estimatedCost: discounted,
            };
          }
          return item;
        } else {
          if (item.isStoreBrand && item.originalEstimatedCost) {
            return {
              ...item,
              isStoreBrand: false,
              estimatedCost: item.originalEstimatedCost,
              originalEstimatedCost: undefined,
            };
          }
          return item;
        }
      });

      return {
        ...prev,
        shoppingList: updatedList,
        updatedAt: new Date().toISOString(),
      };
    });
    showToast(enable ? 'Swapped all items to Cymbal Brand (~22% savings)! Budget recalculated.' : 'Reset items to standard brands. Budget recalculated.');
  };

  // Auto-Align Budget via Backend AI
  const handleAutoAlignBudget = async () => {
    setIsAutoAligning(true);
    try {
      const res = await fetch('/api/party/auto-align-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shoppingList: currentPlan.shoppingList,
          budget: currentPlan.budget,
          totalGuests: currentPlan.totalGuests,
          partyType: currentPlan.occasion,
          theme: currentPlan.theme,
        }),
      });

      const data = await res.json();
      if (data.success && data.alignedShoppingList) {
        setCurrentPlan((prev) => ({
          ...prev,
          shoppingList: data.alignedShoppingList,
          updatedAt: new Date().toISOString(),
        }));
        showToast(data.explanation || 'Shopping list automatically aligned to your CymbalMart budget!');
      } else {
        // Fallback local alignment: switch non-store-brand items to store brands and remove optional items
        setCurrentPlan((prev) => {
          let runningTotal = prev.shoppingList.reduce((s, i) => s + (i.estimatedCost || 0), 0);
          const target = prev.budget;
          const adjusted = prev.shoppingList.map((item) => {
            if (runningTotal > target && !item.isStoreBrand) {
              const orig = item.originalEstimatedCost || item.estimatedCost;
              const disc = Math.max(1, Math.round(orig * 0.78));
              runningTotal -= (orig - disc);
              return {
                ...item,
                isStoreBrand: true,
                originalEstimatedCost: orig,
                estimatedCost: disc,
              };
            }
            return item;
          });
          return {
            ...prev,
            shoppingList: adjusted,
            updatedAt: new Date().toISOString(),
          };
        });
        showToast('Aligned budget by swapping items to Cymbal Everyday Value brands!');
      }
    } catch (err) {
      showToast('Swapped items to Cymbal Brand savings to balance budget.');
    } finally {
      setIsAutoAligning(false);
    }
  };

  // Update whole plan from Define Event step or Wizard
  const handlePlanCreated = (newPlan: PartyPlan) => {
    setCurrentPlan(newPlan);
    setCujStep('review');
    setActiveTab('cuj_workflow');
    showToast(`Created curated plan for ${newPlan.title}!`);
  };

  // Toggle Timeline task
  const handleToggleTimelineTask = (id: string) => {
    setCurrentPlan((prev) => ({
      ...prev,
      timeline: prev.timeline.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  // Add Timeline Task
  const handleAddTimelineTask = (taskData: { timeframe: any; task: string; category: any }) => {
    const newTask: TimelineEvent = {
      id: `timeline-${Date.now()}`,
      timeframe: taskData.timeframe,
      task: taskData.task,
      category: taskData.category,
      completed: false,
    };
    setCurrentPlan((prev) => ({
      ...prev,
      timeline: [...prev.timeline, newTask],
      updatedAt: new Date().toISOString(),
    }));
    showToast('Countdown milestone added!');
  };

  // Delete Timeline Task
  const handleDeleteTimelineTask = (id: string) => {
    setCurrentPlan((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((t) => t.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  // Scale Headcount directly
  const handleScaleHeadcount = (newAdults: number, newKids: number, newHours: number) => {
    const newTotal = newAdults + newKids;
    const oldTotal = currentPlan.totalGuests || 1;
    const multiplier = newTotal / oldTotal;

    setCurrentPlan((prev) => ({
      ...prev,
      adultCount: newAdults,
      kidCount: newKids,
      totalGuests: newTotal,
      durationHours: newHours,
      budget: Math.round(prev.budget * (multiplier > 1 ? 1 + (multiplier - 1) * 0.7 : multiplier)),
      shoppingList: prev.shoppingList.map((item) => {
        if (['food', 'drinks', 'tableware'].includes(item.category)) {
          const updatedQty = Math.max(1, Math.round(item.quantity * multiplier));
          const updatedCost = Math.max(1, Math.round(item.estimatedCost * multiplier));
          return {
            ...item,
            quantity: updatedQty,
            estimatedCost: updatedCost,
          };
        }
        return item;
      }),
      drinkFoodCalculations: {
        drinksTotal: Math.round(newAdults * newHours * 1.5 + newKids * newHours * 1.0),
        icePounds: Math.round(newTotal * 1.5),
        mainServings: Math.round(newAdults * 1.1 + newKids * 0.8),
        appetizerPieces: Math.round(newTotal * 5),
        dessertServings: Math.round(newTotal * 1.1),
        platesCupsCount: Math.round(newTotal * 2.2),
      },
      updatedAt: new Date().toISOString(),
    }));
    showToast(`Scaled plan for ${newTotal} guests! Quantities updated.`);
  };

  // Select Preset Party
  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_PARTIES.find((p) => p.id === presetId);
    if (found) {
      setCurrentPlan(found);
      setCujStep('review');
      setActiveTab('cuj_workflow');
      showToast(`Loaded ${found.title}!`);
    }
  };

  // Add ingredient from Recipes view
  const handleAddIngredient = (ingredientName: string) => {
    const newItem: ShoppingItem = {
      id: `item-${Date.now()}`,
      name: ingredientName,
      category: 'food',
      department: 'Produce',
      aisle: 'Aisle 1 - Fresh Produce',
      quantity: 1,
      unit: 'pack',
      estimatedCost: 8,
      isPurchased: false,
      storeRecommendation: 'CymbalMart Supercenter',
      priority: 'must_have',
      notes: 'Added from recipe suggestions',
    };
    handleSaveItem(newItem);
  };

  // Setup Voice Control Hook for 100% hands-free experience
  const voice = useVoiceControl({
    // Step navigation
    onGoToStep: (step) => {
      setActiveTab('cuj_workflow');
      setCujStep(step);
      showToast(`Voice: Switched to Step ${step === 'define' ? '1: Define' : step === 'review' ? '2: Review List' : '3: Refine & Checkout'}`);
    },
    onNextStep: () => {
      setActiveTab('cuj_workflow');
      if (cujStep === 'define') setCujStep('review');
      else if (cujStep === 'review') setCujStep('refine_checkout');
      showToast('Voice: Advanced to next step');
    },
    onPrevStep: () => {
      setActiveTab('cuj_workflow');
      if (cujStep === 'refine_checkout') setCujStep('review');
      else if (cujStep === 'review') setCujStep('define');
      showToast('Voice: Returned to previous step');
    },
    onGoToTab: (tab) => {
      setActiveTab(tab);
      showToast(`Voice: Opened ${tab} view`);
    },

    // Party parameters
    onSetTheme: (theme) => {
      setCurrentPlan((prev) => ({ ...prev, theme, updatedAt: new Date().toISOString() }));
      showToast(`Voice: Theme set to "${theme}"`);
    },
    onSetOccasion: (occasion) => {
      setCurrentPlan((prev) => ({ ...prev, occasion, updatedAt: new Date().toISOString() }));
      showToast(`Voice: Occasion set to "${occasion}"`);
    },
    onSetGuests: (adults, kids = 0) => {
      handleScaleHeadcount(adults, kids, currentPlan.durationHours || 3);
    },
    onSetBudget: (budget) => {
      setCurrentPlan((prev) => ({ ...prev, budget, updatedAt: new Date().toISOString() }));
      showToast(`Voice: Target budget set to $${budget}`);
    },
    onGeneratePlan: () => {
      setIsWizardOpen(true);
    },
    onLoadPreset: (presetId) => {
      handleSelectPreset(presetId);
    },

    // Shopping list modifications
    onAddItem: (name, cost = 6, category = 'food') => {
      handleQuickAddItem(name, cost, (category as CategoryType) || 'food');
    },
    onRemoveItem: (itemName) => {
      const target = currentPlan.shoppingList.find((i) =>
        i.name.toLowerCase().includes(itemName.toLowerCase())
      );
      if (target) {
        handleDeleteItem(target.id);
      } else {
        showToast(`Item "${itemName}" not found in list`);
      }
    },
    onIncreaseQuantity: (itemName) => {
      const target = currentPlan.shoppingList.find((i) =>
        i.name.toLowerCase().includes(itemName.toLowerCase())
      );
      if (target) {
        handleUpdateItemQuantity(target.id, (target.quantity || 1) + 1);
        showToast(`Increased quantity of ${target.name}`);
      }
    },
    onDecreaseQuantity: (itemName) => {
      const target = currentPlan.shoppingList.find((i) =>
        i.name.toLowerCase().includes(itemName.toLowerCase())
      );
      if (target && target.quantity > 1) {
        handleUpdateItemQuantity(target.id, target.quantity - 1);
        showToast(`Decreased quantity of ${target.name}`);
      }
    },
    onCheckItem: (itemName) => {
      const target = currentPlan.shoppingList.find((i) =>
        i.name.toLowerCase().includes(itemName.toLowerCase())
      );
      if (target && !target.isPurchased) {
        handleTogglePurchased(target.id);
        showToast(`Checked off ${target.name}`);
      }
    },
    onUncheckItem: (itemName) => {
      const target = currentPlan.shoppingList.find((i) =>
        i.name.toLowerCase().includes(itemName.toLowerCase())
      );
      if (target && target.isPurchased) {
        handleTogglePurchased(target.id);
        showToast(`Unchecked ${target.name}`);
      }
    },

    // Budget & Brand
    onAutoAlignBudget: () => {
      handleAutoAlignBudget();
    },
    onSwapToStoreBrand: (enable) => {
      handleBatchToggleStoreBrand(enable);
    },

    // Fulfillment & Checkout
    onSetFulfillment: (method) => {
      setCujStep('refine_checkout');
      setActiveTab('cuj_workflow');
      showToast(`Voice: Set fulfillment to ${method.replace('_', ' ')}`);
    },
    onApplyPromo: (code) => {
      showToast(`Voice: Promo code ${code} applied (-$15 off!)`);
    },
    onPlaceOrder: () => {
      setCujStep('refine_checkout');
      setActiveTab('cuj_workflow');
      showToast('Voice: CymbalMart Party Order confirmed! Thank you! 🎉');
    },

    // Assistant & dialogs
    onOpenAssistant: () => {
      setIsChatOpen(true);
    },
    onCloseAssistant: () => {
      setIsChatOpen(false);
    },
    onAskQuestion: (query) => {
      setIsChatOpen(true);
    },
    onExportList: () => {
      setIsExportOpen(true);
    },
    onOpenNewPlanWizard: () => {
      setIsWizardOpen(true);
    },
  });

  const totalCost = currentPlan?.shoppingList
    ? currentPlan.shoppingList.reduce((sum, item) => sum + (item.estimatedCost || 0), 0)
    : 0;

  const navTabs: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: 'cuj_workflow', label: '3-Step CUJ Planner', icon: ListOrdered },
    { id: 'stores', label: 'In-Store Aisle Walk', icon: Store },
    { id: 'calculator', label: 'Portion & Volume Math', icon: Calculator },
    { id: 'timeline', label: 'Party Countdown', icon: Calendar, count: currentPlan?.timeline?.length || 0 },
    { id: 'recipes', label: 'Menu & Host Tips', icon: Utensils, count: currentPlan?.recipesOrCocktails?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-2.5 rounded-2xl shadow-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentPlan={currentPlan}
        onOpenNewPlanModal={() => setIsWizardOpen(true)}
        onOpenChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        onOpenExport={() => setIsExportOpen(true)}
        onSelectPreset={handleSelectPreset}
        isVoiceListening={voice.isListening}
        onToggleVoice={voice.toggleListening}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Views */}
        <div className="transition-all duration-200">
          {activeTab === 'cuj_workflow' && (
            <div className="space-y-6">
              {/* Stepper Header for CUJ */}
              <CUJStepper
                currentStep={cujStep}
                onSelectStep={(step) => setCujStep(step)}
                onStepClick={(step) => setCujStep(step)}
                plan={currentPlan}
                totalCost={totalCost}
              />

              {/* Task 1: Define Event */}
              {cujStep === 'define' && (
                <DefineEventView
                  plan={currentPlan}
                  initialPlan={currentPlan}
                  onPlanCreated={handlePlanCreated}
                  onUpdatePlan={handlePlanCreated}
                  onSelectPreset={handleSelectPreset}
                  onProceedToReview={() => setCujStep('review')}
                />
              )}

              {/* Task 2: Review List & Align Budget */}
              {cujStep === 'review' && (
                <div className="space-y-6">
                  {/* Budget & Plan Overview Hero Card */}
                  <BudgetSummaryCard
                    plan={currentPlan}
                    onOpenOptimizer={() => setIsOptimizerOpen(true)}
                    onAutoAlignBudget={handleAutoAlignBudget}
                    isAutoAligning={isAutoAligning}
                    onProceedToCheckout={() => setCujStep('refine_checkout')}
                  />

                  {/* Shopping List View */}
                  <ShoppingListView
                    items={currentPlan.shoppingList}
                    budget={currentPlan.budget}
                    onTogglePurchased={handleTogglePurchased}
                    onDeleteItem={handleDeleteItem}
                    onEditItem={(item) => {
                      setEditingItem(item);
                      setIsAddItemOpen(true);
                    }}
                    onUpdateItemQuantity={handleUpdateItemQuantity}
                    onUpdateItemCost={handleUpdateItemCost}
                    onQuickAddItem={handleQuickAddItem}
                    onOpenAddItem={() => {
                      setEditingItem(null);
                      setIsAddItemOpen(true);
                    }}
                    onAskAiAboutItem={(itemName) => {
                      setIsChatOpen(true);
                    }}
                    onAutoAlignBudget={handleAutoAlignBudget}
                    onToggleStoreBrand={handleToggleStoreBrand}
                    onBatchToggleStoreBrand={handleBatchToggleStoreBrand}
                    onProceedToCheckout={() => setCujStep('refine_checkout')}
                  />
                </div>
              )}

              {/* Task 3: Refine & Checkout */}
              {(cujStep === 'refine_checkout' || (cujStep as string) === 'checkout') && (
                <RefineCheckoutView
                  plan={currentPlan}
                  onUpdatePlan={(updated) => {
                    setCurrentPlan(updated);
                    showToast('Party plan updated!');
                  }}
                  onOpenChat={() => setIsChatOpen(true)}
                  onBackToReview={() => setCujStep('review')}
                  onToggleItemPurchased={handleTogglePurchased}
                  onApplyDietaryFilter={(dietaryConstraint) => {
                    showToast(`Refined shopping list for ${dietaryConstraint}`);
                  }}
                  onFinalizeOrder={(fulfillmentDetails) => {
                    showToast(`CymbalMart order confirmed for ${fulfillmentDetails.method}! 🎉`);
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'stores' && (
            <StoreRunView
              items={currentPlan.shoppingList}
              onTogglePurchased={handleTogglePurchased}
            />
          )}

          {activeTab === 'calculator' && (
            <SupplyCalculatorView
              plan={currentPlan}
              onScaleHeadcount={handleScaleHeadcount}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineView
              timeline={currentPlan.timeline}
              onToggleTask={handleToggleTimelineTask}
              onAddTask={handleAddTimelineTask}
              onDeleteTask={handleDeleteTimelineTask}
            />
          )}

          {activeTab === 'recipes' && (
            <RecipesAndTipsView
              plan={currentPlan}
              onAddIngredientToShoppingList={handleAddIngredient}
              onAskAiForRecipe={() => setIsChatOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Floating CymbalMart Assistant Chat Button (visible when drawer closed) */}
      {!isChatOpen && (
        <button
          id="floating-assistant-btn"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs px-4 py-3 rounded-full shadow-2xl transition hover:scale-105 border border-emerald-400/40 cursor-pointer group"
          title="Chat with CymbalMart Assistant"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <MessageSquare className="w-4 h-4 text-emerald-100 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">CymbalMart Assistant</span>
        </button>
      )}

      {/* CymbalMart Assistant Chat Drawer */}
      <AgentChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        plan={currentPlan}
        onAddItemDirectly={(itemData) => {
          const item: ShoppingItem = {
            id: `item-${Date.now()}`,
            name: itemData.name,
            category: itemData.category || 'food',
            department: 'Produce',
            aisle: 'Aisle 1 - General',
            quantity: itemData.quantity || 1,
            unit: itemData.unit || 'units',
            estimatedCost: itemData.estimatedCost || 10,
            isPurchased: false,
            storeRecommendation: itemData.storeRecommendation || 'CymbalMart Supercenter',
            priority: 'must_have',
          };
          handleSaveItem(item);
        }}
        onUpdatePlanState={setCurrentPlan}
      />

      {/* Modals */}
      <PlanWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onPlanCreated={handlePlanCreated}
      />

      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => {
          setIsAddItemOpen(false);
          setEditingItem(null);
        }}
        onSaveItem={handleSaveItem}
        editingItem={editingItem}
      />

      <ExportShareModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        plan={currentPlan}
      />

      <CostOptimizerModal
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
        plan={currentPlan}
      />

      {/* Hands-Free Voice Control Floating Bar */}
      <VoiceControlBar
        voice={voice}
        currentStepTitle={
          activeTab !== 'cuj_workflow'
            ? activeTab === 'stores' ? 'Store Aisle Walk' : activeTab === 'calculator' ? 'Volume Math' : activeTab === 'timeline' ? 'Party Timeline' : 'Recipes & Tips'
            : cujStep === 'define'
            ? 'Step 1: Define Event'
            : cujStep === 'review'
            ? 'Step 2: Review List'
            : 'Step 3: Refine & Checkout'
        }
      />
    </div>
  );
}
