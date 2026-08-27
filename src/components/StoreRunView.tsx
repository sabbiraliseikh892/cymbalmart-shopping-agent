import React, { useState, useMemo } from 'react';
import { Store, Check, CheckCircle2, ChevronRight, ShoppingCart, DollarSign, MapPin, Tag, ArrowRight } from 'lucide-react';
import { ShoppingItem, CymbalDepartment } from '../types';

interface StoreRunViewProps {
  items: ShoppingItem[];
  onTogglePurchased: (id: string) => void;
}

const AISLE_ORDER = [
  'Aisle 1',
  'Aisle 2',
  'Aisle 3',
  'Aisle 4',
  'Aisle 5',
  'Aisle 6',
  'Aisle 7',
  'Aisle 8',
  'Aisle 9',
  'Aisle 10',
  'Aisle 11',
  'Aisle 12',
  'Aisle 14',
];

export const StoreRunView: React.FC<StoreRunViewProps> = ({ items, onTogglePurchased }) => {
  const [viewMode, setViewMode] = useState<'aisle_route' | 'department'>('aisle_route');

  // Group by Aisle Walk Route
  const aisleGroups = useMemo(() => {
    const map = new Map<string, ShoppingItem[]>();

    items.forEach((item) => {
      let key = item.aisle || 'Aisle 1 - Fresh Produce & General';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });

    return Array.from(map.entries()).map(([aisleName, aisleItems]) => {
      const subtotal = aisleItems.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);
      const completedCount = aisleItems.filter((i) => i.isPurchased).length;
      return {
        name: aisleName,
        items: aisleItems,
        subtotal,
        completedCount,
        isAllCompleted: completedCount === aisleItems.length && aisleItems.length > 0,
      };
    });
  }, [items]);

  // Group by Department
  const departmentGroups = useMemo(() => {
    const map = new Map<string, ShoppingItem[]>();

    items.forEach((item) => {
      let key = item.department || 'Produce';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });

    return Array.from(map.entries()).map(([deptName, deptItems]) => {
      const subtotal = deptItems.reduce((acc, i) => acc + (i.estimatedCost || 0), 0);
      const completedCount = deptItems.filter((i) => i.isPurchased).length;
      return {
        name: deptName,
        items: deptItems,
        subtotal,
        completedCount,
        isAllCompleted: completedCount === deptItems.length && deptItems.length > 0,
      };
    }).sort((a, b) => b.subtotal - a.subtotal);
  }, [items]);

  const activeGroups = viewMode === 'aisle_route' ? aisleGroups : departmentGroups;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                CymbalMart Smart In-Store Walk Route
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organized sequentially by store aisles to eliminate backtracking and speed up grocery runs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('aisle_route')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'aisle_route'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Aisle Route
            </button>
            <button
              onClick={() => setViewMode('department')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'department'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Department
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeGroups.map((group) => (
          <div
            key={group.name}
            className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-xs flex flex-col justify-between ${
              group.isAllCompleted
                ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/10'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              {/* Group Header */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {group.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {group.completedCount} of {group.items.length} items checked
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Subtotal</span>
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    ${group.subtotal.toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Items in this group */}
              <div className="space-y-2 mt-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onTogglePurchased(item.id)}
                    className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border transition cursor-pointer ${
                      item.isPurchased
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-slate-400'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 ${
                          item.isPurchased
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'
                        }`}
                      >
                        <Check className={`w-3 h-3 stroke-[3] ${item.isPurchased ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold truncate ${item.isPurchased ? 'line-through text-slate-400' : ''}`}>
                            {item.name}
                          </span>
                          {item.isStoreBrand && (
                            <span className="text-[9px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1 rounded">
                              Store Brand
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-[10px] text-slate-400 italic truncate">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-right">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {item.quantity} {item.unit}
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        ${item.estimatedCost}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
