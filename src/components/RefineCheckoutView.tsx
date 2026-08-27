import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  Store,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Sparkles,
  Printer,
  Calendar,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Utensils,
  ArrowRight,
  Check,
  SlidersHorizontal,
  Info,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { PartyPlan, ShoppingItem, FulfillmentDetails } from '../types';

interface RefineCheckoutViewProps {
  plan: PartyPlan;
  onUpdatePlan?: (updated: PartyPlan) => void;
  onOpenChat?: () => void;
  onBackToReview?: () => void;
  onToggleItemPurchased?: (id: string) => void;
  onApplyDietaryFilter?: (dietaryConstraint: string) => void;
  onFinalizeOrder?: (fulfillmentDetails: any) => void;
}

export const RefineCheckoutView: React.FC<RefineCheckoutViewProps> = ({
  plan,
  onUpdatePlan,
  onOpenChat,
  onBackToReview,
  onToggleItemPurchased,
  onApplyDietaryFilter,
  onFinalizeOrder,
}) => {
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'curbside_pickup' | 'express_delivery' | 'instore_route'>('curbside_pickup');
  const [selectedStore, setSelectedStore] = useState('CymbalMart Supercenter #1042 - North Blvd');
  const [pickupSlot, setPickupSlot] = useState('Tomorrow, 9:00 AM - 11:00 AM');
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Springfield');
  const [promoCode, setPromoCode] = useState('PARTYHOST15');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('PARTYHOST15');
  const [dietaryFilter, setDietaryFilter] = useState<string[]>(plan?.dietaryRestrictions || []);
  const [isFinalized, setIsFinalized] = useState(false);
  const [orderConfirmationId, setOrderConfirmationId] = useState<string>('');

  const shoppingList = plan?.shoppingList || [];
  const budget = plan?.budget ?? 350;

  // Calculations
  const subtotal = shoppingList.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const storeBrandSavings = shoppingList.reduce((sum, item) => {
    if (item.isStoreBrand && item.originalEstimatedCost && item.originalEstimatedCost > item.estimatedCost) {
      return sum + (item.originalEstimatedCost - item.estimatedCost);
    }
    return sum + (item.isStoreBrand ? 3.5 : 0);
  }, 0);

  const promoDiscount = appliedPromo ? 15.0 : 0;
  const estimatedTax = (subtotal - promoDiscount) * 0.075;
  const deliveryFee = fulfillmentMethod === 'express_delivery' ? 4.99 : 0;
  const finalTotal = Math.max(0, subtotal - promoDiscount + estimatedTax + deliveryFee);
  const variance = budget - finalTotal;
  const isBudgetAligned = variance >= 0;

  // Toggle store brand on all eligible items
  const handleSwapAllToStoreBrand = () => {
    const updatedList: ShoppingItem[] = shoppingList.map((item) => {
      if (!item.isStoreBrand) {
        const discountedCost = Math.max(1, Math.round(item.estimatedCost * 0.78));
        return {
          ...item,
          name: item.name.startsWith('Cymbal') ? item.name : `Cymbal Everyday Value ${item.name}`,
          originalEstimatedCost: item.originalEstimatedCost || item.estimatedCost,
          estimatedCost: discountedCost,
          isStoreBrand: true,
          notes: item.notes ? `${item.notes}; Cymbal Brand 22% savings applied` : 'Cymbal Brand 22% savings applied',
        };
      }
      return item;
    });

    if (onUpdatePlan) {
      onUpdatePlan({
        ...plan,
        shoppingList: updatedList,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Update item quantity in checkout view
  const handleUpdateItemQty = (id: string, delta: number) => {
    const updatedList = shoppingList.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        const oldQty = item.quantity || 1;
        const unitPrice = item.estimatedCost / oldQty;
        return {
          ...item,
          quantity: newQty,
          estimatedCost: Math.max(1, Math.round(unitPrice * newQty)),
        };
      }
      return item;
    });

    if (onUpdatePlan) {
      onUpdatePlan({
        ...plan,
        shoppingList: updatedList,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Remove item from checkout view
  const handleRemoveItem = (id: string) => {
    const updatedList = shoppingList.filter((item) => item.id !== id);
    if (onUpdatePlan) {
      onUpdatePlan({
        ...plan,
        shoppingList: updatedList,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Toggle dietary tag
  const handleToggleDietaryConstraint = (tag: string) => {
    let nextTags: string[];
    if (dietaryFilter.includes(tag)) {
      nextTags = dietaryFilter.filter((t) => t !== tag);
    } else {
      nextTags = [...dietaryFilter, tag];
    }
    setDietaryFilter(nextTags);
    if (onApplyDietaryFilter) {
      onApplyDietaryFilter(tag);
    }
    if (onUpdatePlan) {
      onUpdatePlan({
        ...plan,
        dietaryRestrictions: nextTags,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'PARTYHOST15' || promoCode.trim().toUpperCase() === 'CYMBAL20') {
      setAppliedPromo(promoCode.trim().toUpperCase());
    } else {
      setAppliedPromo(null);
    }
  };

  const handleFinalizePlan = () => {
    const confirmationId = `CYMBAL-PRTY-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderConfirmationId(confirmationId);
    setIsFinalized(true);
    if (onFinalizeOrder) {
      onFinalizeOrder({
        method: fulfillmentMethod,
        store: selectedStore,
        slotOrAddress: fulfillmentMethod === 'express_delivery' ? deliveryAddress : pickupSlot,
        total: finalTotal,
        confirmationId,
      });
    }
  };

  // Group items by department for the itemized review
  const departmentGroups = React.useMemo(() => {
    const map = new Map<string, ShoppingItem[]>();
    plan.shoppingList.forEach((item) => {
      const dept = item.department || 'Produce';
      if (!map.has(dept)) map.set(dept, []);
      map.get(dept)!.push(item);
    });
    return Array.from(map.entries());
  }, [plan.shoppingList]);

  if (isFinalized) {
    return (
      <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <span className="text-xs uppercase font-bold tracking-wider bg-white/25 px-3 py-1 rounded-full text-white inline-block mb-2">
            Plan Finalized & Ready for Host
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
            You're All Set for {plan.title}! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
            Your curated CymbalMart shopping list of <strong>{plan.shoppingList.length} items</strong> has been finalized under your budget target.
          </p>

          {/* Order / Pickup Pass Card */}
          <div className="mt-6 bg-white text-slate-900 rounded-2xl p-5 max-w-md mx-auto shadow-lg text-left border border-emerald-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Confirmation Code</span>
                <span className="text-base font-mono font-black text-emerald-700 tracking-wider">
                  {orderConfirmationId}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fulfillment</span>
                <span className="text-xs font-bold text-slate-800 capitalize">
                  {fulfillmentMethod.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="py-3 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Store Location:</span>
                <span className="font-semibold text-slate-900">{selectedStore}</span>
              </div>
              <div className="flex justify-between">
                <span>Scheduled Time:</span>
                <span className="font-semibold text-slate-900">{pickupSlot}</span>
              </div>
              <div className="flex justify-between">
                <span>Party Headcount:</span>
                <span className="font-semibold text-slate-900">{plan.totalGuests} Guests ({plan.adultCount} adults, {plan.kidCount} kids)</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                <span>Finalized Cart Total:</span>
                <span className="text-emerald-700 text-sm font-extrabold">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Mock Barcode */}
            <div className="mt-3 pt-3 border-t border-dashed border-slate-200 text-center">
              <div className="bg-slate-100 py-2.5 px-4 rounded-lg flex items-center justify-center gap-1 overflow-hidden">
                <div className="font-mono text-[10px] tracking-widest text-slate-700">||| | |||| | | ||||| ||| || ||||| | |||</div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">Scan at CymbalMart Curbside Bay or In-Store Self Checkout</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Finalized Shopping Sheet</span>
            </button>
            <button
              onClick={() => setIsFinalized(false)}
              className="flex items-center gap-2 bg-emerald-800/80 hover:bg-emerald-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Modify Constraints</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CUJ Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                Task 3: Refine & Checkout
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Finalizing Party Plan for {plan.totalGuests} Guests
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Adjust Constraints & Finalize CymbalMart Order
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fine-tune dietary tags, apply store brand savings, choose curbside or delivery, and review your finalized budget-aligned cart.
            </p>
          </div>

          {/* Quick AI Refine Agent Trigger */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask CymbalMart Assistant</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Constraints & Fulfillment */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Constraint Tuning Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Dietary & Budget Constraints
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Adjust tags to ensure every guest is accommodated
                  </p>
                </div>
              </div>

              {/* 1-Click Store Brand Optimizer */}
              <button
                onClick={handleSwapAllToStoreBrand}
                className="flex items-center gap-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl transition cursor-pointer"
                title="Swap all possible items to CymbalMart Everyday Value brand"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Max Savings Swap (~20% off)</span>
              </button>
            </div>

            {/* Dietary Constraints Toggles */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Active Dietary Accommodations
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Gluten-Free Friendly',
                  'Vegetarian Option',
                  'Vegan Friendly',
                  'Nut-Free (Strict)',
                  'Dairy-Free Alternative',
                  'Non-Alcoholic Drink Bar',
                ].map((tag) => {
                  const isSelected = dietaryFilter.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleToggleDietaryConstraint(tag)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Headcount snapshot */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Guests</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{plan.totalGuests}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Budget</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">${plan.budget}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Store Brand Savings</span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">+${storeBrandSavings.toFixed(0)} saved</span>
              </div>
            </div>
          </div>

          {/* 2. CymbalMart Fulfillment Options */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  CymbalMart Fulfillment & Pickup
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select how you want to receive your party provisions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Curbside Pickup */}
              <button
                onClick={() => setFulfillmentMethod('curbside_pickup')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                  fulfillmentMethod === 'curbside_pickup'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    FREE
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Curbside Pickup</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Loaded directly to your trunk</p>
                </div>
              </button>

              {/* Express Delivery */}
              <button
                onClick={() => setFulfillmentMethod('express_delivery')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                  fulfillmentMethod === 'express_delivery'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    $4.99
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">2-Hour Express Delivery</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Direct to your party venue</p>
                </div>
              </button>

              {/* In-Store Smart Walk */}
              <button
                onClick={() => setFulfillmentMethod('instore_route')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-2 ${
                  fulfillmentMethod === 'instore_route'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    DIY
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">In-Store Walk Route</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Optimized aisle checklist</p>
                </div>
              </button>
            </div>

            {/* Fulfillment Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Selected CymbalMart Location
                </label>
                <select
                  aria-label="Select CymbalMart location"
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="CymbalMart Supercenter #1042 - North Blvd">CymbalMart Supercenter #1042 - North Blvd</option>
                  <option value="CymbalMart Supercenter #820 - Downtown Plaza">CymbalMart Supercenter #820 - Downtown Plaza</option>
                  <option value="CymbalMart Market & Bakery #314 - Westside">CymbalMart Market & Bakery #314 - Westside</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {fulfillmentMethod === 'express_delivery' ? 'Delivery Window' : 'Curbside Pickup Slot'}
                </label>
                <select
                  aria-label="Select fulfillment time slot"
                  value={pickupSlot}
                  onChange={(e) => setPickupSlot(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Today, 3:00 PM - 5:00 PM">Today, 3:00 PM - 5:00 PM (Express)</option>
                  <option value="Tomorrow, 9:00 AM - 11:00 AM">Tomorrow, 9:00 AM - 11:00 AM (Recommended)</option>
                  <option value="Day of Party, 10:00 AM - 12:00 PM">Day of Party, 10:00 AM - 12:00 PM (Fresh Pick)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Itemized Department Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Itemized Department Breakdown</span>
              <span className="text-xs font-normal text-slate-400">{plan.shoppingList.length} items to fulfill</span>
            </h3>

            <div className="space-y-3">
              {departmentGroups.map(([dept, items]) => {
                const deptSubtotal = items.reduce((s, i) => s + (i.estimatedCost || 0), 0);
                return (
                  <div key={dept} className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{dept}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({items.length} items)</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">${deptSubtotal.toFixed(2)}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <div className="min-w-0 flex-1">
                            <span className="truncate font-semibold text-slate-900 dark:text-white block">{item.name}</span>
                            <span className="text-[10px] text-slate-400">Qty: {item.quantity} {item.unit}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    handleUpdateItemQty(item.id, -1);
                                  } else {
                                    handleRemoveItem(item.id);
                                  }
                                }}
                                className="p-0.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                title={item.quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
                              >
                                {item.quantity <= 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                              </button>
                              <span className="text-[11px] font-bold px-1.5 min-w-[1.2rem] text-center text-slate-800 dark:text-slate-200">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateItemQty(item.id, 1)}
                                className="p-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                                title="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-bold text-slate-900 dark:text-white shrink-0 min-w-[2.5rem] text-right">
                              ${item.estimatedCost}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Finalize Action */}
        <div className="space-y-5">
          {/* Order Total & Budget Comparison */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs sticky top-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Finalized Plan Summary</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                CymbalMart Verified
              </span>
            </h3>

            {/* Budget Meter */}
            <div className={`p-3.5 rounded-xl border ${isBudgetAligned ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60' : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'}`}>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Target Budget</span>
                <span className="text-slate-900 dark:text-white font-bold">${plan.budget.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700 dark:text-slate-300">Final Estimated Cost</span>
                <span className={`font-black text-sm ${isBudgetAligned ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${isBudgetAligned ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min(100, (finalTotal / (plan.budget || 1)) * 100)}%` }}
                />
              </div>

              <div className="mt-2 text-[11px] font-medium text-right">
                {isBudgetAligned ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    ✓ ${variance.toFixed(2)} Under Budget
                  </span>
                ) : (
                  <span className="text-rose-700 dark:text-rose-400 font-bold">
                    ⚠️ ${Math.abs(variance).toFixed(2)} Over Budget
                  </span>
                )}
              </div>
            </div>

            {/* Line items calculation */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex justify-between">
                <span>Items Subtotal ({plan.shoppingList.length} items)</span>
                <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Cymbal Club Promo ({appliedPromo})</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              {fulfillmentMethod === 'express_delivery' && (
                <div className="flex justify-between">
                  <span>2-Hour Delivery Fee</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-semibold text-slate-900 dark:text-white">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                <span>Total Store Brand Savings</span>
                <span>-${storeBrandSavings.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo Code"
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white uppercase font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Apply
              </button>
            </form>

            {/* Final Total */}
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">Final Order Total</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Finalize Action Button */}
            <button
              onClick={handleFinalizePlan}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Finalize & Place CymbalMart Order</span>
            </button>

            <p className="text-[10px] text-center text-slate-400">
              Guaranteed fresh & prepared on time at CymbalMart. Free cancellation up to 4 hours before pickup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
