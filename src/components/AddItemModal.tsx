import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, ShoppingBag, MapPin, Tag } from 'lucide-react';
import { ShoppingItem, CategoryType, PriorityType, CymbalDepartment } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveItem: (item: ShoppingItem) => void;
  editingItem?: ShoppingItem | null;
}

const CYMBAL_DEPARTMENTS: CymbalDepartment[] = [
  'Produce',
  'Bakery & Deli',
  'Meat & Seafood',
  'Beverages & Bar',
  'Snacks & Pantry',
  'Party Supplies & Tableware',
  'Cleanup & Essentials',
];

const COMMON_STORES = [
  'CymbalMart Supercenter',
  'CymbalMart Bakery Dept',
  'CymbalMart Beverage Dept',
  'CymbalMart Deli',
  'CymbalMart Floral Dept',
  'CymbalMart Party Dept',
];

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSaveItem,
  editingItem,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('food');
  const [department, setDepartment] = useState<CymbalDepartment>('Produce');
  const [aisle, setAisle] = useState('Aisle 1 - Fresh Produce');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('units');
  const [estimatedCost, setEstimatedCost] = useState(10);
  const [storeRecommendation, setStoreRecommendation] = useState(COMMON_STORES[0]);
  const [priority, setPriority] = useState<PriorityType>('must_have');
  const [isStoreBrand, setIsStoreBrand] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setDepartment(editingItem.department || 'Produce');
      setAisle(editingItem.aisle || 'Aisle 1 - Fresh Produce');
      setQuantity(editingItem.quantity);
      setUnit(editingItem.unit);
      setEstimatedCost(editingItem.estimatedCost);
      setStoreRecommendation(editingItem.storeRecommendation || COMMON_STORES[0]);
      setPriority(editingItem.priority);
      setIsStoreBrand(Boolean(editingItem.isStoreBrand));
      setNotes(editingItem.notes || '');
    } else {
      setName('');
      setCategory('food');
      setDepartment('Produce');
      setAisle('Aisle 1 - Fresh Produce');
      setQuantity(1);
      setUnit('packs');
      setEstimatedCost(12);
      setStoreRecommendation(COMMON_STORES[0]);
      setPriority('must_have');
      setIsStoreBrand(false);
      setNotes('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleDepartmentChange = (dept: CymbalDepartment) => {
    setDepartment(dept);
    if (dept === 'Produce') setAisle('Aisle 1 - Fresh Produce & Herbs');
    else if (dept === 'Bakery & Deli') setAisle('Aisle 3 - Artisan Bakery & Deli');
    else if (dept === 'Meat & Seafood') setAisle('Aisle 5 - Cymbal Choice Meats');
    else if (dept === 'Beverages & Bar') setAisle('Aisle 8 - Beverages & Craft Bar');
    else if (dept === 'Snacks & Pantry') setAisle('Aisle 6 - Chips & Party Pantry');
    else if (dept === 'Party Supplies & Tableware') setAisle('Aisle 11 - Tableware & Balloons');
    else if (dept === 'Cleanup & Essentials') setAisle('Aisle 14 - Paper & Cleaning');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: ShoppingItem = {
      id: editingItem ? editingItem.id : `item-${Date.now()}`,
      name: name.trim(),
      category,
      department,
      aisle: aisle.trim() || undefined,
      quantity: Number(quantity) || 1,
      unit: unit.trim() || 'units',
      estimatedCost: Number(estimatedCost) || 0,
      isPurchased: editingItem ? editingItem.isPurchased : false,
      storeRecommendation: storeRecommendation.trim() || 'CymbalMart Supercenter',
      priority,
      isStoreBrand,
      notes: notes.trim() || undefined,
    };

    onSaveItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
            <span>{editingItem ? 'Edit Shopping Item' : 'Add New CymbalMart Item'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Item Name
            </label>
            <input
              type="text"
              placeholder="e.g. Cymbal Choice Boneless Ribeye, Organic Agave, Sparkling Lime"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CymbalMart Department
              </label>
              <select
                aria-label="CymbalMart Department"
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value as CymbalDepartment)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                {CYMBAL_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Store Aisle
              </label>
              <input
                type="text"
                value={aisle}
                onChange={(e) => setAisle(e.target.value)}
                placeholder="e.g. Aisle 1 - Produce"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                aria-label="Select item category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="food">🌮 Food & Catering</option>
                <option value="drinks">🍹 Beverages & Bar</option>
                <option value="decor">🎈 Decor & Atmosphere</option>
                <option value="tableware">🍽️ Tableware</option>
                <option value="favors_games">🎉 Favors & Games</option>
                <option value="essentials_cleanup">🧼 Cleanup & Essentials</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                aria-label="Select item priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="must_have">Must-Have</option>
                <option value="nice_to_have">Nice-to-Have</option>
                <option value="optional">Optional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Qty
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit
              </label>
              <input
                type="text"
                placeholder="lbs, bottles, packs"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Est. Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Store Brand Flag Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
              <input
                type="checkbox"
                checked={isStoreBrand}
                onChange={(e) => setIsStoreBrand(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Cymbal Everyday Value Brand (saves ~22%)</span>
              </span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes & Buying Tips (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Buy morning of party; gluten-free"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-xs transition cursor-pointer"
            >
              {editingItem ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
