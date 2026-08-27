import React, { useState, useMemo } from 'react';
import {
  Check,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  DollarSign,
  Store,
  Tag,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  MapPin,
  HelpCircle,
  Wand2,
  TrendingDown,
  ArrowRight,
  Minus,
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import { ShoppingItem, CategoryType, PriorityType, CymbalDepartment } from '../types';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  budget: number;
  onTogglePurchased: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: ShoppingItem) => void;
  onUpdateItemQuantity?: (id: string, newQuantity: number) => void;
  onUpdateItemCost?: (id: string, newCost: number) => void;
  onQuickAddItem?: (name: string, cost: number, category: CategoryType) => void;
  onOpenAddItem: () => void;
  onAskAiAboutItem: (itemName: string) => void;
  onAutoAlignBudget?: () => Promise<void>;
  onToggleStoreBrand?: (id: string) => void;
  onBatchToggleStoreBrand?: (enable: boolean) => void;
  onProceedToCheckout?: () => void;
}

const CATEGORY_MAP: Record<CategoryType, { label: string; icon: string; color: string }> = {
  food: { label: 'Food & Catering', icon: '🌮', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50' },
  drinks: { label: 'Beverages & Bar', icon: '🍹', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50' },
  decor: { label: 'Decor & Atmosphere', icon: '🎈', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50' },
  tableware: { label: 'Tableware & Serveware', icon: '🍽️', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' },
  favors_games: { label: 'Favors & Games', icon: '🎉', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/50' },
  essentials_cleanup: { label: 'Cleanup & Essentials', icon: '🧼', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800' },
};

const PRIORITY_MAP: Record<PriorityType, { label: string; badge: string }> = {
  must_have: { label: 'Must-Have', badge: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900' },
  nice_to_have: { label: 'Nice-to-Have', badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900' },
  optional: { label: 'Optional', badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' },
};

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  budget,
  onTogglePurchased,
  onDeleteItem,
  onEditItem,
  onUpdateItemQuantity,
  onUpdateItemCost,
  onQuickAddItem,
  onOpenAddItem,
  onAskAiAboutItem,
  onAutoAlignBudget,
  onToggleStoreBrand,
  onBatchToggleStoreBrand,
  onProceedToCheckout,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<PriorityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hidePurchased, setHidePurchased] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // Quick add state
  const [quickName, setQuickName] = useState('');
  const [quickCost, setQuickCost] = useState('');
  const [quickCategory, setQuickCategory] = useState<CategoryType>('food');

  const totalCost = items.reduce((sum, i) => sum + (i.estimatedCost || 0), 0);
  const variance = budget - totalCost;
  const isBudgetAligned = variance >= 0;
  const storeBrandCount = items.filter((i) => i.isStoreBrand).length;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedDepartment !== 'all' && item.department !== selectedDepartment) return false;
      if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
      if (hidePurchased && item.isPurchased) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          (item.department && item.department.toLowerCase().includes(q)) ||
          (item.aisle && item.aisle.toLowerCase().includes(q)) ||
          item.storeRecommendation.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [items, selectedCategory, selectedDepartment, selectedPriority, hidePurchased, searchQuery]);

  const handleStartEditingPrice = (item: ShoppingItem) => {
    setEditingPriceId(item.id);
    setTempPrice(String(item.estimatedCost));
  };

  const handleSavePrice = (itemId: string) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val >= 0 && onUpdateItemCost) {
      onUpdateItemCost(itemId, val);
    }
    setEditingPriceId(null);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim()) return;
    const cost = parseFloat(quickCost) || 8;
    if (onQuickAddItem) {
      onQuickAddItem(quickName.trim(), cost, quickCategory);
      setQuickName('');
      setQuickCost('');
    }
  };

  const categories: (CategoryType | 'all')[] = [
    'all',
    'food',
    'drinks',
    'decor',
    'tableware',
    'favors_games',
    'essentials_cleanup',
  ];

  return (
    <div className="space-y-4">
      {/* CUJ Task 2 Alignment Callout Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        isBudgetAligned
          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
            isBudgetAligned ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}>
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Task 2: Review List & Align Budget
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full ${
                isBudgetAligned ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
              }`}>
                {isBudgetAligned ? `Under Budget by $${variance.toFixed(0)}` : `Over Budget by $${Math.abs(variance).toFixed(0)}`}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Current List: <strong>${totalCost.toFixed(0)}</strong> / Target Budget: <strong>${budget.toFixed(0)}</strong>. {isBudgetAligned ? 'All provisions fit comfortably within budget!' : 'Consider switching items to Cymbal Everyday Value brands or removing nice-to-haves.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isBudgetAligned && onAutoAlignBudget && (
            <button
              onClick={onAutoAlignBudget}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-Align List</span>
            </button>
          )}

          {onProceedToCheckout && (
            <button
              onClick={onProceedToCheckout}
              className="flex items-center gap-1.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>Refine & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Controls Bar & Quick Add */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        {/* Row 1: Search & Filter options */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search items, CymbalMart aisles, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter options and Add Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              aria-label="Filter items by priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="must_have">Must-Have</option>
              <option value="nice_to_have">Nice-to-Have</option>
              <option value="optional">Optional</option>
            </select>

            <button
              onClick={() => setHidePurchased(!hidePurchased)}
              className={`text-xs font-medium px-3 py-2 rounded-xl border transition cursor-pointer ${
                hidePurchased
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {hidePurchased ? 'Showing Unpurchased' : 'Hide Purchased'}
            </button>

            {onBatchToggleStoreBrand && (
              <button
                onClick={() => onBatchToggleStoreBrand(storeBrandCount < items.length)}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 transition cursor-pointer"
                title="Convert all items to Cymbal Everyday Value store brands for ~22% savings"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{storeBrandCount < items.length ? 'Swap All to Cymbal Brand' : 'Reset Brands'}</span>
              </button>
            )}

            <button
              onClick={onOpenAddItem}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-xs transition ml-auto md:ml-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Item</span>
            </button>
          </div>
        </div>

        {/* Row 2: Quick-Add Item Bar */}
        {onQuickAddItem && (
          <form
            onSubmit={handleQuickAddSubmit}
            className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs flex-wrap sm:flex-nowrap"
          >
            <div className="flex items-center gap-1.5 text-slate-400 pl-1 shrink-0 font-medium">
              <Plus className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300">Quick Add:</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Avocado Dip, Sparkling Soda, Napkins..."
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-slate-400 text-xs">$</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Est $"
                value={quickCost}
                onChange={(e) => setQuickCost(e.target.value)}
                className="w-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
              />
            </div>
            <select
              aria-label="Category for quick added item"
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value as CategoryType)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none shrink-0"
            >
              <option value="food">🌮 Food</option>
              <option value="drinks">🍹 Drinks</option>
              <option value="decor">🎈 Decor</option>
              <option value="tableware">🍽️ Tableware</option>
              <option value="favors_games">🎉 Favors</option>
              <option value="essentials_cleanup">🧼 Cleanup</option>
            </select>
            <button
              type="submit"
              disabled={!quickName.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded-lg shadow-xs transition cursor-pointer shrink-0"
            >
              + Add
            </button>
          </form>
        )}

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count = cat === 'all' ? items.length : items.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 border-transparent shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat !== 'all' && <span>{CATEGORY_MAP[cat].icon}</span>}
                <span>{cat === 'all' ? 'All Items' : CATEGORY_MAP[cat].label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 dark:bg-slate-950/20' : 'bg-slate-200 dark:bg-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Item List Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No shopping items found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all'
              ? 'Try clearing your filters or search keywords.'
              : 'Add custom items or ask CymbalMart Assistant to populate your list!'}
          </p>
          <button
            onClick={onOpenAddItem}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP.food;
            const priorityInfo = PRIORITY_MAP[item.priority] || PRIORITY_MAP.must_have;
            const isEditingThisPrice = editingPriceId === item.id;

            return (
              <div
                key={item.id}
                className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-200 shadow-xs ${
                  item.isPurchased
                    ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/30 dark:bg-emerald-950/10 opacity-75'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Purchased Checkbox */}
                  <button
                    onClick={() => onTogglePurchased(item.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition cursor-pointer shrink-0 ${
                      item.isPurchased
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-transparent'
                    }`}
                    title={item.isPurchased ? 'Mark as needed' : 'Mark as purchased'}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${item.isPurchased ? 'opacity-100' : 'opacity-0'}`} />
                  </button>

                  {/* Main Item Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4
                            className={`text-sm font-bold truncate ${
                              item.isPurchased
                                ? 'line-through text-slate-500 dark:text-slate-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {item.name}
                          </h4>
                          {item.isStoreBrand && (
                            <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded shrink-0 border border-emerald-200 dark:border-emerald-800">
                              Cymbal Brand
                            </span>
                          )}
                        </div>

                        {/* Aisle & Department Badge */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {item.aisle || (item.department ? `CymbalMart ${item.department}` : 'Aisle 1 - General')}
                          </span>
                        </div>
                      </div>

                      {/* Cost and Interactive Price Editor */}
                      <div className="text-right shrink-0">
                        {isEditingThisPrice ? (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-400">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              onBlur={() => handleSavePrice(item.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSavePrice(item.id);
                                if (e.key === 'Escape') setEditingPriceId(null);
                              }}
                              autoFocus
                              className="w-16 bg-slate-100 dark:bg-slate-800 border border-emerald-500 rounded px-1.5 py-0.5 text-sm font-black text-slate-900 dark:text-white text-right focus:outline-none"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditingPrice(item)}
                            className="group/price flex flex-col items-end cursor-pointer hover:opacity-80"
                            title="Click to edit price directly"
                          >
                            <span className="text-sm font-black text-slate-900 dark:text-white group-hover/price:text-emerald-500 transition-colors">
                              ${item.estimatedCost}
                            </span>
                            {item.originalEstimatedCost && item.originalEstimatedCost > item.estimatedCost && (
                              <span className="text-[10px] text-slate-400 line-through block">
                                was ${item.originalEstimatedCost}
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper & Category/Priority Badges */}
                    <div className="flex items-center flex-wrap gap-2 mt-2">
                      {/* Interactive Quantity Stepper */}
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => {
                            if (item.quantity > 1 && onUpdateItemQuantity) {
                              onUpdateItemQuantity(item.id, item.quantity - 1);
                            } else if (item.quantity <= 1) {
                              onDeleteItem(item.id);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded transition cursor-pointer"
                          title={item.quantity <= 1 ? 'Remove item' : 'Decrease quantity'}
                        >
                          {item.quantity <= 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        </button>
                        <span className="text-xs font-bold text-slate-900 dark:text-white px-2 min-w-[2.5rem] text-center">
                          {item.quantity} {item.unit}
                        </span>
                        <button
                          onClick={() => {
                            if (onUpdateItemQuantity) {
                              onUpdateItemQuantity(item.id, item.quantity + 1);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded transition cursor-pointer"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${catInfo.color}`}>
                        {catInfo.icon} {catInfo.label}
                      </span>

                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${priorityInfo.badge}`}>
                        {priorityInfo.label}
                      </span>

                      {item.dietaryTags?.map((tag) => (
                        <span key={tag} className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Store recommendation & notes */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 truncate">
                        <Store className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate font-medium">{item.storeRecommendation || 'CymbalMart Supercenter'}</span>
                      </div>

                      {/* Item Quick Actions */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition shrink-0">
                        {onToggleStoreBrand && (
                          <button
                            onClick={() => onToggleStoreBrand(item.id)}
                            className={`p-1 rounded-md transition cursor-pointer ${
                              item.isStoreBrand
                                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                            title={item.isStoreBrand ? 'Active Cymbal Brand (22% savings)' : 'Switch to Cymbal Brand'}
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onAskAiAboutItem(item.name)}
                          className="p-1 rounded-md text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                          title="Ask CymbalMart Assistant for recipe, swap or tips for this item"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                          title="Full edit item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                        💡 {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
